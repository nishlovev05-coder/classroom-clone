import { Home, Calendar, CheckSquare, Archive, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  onViewChange: (view: string) => void;
  enrolledClasses: { id: string; name: string; section: string; color: string }[];
}

export function Sidebar({ isOpen, currentView, onViewChange, enrolledClasses }: SidebarProps) {
  const [enrolledOpen, setEnrolledOpen] = useState(true);

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "calendar", label: "Calendar", icon: Calendar },
  ];

  const getColorDot = (color: string) => {
    const colorMap: Record<string, string> = {
      teal: "bg-classroom-teal",
      green: "bg-classroom-green",
      blue: "bg-classroom-blue",
      purple: "bg-classroom-purple",
      pink: "bg-classroom-pink",
      orange: "bg-classroom-orange",
      brown: "bg-classroom-brown",
      gray: "bg-classroom-gray",
    };
    return colorMap[color] || "bg-classroom-teal";
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r border-border transition-all duration-300 z-40 overflow-y-auto",
        isOpen ? "w-72" : "w-0 overflow-hidden"
      )}
    >
      <nav className="py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "gc-nav-item w-full",
              currentView === item.id && "active"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}

        {/* Enrolled Section */}
        <div className="mt-2">
          <button
            onClick={() => setEnrolledOpen(!enrolledOpen)}
            className="gc-nav-item w-full justify-between"
          >
            <div className="flex items-center gap-4">
              <CheckSquare className="h-5 w-5" />
              <span className="text-sm">Enrolled</span>
            </div>
            {enrolledOpen ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>

          {enrolledOpen && (
            <div className="ml-4">
              <button
                onClick={() => onViewChange("todo")}
                className={cn(
                  "gc-nav-item w-full pl-10",
                  currentView === "todo" && "active"
                )}
              >
                <CheckSquare className="h-5 w-5" />
                <span className="text-sm">To do</span>
              </button>

              {enrolledClasses.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => onViewChange(`class-${cls.id}`)}
                  className={cn(
                    "gc-nav-item w-full pl-10",
                    currentView === `class-${cls.id}` && "active"
                  )}
                >
                  <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-xs text-primary-foreground font-medium", getColorDot(cls.color))}>
                    {cls.name.charAt(0)}
                  </div>
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="text-sm truncate max-w-[150px]">{cls.name}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">{cls.section}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => onViewChange("archived")}
          className={cn(
            "gc-nav-item w-full mt-2",
            currentView === "archived" && "active"
          )}
        >
          <Archive className="h-5 w-5" />
          <span className="text-sm">Archived classes</span>
        </button>

        <button
          onClick={() => onViewChange("settings")}
          className={cn(
            "gc-nav-item w-full",
            currentView === "settings" && "active"
          )}
        >
          <Settings className="h-5 w-5" />
          <span className="text-sm">Settings</span>
        </button>
      </nav>
    </aside>
  );
}
