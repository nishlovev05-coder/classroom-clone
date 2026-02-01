import { useState } from "react";
import { Settings, Info, MoreVertical, Send, Link as LinkIcon, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ClassDetailViewProps {
  classData: {
    id: string;
    name: string;
    section: string;
    teacher: string;
    color: string;
    classCode: string;
  };
}

export function ClassDetailView({ classData }: ClassDetailViewProps) {
  const [activeTab, setActiveTab] = useState<"stream" | "classwork" | "people" | "grades">("stream");

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
                <p className="text-2xl font-google-sans text-primary">{classData.classCode}</p>
              </div>

              {/* Upcoming Card */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-medium text-foreground mb-2">Upcoming</h3>
                <p className="text-sm text-muted-foreground">Woohoo, no work due soon!</p>
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

              {/* Empty State */}
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
            </div>
          </div>
        </div>
      )}

      {/* Classwork View */}
      {activeTab === "classwork" && (
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">
              + Create
            </button>
          </div>
          
          <div className="text-center py-12">
            <div className="w-48 h-48 mx-auto mb-4 opacity-50">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="80" fill="hsl(var(--muted))" />
                <rect x="60" y="50" width="80" height="100" rx="4" fill="hsl(var(--background))" />
                <rect x="70" y="65" width="50" height="4" fill="hsl(var(--primary))" />
                <rect x="70" y="80" width="60" height="3" fill="hsl(var(--muted-foreground))" />
                <rect x="70" y="90" width="55" height="3" fill="hsl(var(--muted-foreground))" />
                <rect x="70" y="110" width="50" height="4" fill="hsl(var(--primary))" />
                <rect x="70" y="125" width="60" height="3" fill="hsl(var(--muted-foreground))" />
              </svg>
            </div>
            <p className="text-muted-foreground">
              This is where you'll assign work
            </p>
          </div>
        </div>
      )}

      {/* People View */}
      {activeTab === "people" && (
        <div className="max-w-4xl mx-auto p-6">
          {/* Teachers Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between border-b border-primary pb-2 mb-4">
              <h2 className="text-3xl font-google-sans text-primary">Teachers</h2>
            </div>
            <div className="flex items-center gap-4 p-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-classroom-purple text-primary-foreground">
                  {classData.teacher.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-foreground">{classData.teacher}</span>
            </div>
          </div>

          {/* Classmates Section */}
          <div>
            <div className="flex items-center justify-between border-b border-primary pb-2 mb-4">
              <h2 className="text-3xl font-google-sans text-primary">Classmates</h2>
              <button className="gc-icon-btn">
                <UserPlus className="h-5 w-5 text-primary" />
              </button>
            </div>
            <div className="text-center py-8">
              <p className="text-muted-foreground">No classmates yet</p>
            </div>
          </div>
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
    </div>
  );
}
