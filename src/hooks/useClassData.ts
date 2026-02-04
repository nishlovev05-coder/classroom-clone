import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Assignment {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  pdfUrl: string | null;
  createdAt: string;
  classId: string;
  className?: string;
}

export interface Note {
  id: string;
  title: string;
  pdfUrl: string;
  createdAt: string;
  classId: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submissionUrl: string | null;
  submittedAt: string;
  grade: string | null;
}

export interface ClassMember {
  id: string;
  userId: string;
  role: "teacher" | "student";
  enrolledAt: string;
  displayName?: string;
  email?: string;
}

export function useClassData(classId: string | null) {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [members, setMembers] = useState<ClassMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClassData = async () => {
    if (!classId || !user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from("assignments")
        .select("*")
        .eq("class_id", classId)
        .order("created_at", { ascending: false });

      if (assignmentsError) throw assignmentsError;

      // Fetch notes
      const { data: notesData, error: notesError } = await supabase
        .from("notes")
        .select("*")
        .eq("class_id", classId)
        .order("created_at", { ascending: false });

      if (notesError) throw notesError;

      // Fetch enrollments (members)
      const { data: membersData, error: membersError } = await supabase
        .from("enrollments")
        .select("*")
        .eq("class_id", classId);

      if (membersError) throw membersError;

      setAssignments(
        (assignmentsData || []).map((a) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          dueDate: a.due_date,
          pdfUrl: a.pdf_url,
          createdAt: a.created_at,
          classId: a.class_id,
        }))
      );

      setNotes(
        (notesData || []).map((n) => ({
          id: n.id,
          title: n.title,
          pdfUrl: n.pdf_url,
          createdAt: n.created_at,
          classId: n.class_id,
        }))
      );

      setMembers(
        (membersData || []).map((m) => ({
          id: m.id,
          userId: m.user_id,
          role: m.role,
          enrolledAt: m.enrolled_at,
        }))
      );
    } catch (error) {
      console.error("Error fetching class data:", error);
      toast.error("Failed to load class data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassData();
  }, [classId, user]);

  const createAssignment = async (data: {
    title: string;
    description?: string;
    dueDate?: string;
    pdfUrl?: string;
  }) => {
    if (!user || !classId) {
      toast.error("Unable to create assignment");
      return null;
    }

    try {
      const { data: newAssignment, error } = await supabase
        .from("assignments")
        .insert({
          class_id: classId,
          title: data.title,
          description: data.description || null,
          due_date: data.dueDate || null,
          pdf_url: data.pdfUrl || null,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Assignment created!");
      await fetchClassData();
      return newAssignment;
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast.error("Failed to create assignment");
      return null;
    }
  };

  const createNote = async (data: { title: string; pdfUrl: string }) => {
    if (!user || !classId) {
      toast.error("Unable to create note");
      return null;
    }

    try {
      const { data: newNote, error } = await supabase
        .from("notes")
        .insert({
          class_id: classId,
          title: data.title,
          pdf_url: data.pdfUrl,
          uploaded_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Note uploaded!");
      await fetchClassData();
      return newNote;
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to upload note");
      return null;
    }
  };

  return {
    assignments,
    notes,
    members,
    loading,
    createAssignment,
    createNote,
    refetch: fetchClassData,
  };
}
