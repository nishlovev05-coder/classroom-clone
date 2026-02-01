import { X } from "lucide-react";
import { useState } from "react";
import { ClassCard } from "@/components/classroom/ClassCard";

interface Class {
  id: string;
  name: string;
  section: string;
  teacher: string;
  color: string;
}

interface HomeViewProps {
  classes: Class[];
  onClassClick: (classId: string) => void;
}

export function HomeView({ classes, onClassClick }: HomeViewProps) {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="p-6">
      {/* Research Banner */}
      {showBanner && (
        <div className="bg-sidebar-accent rounded-lg p-6 mb-6 relative">
          <button
            onClick={() => setShowBanner(false)}
            className="absolute top-4 right-4 gc-icon-btn"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 48 48" className="w-10 h-10">
                <path fill="#FFA726" d="M33 12c0-2-1-3-3-3h-2V7c0-1-1-2-2-2h-4c-1 0-2 1-2 2v2h-2c-2 0-3 1-3 3l2 24h14l2-24z"/>
                <path fill="#5D4037" d="M30 36l-1 4H19l-1-4h12z"/>
                <path fill="#FFECB3" d="M26 9h-4V7h4v2z"/>
                <circle fill="#3949AB" cx="34" cy="34" r="8"/>
                <path fill="#fff" d="M34 30c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-google-sans text-foreground mb-1">
                Participate in research to improve Classroom
              </h2>
              <p className="text-sm text-muted-foreground mb-3">
                Help shape the future of educational technology by sharing your expertise. Join our growing group of Classroom users to help make Google for Education tools better for your school, your students and yourself.
              </p>
              <button className="text-primary text-sm font-medium hover:underline">
                Learn more
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Classes Grid */}
      {classes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {classes.map((cls) => (
            <ClassCard
              key={cls.id}
              id={cls.id}
              name={cls.name}
              section={cls.section}
              teacher={cls.teacher}
              color={cls.color}
              onClick={() => onClassClick(cls.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-48 h-48 mb-6 opacity-50">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="80" fill="hsl(var(--muted))" />
              <path d="M100 50l50 30v40l-50 30-50-30V80l50-30z" fill="hsl(var(--primary))" opacity="0.3" />
              <path d="M100 70l30 18v24l-30 18-30-18V88l30-18z" fill="hsl(var(--primary))" />
            </svg>
          </div>
          <h2 className="text-xl font-google-sans text-muted-foreground mb-2">
            No classes yet
          </h2>
          <p className="text-sm text-muted-foreground">
            Click the + button to create or join a class
          </p>
        </div>
      )}
    </div>
  );
}
