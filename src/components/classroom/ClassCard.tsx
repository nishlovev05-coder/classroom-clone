import { MoreVertical, FolderOpen, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ClassCardProps {
  id: string;
  name: string;
  section: string;
  teacher: string;
  color: string;
  onClick: () => void;
}

export function ClassCard({ id, name, section, teacher, color, onClick }: ClassCardProps) {
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

  const avatarColors: Record<string, string> = {
    teal: "bg-classroom-teal",
    green: "bg-classroom-green",
    blue: "bg-classroom-blue",
    purple: "bg-classroom-purple",
    pink: "bg-classroom-pink",
    orange: "bg-classroom-orange",
    brown: "bg-classroom-brown",
    gray: "bg-classroom-gray",
  };

  return (
    <div
      className="bg-card rounded-lg shadow-material-1 hover-lift overflow-hidden cursor-pointer border border-border"
      onClick={onClick}
    >
      {/* Header */}
      <div className={cn("h-24 p-4 relative", headerColors[color] || "class-header-teal")}>
        <div className="flex justify-between items-start">
          <div className="flex-1 overflow-hidden pr-8">
            <h3 className="text-xl font-google-sans text-primary-foreground truncate">
              {name}
            </h3>
            <p className="text-sm text-primary-foreground/90 truncate">{section}</p>
            <p className="text-sm text-primary-foreground/80 truncate mt-1">{teacher}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <button className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors">
                <MoreVertical className="h-5 w-5 text-primary-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Unenroll</DropdownMenuItem>
              <DropdownMenuItem>Copy link</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Teacher Avatar */}
        <Avatar className="absolute right-4 -bottom-8 h-16 w-16 border-2 border-card">
          <AvatarFallback className={cn("text-xl font-medium text-primary-foreground", avatarColors[color] || "bg-classroom-teal")}>
            {teacher.charAt(0).toLowerCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Body */}
      <div className="h-20 border-b border-border"></div>

      {/* Footer */}
      <div className="h-14 px-4 flex items-center justify-end gap-2">
        <button
          className="gc-icon-btn"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Users className="h-5 w-5 text-muted-foreground" />
        </button>
        <button
          className="gc-icon-btn"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <FolderOpen className="h-5 w-5 text-muted-foreground" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button className="gc-icon-btn">
              <MoreVertical className="h-5 w-5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Move</DropdownMenuItem>
            <DropdownMenuItem>Copy link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
