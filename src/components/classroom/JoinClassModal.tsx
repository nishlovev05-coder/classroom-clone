import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface JoinClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoinClass: (code: string) => Promise<boolean | void> | void;
}

export function JoinClassModal({ open, onOpenChange, onJoinClass }: JoinClassModalProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (code.trim()) {
      setLoading(true);
      try {
        await onJoinClass(code);
        setCode("");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-google-sans text-xl">Join class</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            Ask your teacher for the class code, then enter it here.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="class-code" className="text-sm font-medium">
              Class code
            </Label>
            <Input
              id="class-code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="border border-border focus-visible:ring-1 focus-visible:ring-primary"
              placeholder=""
              maxLength={7}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Use a class code with 5-7 letters or numbers, and no spaces or symbols
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={code.length < 5 || loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              "Join"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
