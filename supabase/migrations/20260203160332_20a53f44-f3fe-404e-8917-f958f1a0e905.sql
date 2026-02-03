-- =============================================
-- ENUMS
-- =============================================

-- Role enum for class enrollments
CREATE TYPE public.enrollment_role AS ENUM ('teacher', 'student');

-- =============================================
-- TABLES
-- =============================================

-- Classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  class_code TEXT UNIQUE DEFAULT substr(md5(random()::text), 1, 6),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enrollments table (links users to classes with roles)
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role enrollment_role NOT NULL DEFAULT 'student',
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(class_id, user_id)
);

-- Assignments table
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  pdf_url TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Submissions table
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  submission_url TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  grade TEXT,
  graded_at TIMESTAMP WITH TIME ZONE,
  graded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE(assignment_id, student_id)
);

-- Notes table (for PDFs and class materials)
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- =============================================
-- SECURITY DEFINER FUNCTIONS (avoid RLS recursion)
-- =============================================

-- Check if user is enrolled in a class
CREATE OR REPLACE FUNCTION public.is_enrolled_in_class(_user_id UUID, _class_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE user_id = _user_id AND class_id = _class_id
  )
$$;

-- Check if user is a teacher in a class
CREATE OR REPLACE FUNCTION public.is_teacher_in_class(_user_id UUID, _class_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE user_id = _user_id AND class_id = _class_id AND role = 'teacher'
  )
$$;

-- Check if user is a student in a class
CREATE OR REPLACE FUNCTION public.is_student_in_class(_user_id UUID, _class_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE user_id = _user_id AND class_id = _class_id AND role = 'student'
  )
$$;

-- Get class_id from assignment_id
CREATE OR REPLACE FUNCTION public.get_class_id_from_assignment(_assignment_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT class_id FROM public.assignments WHERE id = _assignment_id
$$;

-- =============================================
-- RLS POLICIES: CLASSES
-- =============================================

-- Teachers (creators) can view their own classes
CREATE POLICY "Creators can view their classes"
ON public.classes FOR SELECT
TO authenticated
USING (created_by = auth.uid());

-- Enrolled users can view classes they're enrolled in
CREATE POLICY "Enrolled users can view classes"
ON public.classes FOR SELECT
TO authenticated
USING (public.is_enrolled_in_class(auth.uid(), id));

-- Only authenticated users can create classes (they become the teacher)
CREATE POLICY "Authenticated users can create classes"
ON public.classes FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

-- Only the creator (teacher) can update their classes
CREATE POLICY "Creators can update their classes"
ON public.classes FOR UPDATE
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- Only the creator (teacher) can delete their classes
CREATE POLICY "Creators can delete their classes"
ON public.classes FOR DELETE
TO authenticated
USING (created_by = auth.uid());

-- =============================================
-- RLS POLICIES: ENROLLMENTS
-- =============================================

-- Users can view their own enrollments
CREATE POLICY "Users can view own enrollments"
ON public.enrollments FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Teachers can view all enrollments in their classes
CREATE POLICY "Teachers can view class enrollments"
ON public.enrollments FOR SELECT
TO authenticated
USING (public.is_teacher_in_class(auth.uid(), class_id));

-- Users can enroll themselves as students
CREATE POLICY "Users can enroll as students"
ON public.enrollments FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() AND role = 'student'
);

-- Class creators can add teachers to their classes
CREATE POLICY "Creators can add enrollments"
ON public.enrollments FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.classes
    WHERE id = class_id AND created_by = auth.uid()
  )
);

-- Users can remove themselves from classes
CREATE POLICY "Users can unenroll themselves"
ON public.enrollments FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Teachers can remove students from their classes
CREATE POLICY "Teachers can remove enrollments"
ON public.enrollments FOR DELETE
TO authenticated
USING (public.is_teacher_in_class(auth.uid(), class_id));

-- =============================================
-- RLS POLICIES: ASSIGNMENTS
-- =============================================

-- Enrolled users can view assignments in their classes
CREATE POLICY "Enrolled users can view assignments"
ON public.assignments FOR SELECT
TO authenticated
USING (public.is_enrolled_in_class(auth.uid(), class_id));

-- Teachers can create assignments in their classes
CREATE POLICY "Teachers can create assignments"
ON public.assignments FOR INSERT
TO authenticated
WITH CHECK (
  created_by = auth.uid() AND
  public.is_teacher_in_class(auth.uid(), class_id)
);

-- Teachers can update assignments they created
CREATE POLICY "Teachers can update their assignments"
ON public.assignments FOR UPDATE
TO authenticated
USING (
  created_by = auth.uid() AND
  public.is_teacher_in_class(auth.uid(), class_id)
)
WITH CHECK (
  created_by = auth.uid() AND
  public.is_teacher_in_class(auth.uid(), class_id)
);

-- Teachers can delete assignments they created
CREATE POLICY "Teachers can delete their assignments"
ON public.assignments FOR DELETE
TO authenticated
USING (
  created_by = auth.uid() AND
  public.is_teacher_in_class(auth.uid(), class_id)
);

-- =============================================
-- RLS POLICIES: SUBMISSIONS
-- =============================================

-- Students can view their own submissions
CREATE POLICY "Students can view own submissions"
ON public.submissions FOR SELECT
TO authenticated
USING (student_id = auth.uid());

-- Teachers can view submissions in their classes
CREATE POLICY "Teachers can view class submissions"
ON public.submissions FOR SELECT
TO authenticated
USING (
  public.is_teacher_in_class(
    auth.uid(),
    public.get_class_id_from_assignment(assignment_id)
  )
);

-- Students can submit to assignments (only in enrolled classes)
CREATE POLICY "Students can create submissions"
ON public.submissions FOR INSERT
TO authenticated
WITH CHECK (
  student_id = auth.uid() AND
  public.is_student_in_class(
    auth.uid(),
    public.get_class_id_from_assignment(assignment_id)
  )
);

-- Students can update their own submissions (before grading)
CREATE POLICY "Students can update own submissions"
ON public.submissions FOR UPDATE
TO authenticated
USING (student_id = auth.uid() AND grade IS NULL)
WITH CHECK (student_id = auth.uid());

-- Teachers can grade submissions (update grade field)
CREATE POLICY "Teachers can grade submissions"
ON public.submissions FOR UPDATE
TO authenticated
USING (
  public.is_teacher_in_class(
    auth.uid(),
    public.get_class_id_from_assignment(assignment_id)
  )
)
WITH CHECK (
  public.is_teacher_in_class(
    auth.uid(),
    public.get_class_id_from_assignment(assignment_id)
  )
);

-- =============================================
-- RLS POLICIES: NOTES
-- =============================================

-- Enrolled users can view notes in their classes
CREATE POLICY "Enrolled users can view notes"
ON public.notes FOR SELECT
TO authenticated
USING (public.is_enrolled_in_class(auth.uid(), class_id));

-- Teachers can upload notes to their classes
CREATE POLICY "Teachers can create notes"
ON public.notes FOR INSERT
TO authenticated
WITH CHECK (
  uploaded_by = auth.uid() AND
  public.is_teacher_in_class(auth.uid(), class_id)
);

-- Teachers can update their notes
CREATE POLICY "Teachers can update their notes"
ON public.notes FOR UPDATE
TO authenticated
USING (
  uploaded_by = auth.uid() AND
  public.is_teacher_in_class(auth.uid(), class_id)
)
WITH CHECK (
  uploaded_by = auth.uid() AND
  public.is_teacher_in_class(auth.uid(), class_id)
);

-- Teachers can delete their notes
CREATE POLICY "Teachers can delete their notes"
ON public.notes FOR DELETE
TO authenticated
USING (
  uploaded_by = auth.uid() AND
  public.is_teacher_in_class(auth.uid(), class_id)
);

-- =============================================
-- TRIGGER: Auto-enroll class creator as teacher
-- =============================================

CREATE OR REPLACE FUNCTION public.auto_enroll_creator_as_teacher()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.enrollments (class_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'teacher');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_class_created
AFTER INSERT ON public.classes
FOR EACH ROW
EXECUTE FUNCTION public.auto_enroll_creator_as_teacher();

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_class_id ON public.enrollments(class_id);
CREATE INDEX idx_assignments_class_id ON public.assignments(class_id);
CREATE INDEX idx_submissions_assignment_id ON public.submissions(assignment_id);
CREATE INDEX idx_submissions_student_id ON public.submissions(student_id);
CREATE INDEX idx_notes_class_id ON public.notes(class_id);
CREATE INDEX idx_classes_class_code ON public.classes(class_code);