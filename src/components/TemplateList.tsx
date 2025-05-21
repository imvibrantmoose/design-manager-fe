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
import { Search, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import templateService, { Template } from "../services/templateService";
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
}

const TemplateList = ({
  userRole = "read",
  searchQuery = "",
}: TemplateListProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(["all"]);

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const data = await templateService.getAllTemplates();
        setTemplates(data);

        // Extract unique categories
        const uniqueCategories = [
          "all",
          ...new Set(data.map((template) => template.category)),
        ];
        setCategories(uniqueCategories);

        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch templates");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Update searchTerm when searchQuery prop changes
  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

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

  const canModifyTemplates = userRole === "read-write" || userRole === "admin";

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
                        <Badge variant="secondary" className="mt-2">
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
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="text-xs text-muted-foreground">
                      Updated {new Date(template.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewTemplate(template.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {canModifyTemplates && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTemplate(template.id)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
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
                        </>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateList;
