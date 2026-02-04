import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface TodoAssignment {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  pdfUrl: string | null;
  createdAt: string;
  classId: string;
  className: string;
  classSubject: string;
  status: "assigned" | "submitted" | "graded";
  submissionId?: string;
  grade?: string | null;
}

export function useTodoAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<TodoAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodoAssignments = async () => {
    if (!user) {
      setAssignments([]);
      setLoading(false);
      return;
    }

    try {
      // Get user's enrolled classes
      const { data: enrollments, error: enrollError } = await supabase
        .from("enrollments")
        .select(`
          class_id,
          role,
          classes (
            id,
            name,
            subject
          )
        `)
        .eq("user_id", user.id);

      if (enrollError) throw enrollError;

      if (!enrollments || enrollments.length === 0) {
        setAssignments([]);
        setLoading(false);
        return;
      }

      const classIds = enrollments.map((e) => e.class_id);

      // Get all assignments for enrolled classes
      const { data: assignmentsData, error: assignError } = await supabase
        .from("assignments")
        .select("*")
        .in("class_id", classIds)
        .order("created_at", { ascending: false });

      if (assignError) throw assignError;

      // Get user's submissions
      const { data: submissions, error: subError } = await supabase
        .from("submissions")
        .select("*")
        .eq("student_id", user.id);

      if (subError) throw subError;

      const submissionMap = new Map(
        (submissions || []).map((s) => [s.assignment_id, s])
      );

      // Create a map of class details
      const classMap = new Map(
        enrollments.map((e) => {
          const classData = e.classes as unknown as { id: string; name: string; subject: string };
          return [e.class_id, classData];
        })
      );

      const formattedAssignments: TodoAssignment[] = (assignmentsData || []).map((a) => {
        const submission = submissionMap.get(a.id);
        const classInfo = classMap.get(a.class_id);
        
        let status: "assigned" | "submitted" | "graded" = "assigned";
        if (submission) {
          status = submission.grade ? "graded" : "submitted";
        }

        return {
          id: a.id,
          title: a.title,
          description: a.description,
          dueDate: a.due_date,
          pdfUrl: a.pdf_url,
          createdAt: a.created_at,
          classId: a.class_id,
          className: classInfo?.name || "Unknown Class",
          classSubject: classInfo?.subject || "",
          status,
          submissionId: submission?.id,
          grade: submission?.grade,
        };
      });

      setAssignments(formattedAssignments);
    } catch (error) {
      console.error("Error fetching todo assignments:", error);
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodoAssignments();
  }, [user]);

  const assignedAssignments = assignments.filter((a) => a.status === "assigned");
  const submittedAssignments = assignments.filter((a) => a.status === "submitted" || a.status === "graded");
  
  // Missing = assigned but past due date
  const missingAssignments = assignments.filter((a) => {
    if (a.status !== "assigned" || !a.dueDate) return false;
    return new Date(a.dueDate) < new Date();
  });

  return {
    assignments,
    assignedAssignments,
    submittedAssignments,
    missingAssignments,
    loading,
    refetch: fetchTodoAssignments,
  };
}
