import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Trash2, Eye, Loader2, User as UserIcon, Heart, MessageCircle, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import templateService, { Template } from "../services/templateService";
import userService, { User } from "../services/userService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface TemplateListProps {
  userRole?: "read" | "read-write" | "admin";
  searchQuery?: string;
  userId?: string; // Add userId prop
}

interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

const TemplateList = ({
  userRole = "read",
  searchQuery = "",
  userId = "",
}: TemplateListProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(9);
  const [totalTemplates, setTotalTemplates] = useState(0);

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await templateService.getAllTemplates(currentPage, pageSize);
        
        // Type guard to check if response is paginated
        const isPaginatedResponse = (response: any): response is PaginatedResponse<Template> => {
          return 'content' in response && 'totalPages' in response;
        };

        if (isPaginatedResponse(response)) {
          setTemplates(response.content);
          setTotalPages(response.totalPages);
          setTotalTemplates(response.totalElements);
          
          const uniqueCategories = [
            "all",
            ...new Set(response.content.map((template) => template.category)),
          ];
          setCategories(uniqueCategories);
        } else {
          // Handle non-paginated response
          setTemplates(response);
          setTotalPages(1);
          
          const uniqueCategories = [
            "all",
            ...new Set(response.map((template) => template.category)),
          ];
          setCategories(uniqueCategories);
        }

        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch templates");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [currentPage, pageSize]);

  // Update searchTerm when searchQuery prop changes
  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  // Fetch user details for each template
  useEffect(() => {
    const fetchUserDetails = async (createdBy: string) => {
      if (!createdBy) return; // Skip if createdBy is empty
      
      try {
        const userData = await userService.getUserById(createdBy);
        setUsers((prev) => ({ ...prev, [createdBy]: userData }));
      } catch (err) {
        console.error(`Failed to fetch user details for ${createdBy}`, err);
        // Add a placeholder for failed fetches to prevent retries
        setUsers((prev) => ({ ...prev, [createdBy]: { id: createdBy, name: 'Unknown User' } as User }));
      }
    };

    // Only fetch for templates with valid createdBy
    templates.forEach((template) => {
      if (template.createdBy && !users[template.createdBy]) {
        fetchUserDetails(template.createdBy);
      }
    });
  }, [templates, users]); // Add users to dependency array

  // Filter templates based on search term and category
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.designContext.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleViewTemplate = (id: string) => {
    navigate(`/templates/${id}`);
  };

  const handleEditTemplate = (id: string) => {
    navigate(`/templates/${id}/edit`);
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await templateService.deleteTemplate(id);
      // Remove the deleted template from state
      setTemplates(templates.filter((template) => template.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete template");
    }
  };

  // Add safety check for likes in handleLike function
  const handleLike = async (templateId: string) => {
    try {
      await templateService.toggleLike(templateId);
      // Refresh templates after like
      const updatedTemplates = templates.map(t => {
        if (t.id === templateId) {
          return {
            ...t,
            likes: (t.likes || []).includes(userId) 
              ? (t.likes || []).filter(id => id !== userId)
              : [...(t.likes || []), userId]
          };
        }
        return t;
      });
      setTemplates(updatedTemplates);
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleBookmark = async (templateId: string) => {
    try {
      await templateService.toggleBookmark(templateId);
      // Update templates after bookmark
      const updatedTemplates = templates.map(t => {
        if (t.id === templateId) {
          return {
            ...t,
            isBookmarked: !t.isBookmarked,
            bookmarkCount: (t.isBookmarked ? t.bookmarkCount - 1 : t.bookmarkCount + 1)
          };
        }
        return t;
      });
      setTemplates(updatedTemplates);
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const canModifyTemplates = userRole === "read-write" || userRole === "admin";

  const canEditTemplate = (templateCreatedBy: string) => {
    if (userRole === "admin") return true;
    if (userRole === "read-write" && templateCreatedBy === userId) return true;
    return false;
  };

  // Function to extract the first image URL from HTML content
  const extractFirstImage = (html: string): string | null => {
    const imgRegex = /<img.*?src=["'](.*?)["']/;
    const match = html.match(imgRegex);
    return match ? match[1] : null;
  };

  // Add this function to strip HTML and truncate text
  const getContextPreview = (html: string): string => {
    const strippedText = html.replace(/<[^>]*>/g, "");
    return strippedText.length > 150
      ? strippedText.substring(0, 150) + "..."
      : strippedText;
  };

  // Add pagination controls
  const Pagination = () => (
    <div className="flex justify-center items-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
        disabled={currentPage === 0}
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage + 1} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
        disabled={currentPage >= totalPages - 1}
      >
        Next
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading templates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-xl text-destructive mb-4">Error loading templates</p>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 bg-background">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Design Templates</h1>
          <span className="text-muted-foreground">
            {totalTemplates} {totalTemplates === 1 ? 'template' : 'templates'}
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-xl text-muted-foreground mb-4">
              No templates found
            </p>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              // console log template for debugging
              console.log("Template:", template);
              
              const firstImage = extractFirstImage(template.designContext);
              const contextPreview = getContextPreview(template.designContext);

              return (
                <Card key={template.id} className="flex flex-col h-full">
                  {firstImage && (
                    <img
                      src={firstImage}
                      alt={template.title}
                      className="h-48 w-full object-cover rounded-t-md"
                    />
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">
                          {template.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2 mb-2">
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Created by {users[template.createdBy]?.name || "Loading..."}
                          </span>
                        </div>
                        <Badge variant="secondary">
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <CardDescription className="text-sm text-muted-foreground">
                      {template.description}
                    </CardDescription>
                    {contextPreview && (
                      <div className="border-t pt-4">
                        <p className="text-sm text-muted-foreground">
                          {contextPreview}
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleLike(template.id)}
                        className={(template.likes || []).includes(userId) ? "text-red-500" : ""}
                      >
                        <Heart className="h-4 w-4" />
                        <span className="ml-1">{(template.likes || []).length}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleBookmark(template.id)}
                        className={template.isBookmarked ? "text-yellow-500" : ""}
                      >
                        <Bookmark className="h-4 w-4" />
                        <span className="ml-1">{template.bookmarkCount || 0}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/templates/${template.id}`)}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span className="ml-1">{template.commentCount || 0}</span>
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="min-w-[70px]"
                        onClick={() => handleViewTemplate(template.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {(userRole === "read-write" || userRole === "admin") && (
                        <>
                          {canEditTemplate(template.createdBy) && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="min-w-[70px]"
                              onClick={() => handleEditTemplate(template.id)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          )}
                          {(userRole === "admin" || template.createdBy === userId) && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="min-w-[80px] text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the template.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteTemplate(template.id)
                                    }
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
        <Pagination />
      </div>
    </div>
  );
};

export default TemplateList;
