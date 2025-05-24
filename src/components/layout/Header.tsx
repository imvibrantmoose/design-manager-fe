import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User, ChevronDown, Plus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";
import authService from "@/services/authService";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HeaderProps {
  isAuthenticated: boolean;
  user: { id: string; name: string; email: string; role: string } | null;
  onLogout: () => void;
  onShowAuth: (mode: 'login' | 'signup') => void;
}

export const Header = ({ isAuthenticated, user, onLogout, onShowAuth }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleCreateTemplate = () => {
    navigate("/templates/new");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex flex-1 items-center justify-between md:justify-start md:space-x-8">
          <Link to="/" className="text-xl font-bold text-primary hover:text-primary/90 flex-shrink-0">
            Design Template Manager
          </Link>
          {isAuthenticated && (
            <nav className="hidden md:flex">
              <ul className="flex space-x-4">
                <li>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/templates')}
                    className={`font-medium ${location.pathname === '/templates' ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    Templates
                  </Button>
                </li>
                {user?.role === 'admin' && (
                  <li>
                    <Button
                      variant="ghost"
                      onClick={() => navigate('/admin/users')}
                      className={`font-medium ${location.pathname.includes('/admin/users') ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                      User Management
                    </Button>
                  </li>
                )}
              </ul>
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated && (user?.role === 'admin' || user?.role === 'read-write') && (
            <Button onClick={handleCreateTemplate} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Template
            </Button>
          )}
          <ModeToggle />
          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{user?.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onShowAuth('login')}>
                Login
              </Button>
              <Button onClick={() => onShowAuth('signup')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
