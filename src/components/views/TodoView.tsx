import { useState } from "react";
import { ChevronDown, ChevronUp, ClipboardList, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTodoAssignments, TodoAssignment } from "@/hooks/useTodoAssignments";
import { useClasses } from "@/hooks/useClasses";

export function TodoView() {
  const [activeTab, setActiveTab] = useState<"assigned" | "missing" | "done">("assigned");
  const [selectedClass, setSelectedClass] = useState("all");
  const [noDueDateOpen, setNoDueDateOpen] = useState(true);
  const [withDueDateOpen, setWithDueDateOpen] = useState(true);

  const { assignedAssignments, missingAssignments, submittedAssignments, loading } = useTodoAssignments();
  const { classes } = useClasses();

  const tabs = [
    { id: "assigned", label: "Assigned" },
    { id: "missing", label: "Missing" },
    { id: "done", label: "Done" },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <ClipboardList className="h-5 w-5 text-primary-foreground" />;
      case "quiz":
        return <FileText className="h-5 w-5 text-primary-foreground" />;
      default:
        return <ClipboardList className="h-5 w-5 text-primary-foreground" />;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "EEEE, d MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  const filterByClass = (assignments: TodoAssignment[]) => {
    if (selectedClass === "all") return assignments;
    return assignments.filter((a) => a.classId === selectedClass);
  };

  const getAssignmentsForTab = () => {
    switch (activeTab) {
      case "assigned":
        return filterByClass(assignedAssignments);
      case "missing":
        return filterByClass(missingAssignments);
      case "done":
        return filterByClass(submittedAssignments);
      default:
        return [];
    }
  };

  const currentAssignments = getAssignmentsForTab();
  const noDueDateAssignments = currentAssignments.filter((a) => !a.dueDate);
  const withDueDateAssignments = currentAssignments.filter((a) => a.dueDate);

  // Group by due date
  const groupedByDate = withDueDateAssignments.reduce((groups, assignment) => {
    const date = assignment.dueDate ? format(new Date(assignment.dueDate), "yyyy-MM-dd") : "no-date";
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(assignment);
    return groups;
  }, {} as Record<string, TodoAssignment[]>);

  const renderAssignment = (assignment: TodoAssignment) => (
    <div
      key={assignment.id}
      className="flex items-start gap-4 p-4 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
    >
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
        {getTypeIcon("assignment")}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground">{assignment.title}</h4>
        <p className="text-xs text-muted-foreground mt-1">{assignment.className}</p>
        <p className="text-xs text-muted-foreground">
          Posted {formatDate(assignment.createdAt)}
        </p>
        {activeTab === "done" && assignment.grade && (
          <p className="text-xs text-primary font-medium mt-1">
            Grade: {assignment.grade}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-1">
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex">
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
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-3xl mx-auto">
        {/* Class Filter */}
        <div className="mb-6">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-64 border-primary">
              <SelectValue placeholder="All classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All classes</SelectItem>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : currentAssignments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-48 h-48 mx-auto mb-4 opacity-50">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="80" fill="hsl(var(--muted))" />
                <rect x="70" y="60" width="60" height="80" rx="4" fill="hsl(var(--background))" />
                <path d="M85 90 L95 100 L115 80" stroke="hsl(var(--primary))" strokeWidth="4" fill="none" />
              </svg>
            </div>
            <p className="text-muted-foreground">
              {activeTab === "assigned" && "No work assigned"}
              {activeTab === "missing" && "No missing work — great job!"}
              {activeTab === "done" && "No completed work yet"}
            </p>
          </div>
        ) : (
          <>
            {/* No Due Date Section */}
            {noDueDateAssignments.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={() => setNoDueDateOpen(!noDueDateOpen)}
                  className="flex items-center justify-between w-full py-2 text-left"
                >
                  <span className="text-base text-muted-foreground">No due date</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-primary">{noDueDateAssignments.length}</span>
                    {noDueDateOpen ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {noDueDateOpen && (
                  <div className="space-y-1 mt-2">
                    {noDueDateAssignments.map(renderAssignment)}
                  </div>
                )}
              </div>
            )}

            {/* With Due Date Sections */}
            {Object.entries(groupedByDate)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([date, assignments]) => (
                <div key={date} className="mb-4">
                  <button
                    onClick={() => setWithDueDateOpen(!withDueDateOpen)}
                    className="flex items-center justify-between w-full py-2 text-left"
                  >
                    <span className="text-base text-muted-foreground">
                      {format(new Date(date), "EEEE, MMMM d")}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-primary">{assignments.length}</span>
                      {withDueDateOpen ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {withDueDateOpen && (
                    <div className="space-y-1 mt-2">
                      {assignments.map(renderAssignment)}
                    </div>
                  )}
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
}
