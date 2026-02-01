import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface CreateClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateClass: (data: { name: string; section: string; subject: string; room: string }) => void;
}

export function CreateClassModal({ open, onOpenChange, onCreateClass }: CreateClassModalProps) {
  const [name, setName] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [room, setRoom] = useState("");

  const handleSubmit = () => {
    if (name.trim()) {
      onCreateClass({ name, section, subject, room });
      setName("");
      setSection("");
      setSubject("");
      setRoom("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-google-sans text-xl">Create class</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="class-name" className="text-sm text-muted-foreground">
              Class name (required)
            </Label>
            <Input
              id="class-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
              placeholder=""
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="section" className="text-sm text-muted-foreground">
              Section
            </Label>
            <Input
              id="section"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
              placeholder=""
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm text-muted-foreground">
              Subject
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
              placeholder=""
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="room" className="text-sm text-muted-foreground">
              Room
            </Label>
            <Input
              id="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
              placeholder=""
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
