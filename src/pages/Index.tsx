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

// Mock data for demonstration
const mockClasses = [
  {
    id: "1",
    name: "OOSE-3 YR (IT) 2025 T...",
    section: "A",
    teacher: "anitha IT",
    color: "teal",
    classCode: "abc123x",
  },
  {
    id: "2",
    name: "III Year 2025-2026",
    section: "BA",
    teacher: "Snowlin IT",
    color: "green",
    classCode: "def456y",
  },
  {
    id: "3",
    name: "OEE351 - RENEWABLE ...",
    section: "IT & ECE, CSE",
    teacher: "JEBAMANI S Mechanical",
    color: "purple",
    classCode: "ghi789z",
  },
  {
    id: "4",
    name: "Virtualization CCS372",
    section: "3rd YR",
    teacher: "Livins LV IT",
    color: "orange",
    classCode: "jkl012a",
  },
  {
    id: "5",
    name: "III IT- 2023-2027",
    section: "A",
    teacher: "PRAVEEN K V IT",
    color: "pink",
    classCode: "mno345b",
  },
  {
    id: "6",
    name: "3 yr-computer ne...",
    section: "",
    teacher: "anitha IT",
    color: "brown",
    classCode: "pqr678c",
  },
];

const mockAssignments = [
  {
    id: "1",
    title: "DEAR STUDENTS, TRY SOLVING ALL THE PROGRAMS",
    className: "III YEAR(BATCH 2027)",
    postedDate: "Monday, 16 Sept 2024",
    type: "question" as const,
  },
  {
    id: "2",
    title: "take the quiz",
    className: "III YEAR(BATCH 2027)",
    postedDate: "Friday, 27 Sept 2024",
    type: "assignment" as const,
  },
  {
    id: "3",
    title: "Lab observation",
    className: "III YR IT",
    postedDate: "Thursday, 17 Jul 2025",
    type: "assignment" as const,
  },
  {
    id: "4",
    title: "CN EX-3",
    className: "3 yr-computer network(2027 batch)",
    postedDate: "Friday, 8 Aug 2025",
    type: "assignment" as const,
  },
  {
    id: "5",
    title: "Quiz Cloud Security",
    className: "III YR IT",
    postedDate: "Monday, 12 Aug 2025",
    type: "quiz" as const,
  },
];

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState("home");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [classes, setClasses] = useState(mockClasses);

  const handleCreateClass = (data: { name: string; section: string; subject: string; room: string }) => {
    const colors = ["teal", "green", "blue", "purple", "pink", "orange", "brown", "gray"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const classCode = Math.random().toString(36).substring(2, 9);
    
    const newClass = {
      id: Date.now().toString(),
      name: data.name,
      section: data.section,
      teacher: "You",
      color: randomColor,
      classCode,
    };
    
    setClasses([newClass, ...classes]);
  };

  const handleJoinClass = (code: string) => {
    console.log("Joining class with code:", code);
    // In a real app, this would make an API call
  };

  const handleClassClick = (classId: string) => {
    setCurrentView(`class-${classId}`);
  };

  const getSelectedClass = () => {
    if (currentView.startsWith("class-")) {
      const classId = currentView.replace("class-", "");
      return classes.find((c) => c.id === classId);
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
        enrolledClasses={classes.map((c) => ({ id: c.id, name: c.name, section: c.section, color: c.color }))}
      />
      
      <main
        className={cn(
          "transition-all duration-300 pt-0",
          sidebarOpen ? "ml-72" : "ml-0"
        )}
      >
        {currentView === "home" && (
          <HomeView classes={classes} onClassClick={handleClassClick} />
        )}
        
        {currentView === "todo" && (
          <TodoView assignments={mockAssignments} />
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
