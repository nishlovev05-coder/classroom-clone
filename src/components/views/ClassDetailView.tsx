import { useState } from "react";
import { Settings, Info, MoreVertical, UserPlus, Plus, ChevronDown, ChevronUp, FileText, ClipboardList } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useClassData } from "@/hooks/useClassData";
import { CreateAssignmentModal } from "@/components/classroom/CreateAssignmentModal";
import { AssignmentCard } from "@/components/classroom/AssignmentCard";
import { Loader2 } from "lucide-react";

interface ClassDetailViewProps {
  classData: {
    id: string;
    name: string;
    section: string;
    teacher: string;
    color: string;
    classCode?: string | null;
  };
}

export function ClassDetailView({ classData }: ClassDetailViewProps) {
  const [activeTab, setActiveTab] = useState<"stream" | "classwork" | "people" | "grades">("stream");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createType, setCreateType] = useState<"assignment" | "material">("assignment");
  const [assignmentsOpen, setAssignmentsOpen] = useState(true);
  const [materialsOpen, setMaterialsOpen] = useState(true);

  const { assignments, notes, members, loading, createAssignment, createNote } = useClassData(classData.id);

  const tabs = [
    { id: "stream", label: "Stream" },
    { id: "classwork", label: "Classwork" },
    { id: "people", label: "People" },
    { id: "grades", label: "Grades" },
  ];

  const headerColors: Record<string, string> = {
    teal: "class-header-teal",
    green: "class-header-green",
    blue: "class-header-blue",
    purple: "class-header-purple",
    pink: "class-header-pink",
    orange: "class-header-orange",
    brown: "class-header-brown",
    gray: "class-header-gray",
  };

  const handleCreateAssignment = async (data: {
    title: string;
    description?: string;
    dueDate?: string;
    pdfUrl?: string;
  }) => {
    if (createType === "assignment") {
      await createAssignment(data);
    } else {
      // For materials, we use the notes table
      await createNote({
        title: data.title,
        pdfUrl: data.pdfUrl || "",
      });
    }
  };

  const teachers = members.filter((m) => m.role === "teacher");
  const students = members.filter((m) => m.role === "student");

  return (
    <div className="flex-1">
      {/* Tabs */}
      <div className="border-b border-border bg-background sticky top-16 z-30">
        <div className="flex justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "px-6 py-4 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
          <button className="px-4 py-4">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Stream View */}
      {activeTab === "stream" && (
        <div className="max-w-4xl mx-auto p-6">
          {/* Class Header Banner */}
          <div className={cn("rounded-lg p-6 mb-6 relative overflow-hidden", headerColors[classData.color] || "class-header-teal")}>
            <div className="relative z-10">
              <h1 className="text-3xl font-google-sans text-primary-foreground mb-1">
                {classData.name}
              </h1>
              <p className="text-lg text-primary-foreground/90">{classData.section}</p>
            </div>
            <button className="absolute bottom-4 right-4 gc-icon-btn bg-primary-foreground/20 hover:bg-primary-foreground/30">
              <Info className="h-5 w-5 text-primary-foreground" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column - Class Code & Upcoming */}
            <div className="space-y-4">
              {/* Class Code Card */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Class code</span>
                  <button className="gc-icon-btn p-1">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-2xl font-google-sans text-primary">
                  {classData.classCode || "------"}
                </p>
              </div>

              {/* Upcoming Card */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-medium text-foreground mb-2">Upcoming</h3>
                {assignments.filter(a => a.dueDate && new Date(a.dueDate) > new Date()).length > 0 ? (
                  <div className="space-y-2">
                    {assignments
                      .filter(a => a.dueDate && new Date(a.dueDate) > new Date())
                      .slice(0, 3)
                      .map(a => (
                        <p key={a.id} className="text-sm text-muted-foreground truncate">
                          {a.title}
                        </p>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Woohoo, no work due soon!</p>
                )}
                <button className="text-sm text-primary font-medium mt-3 hover:underline">
                  View all
                </button>
              </div>
            </div>

            {/* Right Column - Stream */}
            <div className="lg:col-span-3 space-y-4">
              {/* Announcement Input */}
              <div className="bg-card border border-border rounded-lg p-4 shadow-material-1">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-classroom-teal text-primary-foreground">U</AvatarFallback>
                  </Avatar>
                  <button className="flex-1 text-left text-muted-foreground text-sm py-2 px-4 bg-muted rounded-full hover:bg-muted/80 transition-colors">
                    Announce something to your class
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              {(assignments.length > 0 || notes.length > 0) ? (
                <div className="space-y-2">
                  {assignments.slice(0, 5).map((assignment) => (
                    <div key={assignment.id} className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <ClipboardList className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">New assignment:</span> {assignment.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Posted {new Date(assignment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-48 h-48 mx-auto mb-4 opacity-50">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      <circle cx="100" cy="100" r="80" fill="hsl(var(--muted))" />
                      <rect x="70" y="60" width="60" height="80" rx="4" fill="hsl(var(--background))" />
                      <rect x="80" y="75" width="40" height="4" fill="hsl(var(--muted-foreground))" />
                      <rect x="80" y="85" width="30" height="4" fill="hsl(var(--muted-foreground))" />
                      <rect x="80" y="95" width="35" height="4" fill="hsl(var(--muted-foreground))" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground">
                    This is where you can talk to your class
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Classwork View */}
      {activeTab === "classwork" && (
        <div className="max-w-4xl mx-auto p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() => {
                        setCreateType("assignment");
                        setCreateModalOpen(true);
                      }}
                    >
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Assignment
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setCreateType("material");
                        setCreateModalOpen(true);
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Material
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Assignments Section */}
              <div className="mb-6">
                <button
                  onClick={() => setAssignmentsOpen(!assignmentsOpen)}
                  className="flex items-center justify-between w-full py-3 border-b border-primary"
                >
                  <h2 className="text-lg font-google-sans text-primary">Assignments</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{assignments.length}</span>
                    {assignmentsOpen ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {assignmentsOpen && (
                  <div className="mt-2 space-y-1">
                    {assignments.length > 0 ? (
                      assignments.map((assignment) => (
                        <AssignmentCard
                          key={assignment.id}
                          id={assignment.id}
                          title={assignment.title}
                          description={assignment.description}
                          dueDate={assignment.dueDate}
                          pdfUrl={assignment.pdfUrl}
                          createdAt={assignment.createdAt}
                          type="assignment"
                        />
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground py-4 text-center">
                        No assignments yet
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Materials Section */}
              <div className="mb-6">
                <button
                  onClick={() => setMaterialsOpen(!materialsOpen)}
                  className="flex items-center justify-between w-full py-3 border-b border-classroom-purple"
                >
                  <h2 className="text-lg font-google-sans text-classroom-purple">Materials</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{notes.length}</span>
                    {materialsOpen ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {materialsOpen && (
                  <div className="mt-2 space-y-1">
                    {notes.length > 0 ? (
                      notes.map((note) => (
                        <AssignmentCard
                          key={note.id}
                          id={note.id}
                          title={note.title}
                          pdfUrl={note.pdfUrl}
                          createdAt={note.createdAt}
                          type="material"
                        />
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground py-4 text-center">
                        No materials yet
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* People View */}
      {activeTab === "people" && (
        <div className="max-w-4xl mx-auto p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Teachers Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between border-b border-primary pb-2 mb-4">
                  <h2 className="text-3xl font-google-sans text-primary">Teachers</h2>
                </div>
                {teachers.length > 0 ? (
                  teachers.map((teacher) => (
                    <div key={teacher.id} className="flex items-center gap-4 p-2">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-classroom-purple text-primary-foreground">
                          T
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-foreground">Teacher</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-4 p-2">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-classroom-purple text-primary-foreground">
                        {classData.teacher.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-foreground">{classData.teacher}</span>
                  </div>
                )}
              </div>

              {/* Students Section */}
              <div>
                <div className="flex items-center justify-between border-b border-primary pb-2 mb-4">
                  <h2 className="text-3xl font-google-sans text-primary">
                    Students
                    {students.length > 0 && (
                      <span className="text-lg font-normal text-muted-foreground ml-2">
                        ({students.length})
                      </span>
                    )}
                  </h2>
                  <button className="gc-icon-btn">
                    <UserPlus className="h-5 w-5 text-primary" />
                  </button>
                </div>
                {students.length > 0 ? (
                  students.map((student) => (
                    <div key={student.id} className="flex items-center gap-4 p-2 hover:bg-muted/50 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-classroom-teal text-primary-foreground">
                          S
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-foreground">Student</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No students yet</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Grades View */}
      {activeTab === "grades" && (
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <div className="w-48 h-48 mx-auto mb-4 opacity-50">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="80" fill="hsl(var(--muted))" />
                <rect x="50" y="60" width="100" height="80" rx="4" fill="hsl(var(--background))" />
                <rect x="60" y="75" width="30" height="20" fill="hsl(var(--primary))" opacity="0.3" />
                <rect x="95" y="75" width="30" height="20" fill="hsl(var(--primary))" opacity="0.5" />
                <rect x="60" y="100" width="30" height="25" fill="hsl(var(--primary))" opacity="0.7" />
                <rect x="95" y="100" width="30" height="25" fill="hsl(var(--primary))" />
              </svg>
            </div>
            <p className="text-muted-foreground">
              No grades yet
            </p>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      <CreateAssignmentModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreateAssignment={handleCreateAssignment}
        type={createType}
      />
    </div>
  );
}
