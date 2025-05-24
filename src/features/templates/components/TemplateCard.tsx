import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Bookmark, MessageCircle, Eye, Edit, Trash2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Template } from "../types";

interface TemplateCardProps {
  template: Template;
  userId?: string;
  userRole?: string;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TemplateCard = ({ template, userId, userRole, onLike, onBookmark, onDelete }: TemplateCardProps) => {
  const navigate = useNavigate();

  const canEditTemplate = (createdBy: string) => {
    if (userRole === "admin") return true;
    if (userRole === "read-write" && createdBy === userId) return true;
    return false;
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{template.title}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {/* ...existing content... */}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onLike(template.id)}>
            <Heart className="mr-2" />
            Like
          </Button>
          <Button variant="outline" onClick={() => onBookmark(template.id)}>
            <Bookmark className="mr-2" />
            Bookmark
          </Button>
          <Button variant="outline" onClick={() => navigate(`/templates/${template.id}`)}>
            <Eye className="mr-2" />
            View
          </Button>
        </div>
        {canEditTemplate(template.createdBy) && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/templates/edit/${template.id}`)}>
              <Edit className="mr-2" />
              Edit
            </Button>
            <Button variant="outline" onClick={() => onDelete(template.id)}>
              <Trash2 className="mr-2" />
              Delete
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
