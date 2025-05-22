import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

interface TemplateMetadataProps {
  title: string;
  category: string;
  createdByName: string;
}

export const TemplateMetadata = ({ title, category, createdByName }: TemplateMetadataProps) => {
  return (
    <div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="flex items-center gap-2 mt-2 mb-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Created by {createdByName}</span>
      </div>
      <Badge variant="secondary">{category}</Badge>
    </div>
  );
};
