import { FileText, ClipboardList, MoreVertical, ExternalLink, Download } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AssignmentCardProps {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  pdfUrl?: string | null;
  createdAt: string;
  type: "assignment" | "material";
  onClick?: () => void;
}

export function AssignmentCard({
  id,
  title,
  description,
  dueDate,
  pdfUrl,
  createdAt,
  type,
  onClick,
}: AssignmentCardProps) {
  const isAssignment = type === "assignment";

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  const handleViewFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = title;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-border",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
          isAssignment ? "bg-primary" : "bg-classroom-purple"
        )}
      >
        {isAssignment ? (
          <ClipboardList className="h-5 w-5 text-primary-foreground" />
        ) : (
          <FileText className="h-5 w-5 text-primary-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span>Posted {formatDate(createdAt)}</span>
          {isAssignment && dueDate && (
            <>
              <span>•</span>
              <span className={cn(
                new Date(dueDate) < new Date() && "text-destructive"
              )}>
                Due {formatDate(dueDate)}
              </span>
            </>
          )}
        </div>

        {/* File attachment preview */}
        {pdfUrl && (
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleViewFile}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-muted rounded-full hover:bg-muted/80 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-muted rounded-full hover:bg-muted/80 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </button>
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <button className="gc-icon-btn p-1">
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
