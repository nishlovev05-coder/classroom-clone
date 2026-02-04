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
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileText, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreateAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAssignment: (data: {
    title: string;
    description?: string;
    dueDate?: string;
    pdfUrl?: string;
  }) => Promise<any>;
  type: "assignment" | "material";
}

export function CreateAssignmentModal({
  open,
  onOpenChange,
  onCreateAssignment,
  type,
}: CreateAssignmentModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "image/jpeg",
        "image/png",
        "image/gif",
        "video/mp4",
        "video/webm",
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("File type not supported");
        return;
      }

      // Validate file size (max 50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        toast.error("File size must be less than 50MB");
        return;
      }

      setFile(selectedFile);
    }
  };

  const uploadFile = async (): Promise<string | null> => {
    if (!file) return null;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `materials/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("project-storage")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("project-storage")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setLoading(true);
    try {
      let pdfUrl: string | undefined;
      if (file) {
        const uploadedUrl = await uploadFile();
        if (uploadedUrl) {
          pdfUrl = uploadedUrl;
        }
      }

      await onCreateAssignment({
        title,
        description: description || undefined,
        dueDate: dueDate || undefined,
        pdfUrl,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setDueDate("");
      setFile(null);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const isAssignment = type === "assignment";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-google-sans text-xl">
            {isAssignment ? "Create assignment" : "Upload material"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm text-muted-foreground">
              Title (required)
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
              placeholder={isAssignment ? "Assignment title" : "Material title"}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm text-muted-foreground">
              Instructions
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] resize-none"
              placeholder={isAssignment ? "Add instructions for students..." : "Add description..."}
              disabled={loading}
            />
          </div>

          {isAssignment && (
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm text-muted-foreground">
                Due date
              </Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Attachment</Label>
            {file ? (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFile(null)}
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload a file
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.webm"
                  disabled={loading}
                />
              </label>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || loading || uploading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading || uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {uploading ? "Uploading..." : "Creating..."}
              </>
            ) : isAssignment ? (
              "Assign"
            ) : (
              "Post"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
