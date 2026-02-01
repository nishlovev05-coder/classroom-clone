import { Menu, Plus, Grid3X3 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

interface HeaderProps {
  onMenuClick: () => void;
  onCreateClick: () => void;
  onJoinClick: () => void;
}

export function Header({ onMenuClick, onCreateClick, onJoinClick }: HeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <button onClick={onMenuClick} className="gc-icon-btn">
          <Menu className="h-6 w-6 text-muted-foreground" />
        </button>
        
        <div className="flex items-center gap-2 ml-2">
          <div className="w-8 h-8 bg-classroom-green rounded flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary-foreground">
              <path fill="currentColor" d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
            </svg>
          </div>
          <span className="text-xl font-google-sans text-muted-foreground hidden sm:inline">Classroom</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="gc-icon-btn">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onJoinClick} className="cursor-pointer">
              Join class
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onCreateClick} className="cursor-pointer">
              Create class
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <button className="gc-icon-btn hidden sm:flex">
          <Grid3X3 className="h-6 w-6 text-muted-foreground" />
        </button>
        
        <GoogleSignInButton />
      </div>
    </header>
  );
}
