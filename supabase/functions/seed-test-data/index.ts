import { createClient } from "https://esm.sh/@supabase/supabase-js@2.93.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Get the user's auth token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create client with user's token to get their ID
    const supabaseUser = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid user token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role client for inserts (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Sample PDF URLs
    const pdfUrls = [
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      "https://www.africau.edu/images/default/sample.pdf",
      "https://www.orimi.com/pdf-test.pdf",
    ];

    // Create 3 sample classes
    const classesData = [
      { name: "Mathematics 101", subject: "Mathematics", description: "Introduction to Calculus and Linear Algebra" },
      { name: "Computer Science Fundamentals", subject: "Computer Science", description: "Data Structures and Algorithms" },
      { name: "Physics for Engineers", subject: "Physics", description: "Classical Mechanics and Thermodynamics" },
    ];

    const createdClasses = [];

    for (const classData of classesData) {
      const { data: newClass, error: classError } = await supabase
        .from("classes")
        .insert({
          ...classData,
          created_by: user.id,
        })
        .select()
        .single();

      if (classError) {
        console.error("Error creating class:", classError);
        continue;
      }

      createdClasses.push(newClass);

      // Create assignments for each class
      const assignmentsData = [
        {
          title: `${classData.subject} - Assignment 1`,
          description: "Complete exercises 1-10 from Chapter 1",
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          pdf_url: pdfUrls[0],
        },
        {
          title: `${classData.subject} - Quiz Preparation`,
          description: "Review all lecture notes and prepare for upcoming quiz",
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          pdf_url: pdfUrls[1],
        },
      ];

      for (const assignment of assignmentsData) {
        await supabase.from("assignments").insert({
          ...assignment,
          class_id: newClass.id,
          created_by: user.id,
        });
      }

      // Create notes for each class
      const notesData = [
        { title: `${classData.subject} - Lecture Notes Week 1`, pdf_url: pdfUrls[0] },
        { title: `${classData.subject} - Study Guide`, pdf_url: pdfUrls[2] },
      ];

      for (const note of notesData) {
        await supabase.from("notes").insert({
          ...note,
          class_id: newClass.id,
          uploaded_by: user.id,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Created ${createdClasses.length} classes with assignments and notes`,
        classes: createdClasses.map((c) => ({ id: c.id, name: c.name, class_code: c.class_code })),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error seeding data:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
