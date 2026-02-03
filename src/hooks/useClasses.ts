import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

interface ClassData {
  id: string;
  name: string;
  subject: string;
  description: string | null;
  class_code: string | null;
  created_by: string;
  created_at: string;
}

interface EnrollmentWithClass {
  class_id: string;
  role: "teacher" | "student";
  classes: ClassData;
}

export interface ClassWithRole {
  id: string;
  name: string;
  subject: string;
  description: string | null;
  classCode: string | null;
  role: "teacher" | "student";
  createdBy: string;
}

const COLORS = ["teal", "green", "blue", "purple", "pink", "orange", "brown", "gray"];

export function useClasses() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    if (!user) {
      setClasses([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          class_id,
          role,
          classes (
            id,
            name,
            subject,
            description,
            class_code,
            created_by,
            created_at
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      const enrollments = data as unknown as EnrollmentWithClass[];
      
      const formattedClasses: ClassWithRole[] = enrollments.map((enrollment, index) => ({
        id: enrollment.classes.id,
        name: enrollment.classes.name,
        subject: enrollment.classes.subject,
        description: enrollment.classes.description,
        classCode: enrollment.classes.class_code,
        role: enrollment.role,
        createdBy: enrollment.classes.created_by,
        color: COLORS[index % COLORS.length],
      }));

      setClasses(formattedClasses);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [user]);

  const createClass = async (data: { name: string; subject: string; description?: string }) => {
    if (!user) {
      toast.error("You must be signed in to create a class");
      return null;
    }

    try {
      const { data: newClass, error } = await supabase
        .from("classes")
        .insert({
          name: data.name,
          subject: data.subject,
          description: data.description || null,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Class created successfully!");
      await fetchClasses(); // Refresh to get enrollment
      return newClass;
    } catch (error) {
      console.error("Error creating class:", error);
      toast.error("Failed to create class");
      return null;
    }
  };

  const joinClass = async (code: string) => {
    if (!user) {
      toast.error("You must be signed in to join a class");
      return false;
    }

    try {
      // Find class by code
      const { data: classData, error: classError } = await supabase
        .from("classes")
        .select("id, name")
        .eq("class_code", code.toLowerCase())
        .maybeSingle();

      if (classError) throw classError;

      if (!classData) {
        toast.error("Class not found. Check the code and try again.");
        return false;
      }

      // Check if already enrolled
      const { data: existingEnrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("class_id", classData.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingEnrollment) {
        toast.error("You're already enrolled in this class");
        return false;
      }

      // Enroll as student
      const { error: enrollError } = await supabase
        .from("enrollments")
        .insert({
          class_id: classData.id,
          user_id: user.id,
          role: "student",
        });

      if (enrollError) throw enrollError;

      toast.success(`Joined ${classData.name}!`);
      await fetchClasses();
      return true;
    } catch (error) {
      console.error("Error joining class:", error);
      toast.error("Failed to join class");
      return false;
    }
  };

  return { classes, loading, createClass, joinClass, refetch: fetchClasses };
}
