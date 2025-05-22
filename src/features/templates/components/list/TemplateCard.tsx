import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Template } from "../../types";
import { TemplateMetadata } from "./TemplateMetadata";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, MessageCircle, Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <TemplateMetadata 
          title={template.title}
          category={template.category}
          createdByName={template.createdByName}
        />
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-sm text-muted-foreground">
          {template.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onLike(template.id)}
            className={(template.likes || []).includes(userId || '') ? "text-red-500" : ""}
          >
            <Heart className="h-4 w-4" />
            <span className="ml-1">{(template.likes || []).length}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onBookmark(template.id)}
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
            <Eye className="h-4 w-4" />
          </Button>
          {userRole === 'admin' && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/templates/edit/${template.id}`)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(template.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
