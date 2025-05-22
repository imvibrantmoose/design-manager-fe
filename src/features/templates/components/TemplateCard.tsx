import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Template } from "@/types/template";
import { User } from "@/types/user";

interface TemplateCardProps {
  template: Template;
  user: User;
  onLike: () => void;
  onView: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  userId?: string;
  userRole?: string;
}

export const TemplateCard = ({
  template,
  user,
  onLike,
  onView,
  onEdit,
  onDelete,
  userId,
  userRole
}: TemplateCardProps) => {
  // ...existing card JSX from TemplateList...
};
