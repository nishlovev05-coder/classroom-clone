import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { HomeView } from "@/components/views/HomeView";
import { TodoView } from "@/components/views/TodoView";
import { SettingsView } from "@/components/views/SettingsView";
import { ClassDetailView } from "@/components/views/ClassDetailView";
import { CreateClassModal } from "@/components/classroom/CreateClassModal";
import { JoinClassModal } from "@/components/classroom/JoinClassModal";
import { cn } from "@/lib/utils";
import { useClasses } from "@/hooks/useClasses";
import { useAuth } from "@/hooks/useAuth";

const COLORS = ["teal", "green", "blue", "purple", "pink", "orange", "brown", "gray"];

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState("home");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  
  const { user } = useAuth();
  const { classes, loading, createClass, joinClass } = useClasses();

  const handleCreateClass = async (data: { name: string; section: string; subject: string; room: string }) => {
    const result = await createClass({
      name: data.name,
      subject: data.subject || data.section || "General",
      description: data.room ? `Room: ${data.room}` : undefined,
    });
    if (result) {
      setCreateModalOpen(false);
    }
  };

  const handleJoinClass = async (code: string) => {
    const success = await joinClass(code);
    if (success) {
      setJoinModalOpen(false);
    }
  };

  const handleClassClick = (classId: string) => {
    setCurrentView(`class-${classId}`);
  };

  // Transform classes for display
  const displayClasses = classes.map((cls, index) => ({
    id: cls.id,
    name: cls.name,
    section: cls.subject,
    teacher: cls.role === "teacher" ? "You" : cls.subject,
    color: COLORS[index % COLORS.length],
    classCode: cls.classCode,
  }));

  const getSelectedClass = () => {
    if (currentView.startsWith("class-")) {
      const classId = currentView.replace("class-", "");
      return displayClasses.find((c) => c.id === classId);
    }
    return null;
  };

  const selectedClass = getSelectedClass();

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onCreateClick={() => setCreateModalOpen(true)}
        onJoinClick={() => setJoinModalOpen(true)}
      />
      
      <Sidebar
        isOpen={sidebarOpen}
        currentView={currentView}
        onViewChange={setCurrentView}
        enrolledClasses={displayClasses.map((c) => ({ id: c.id, name: c.name, section: c.section, color: c.color }))}
      />
      
      <main
        className={cn(
          "transition-all duration-300 pt-0",
          sidebarOpen ? "ml-72" : "ml-0"
        )}
      >
        {currentView === "home" && (
          <HomeView 
            classes={displayClasses} 
            onClassClick={handleClassClick}
            loading={loading}
            isSignedIn={!!user}
          />
        )}
        
        {currentView === "todo" && (
          <TodoView />
        )}
        
        {currentView === "settings" && (
          <SettingsView />
        )}
        
        {currentView === "calendar" && (
          <div className="p-6">
            <h1 className="text-2xl font-google-sans text-foreground">Calendar</h1>
            <p className="text-muted-foreground mt-2">Calendar view coming soon...</p>
          </div>
        )}
        
        {currentView === "archived" && (
          <div className="p-6">
            <h1 className="text-2xl font-google-sans text-foreground">Archived classes</h1>
            <p className="text-muted-foreground mt-2">No archived classes</p>
          </div>
        )}
        
        {selectedClass && (
          <ClassDetailView classData={selectedClass} />
        )}
      </main>
      
      <CreateClassModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreateClass={handleCreateClass}
      />
      
      <JoinClassModal
        open={joinModalOpen}
        onOpenChange={setJoinModalOpen}
        onJoinClass={handleJoinClass}
      />
    </div>
  );
};

export default Index;
