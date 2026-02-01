import { useState } from "react";
import { ChevronDown, ChevronUp, ClipboardList, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Assignment {
  id: string;
  title: string;
  className: string;
  postedDate: string;
  dueDate?: string;
  type: "assignment" | "quiz" | "question";
}

interface TodoViewProps {
  assignments: Assignment[];
}

export function TodoView({ assignments }: TodoViewProps) {
  const [activeTab, setActiveTab] = useState<"assigned" | "missing" | "done">("assigned");
  const [selectedClass, setSelectedClass] = useState("all");
  const [noDueDateOpen, setNoDueDateOpen] = useState(true);

  const tabs = [
    { id: "assigned", label: "Assigned" },
    { id: "missing", label: "Missing" },
    { id: "done", label: "Done" },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <FileText className="h-5 w-5" />;
      case "quiz":
        return <ClipboardList className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const noDueDateAssignments = assignments.filter((a) => !a.dueDate);

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
            </SelectContent>
          </Select>
        </div>

        {/* No Due Date Section */}
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
              {noDueDateAssignments.length > 0 ? (
                noDueDateAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-start gap-4 p-4 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      {getTypeIcon(assignment.type)}
                      <span className="text-primary-foreground">
                        {getTypeIcon(assignment.type)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground">
                        {assignment.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {assignment.className}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Posted {assignment.postedDate}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No work without due dates
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
