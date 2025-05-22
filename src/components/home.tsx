import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, User, ChevronDown, Search, Plus } from "lucide-react";
import { Input } from "./ui/input";
import { TemplateListPage } from "../features/templates/pages/TemplateListPage";
import AdminDashboard from "./AdminDashboard";
import AuthForms from "./AuthForms";
import authService, { AuthResponse } from "../services/authService";
import { ModeToggle } from "./mode-toggle";

interface UserType {
  id: string;
  name: string;
  email: string;
  role: "read" | "read-write" | "admin";
}

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  // Check for authenticated user on component mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData: AuthResponse) => {
    setUser({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    });
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const handleCreateTemplate = () => {
    navigate("/templates/new");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {isAuthenticated ? (
        user?.role === "admin" ? (
          <Tabs defaultValue="templates" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
            </TabsList>
            <TabsContent value="templates" className="space-y-4">
              <div className="flex items-center justify-between">
                {(user.role === "admin" || user.role === "read-write") && (
                  <Button
                    onClick={handleCreateTemplate}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Template
                  </Button>
                )}
              </div>
              <TemplateListPage userRole={user.role} userId={user.id} />
            </TabsContent>
            <TabsContent value="users">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">User Management</h2>
                <AdminDashboard />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {user.role === "read-write" && (
                <Button
                  onClick={handleCreateTemplate}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Template
                </Button>
              )}
            </div>
            <TemplateListPage userRole={user.role} userId={user.id} />
          </div>
        )
      ) : (
        <div className="flex min-h-[70vh] flex-col items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="mb-6 text-2xl font-bold">
                  Welcome to Design Template Manager
                </h2>
                <p className="mb-6 text-muted-foreground">
                  Please login or sign up to access the design templates.
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAuthMode("login");
                      setShowAuthModal(true);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      setAuthMode("signup");
                      setShowAuthModal(true);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
};

export default Home;
