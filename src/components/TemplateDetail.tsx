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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import templateService, { Template } from "../services/templateService";
import { Alert, AlertDescription } from "./ui/alert";
import { Editor } from "@tinymce/tinymce-react";
import { API_KEYS } from "../config/keys";

interface TemplateDetailProps {
  userRole?: "read" | "read-write" | "admin";
  isNew?: boolean;
}

const TemplateDetail = ({
  userRole = "read",
  isNew = false,
}: TemplateDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("design-context");
  const [categories, setCategories] = useState<string[]>([
    "UI Design",
    "UX Design",
    "System Design",
    "Architecture",
    "Data Visualization",
    "Product Design",
    "Web",
  ]);

  const emptyTemplate: Template = {
    id: "",
    title: "",
    category: "UI Design",
    description: "",
    designContext: "",
    systemImpacts: "",
    assumptions: "",
    outOfScope: "",
    otherAreasToConsider: "",
    appendix: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const [template, setTemplate] = useState<Template>(emptyTemplate);
  const isEditable = userRole === "read-write" || userRole === "admin";

  // Fetch template data if not a new template
  useEffect(() => {
    if (!isNew && id) {
      const fetchTemplate = async () => {
        try {
          setLoading(true);
          const data = await templateService.getTemplateById(id);
          setTemplate(data);
          setError(null);
        } catch (err: any) {
          setError(err.message || "Failed to fetch template details");
        } finally {
          setLoading(false);
        }
      };

      fetchTemplate();
    }
  }, [id, isNew]);

  const handleInputChange = (field: string, value: string) => {
    setTemplate((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      let savedTemplate;
      if (isNew) {
        savedTemplate = await templateService.createTemplate(template);
      } else {
        savedTemplate = await templateService.updateTemplate(
          template.id,
          template,
        );
      }

      // Navigate back to templates list after successful save
      navigate("/templates");
    } catch (err: any) {
      setError(err.message || "Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await templateService.deleteTemplate(template.id);
      navigate("/templates");
    } catch (err: any) {
      setError(err.message || "Failed to delete template");
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/templates");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading template...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-background">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={handleBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold flex-grow">
          {isNew
            ? "Create Template"
            : isEditable
              ? "Edit Template"
              : "View Template"}
        </h1>
        {isEditable && !isNew && (
          <div className="flex space-x-2">
            <Button onClick={handleSave} variant="default" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the template.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
        {isNew && (
          <Button onClick={handleSave} variant="default" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Template"
            )}
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Template Information</CardTitle>
          <CardDescription>
            Basic information about this template
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={template.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                disabled={!isEditable && !isNew}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              {isEditable || isNew ? (
                <Select
                  value={template.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input value={template.category} disabled />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={template.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={!isEditable && !isNew}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
          <CardDescription>
            Detailed information and specifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
              <TabsTrigger value="design-context">Design Context</TabsTrigger>
              <TabsTrigger value="system-impacts">System Impacts</TabsTrigger>
              <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
              <TabsTrigger value="out-of-scope">Out of Scope</TabsTrigger>
              <TabsTrigger value="other-areas">Other Areas</TabsTrigger>
              <TabsTrigger value="appendix">Appendix</TabsTrigger>
            </TabsList>

            <TabsContent value="design-context" className="mt-4">
              <RichTextSection
                title="Design Context"
                content={template.designContext || ""}
                onChange={(value) => handleInputChange("designContext", value)}
                isEditable={isEditable || isNew}
              />
            </TabsContent>

            <TabsContent value="system-impacts" className="mt-4">
              <RichTextSection
                title="System Impacts"
                content={template.systemImpacts || ""}
                onChange={(value) => handleInputChange("systemImpacts", value)}
                isEditable={isEditable || isNew}
              />
            </TabsContent>

            <TabsContent value="assumptions" className="mt-4">
              <RichTextSection
                title="Assumptions"
                content={template.assumptions || ""}
                onChange={(value) => handleInputChange("assumptions", value)}
                isEditable={isEditable || isNew}
              />
            </TabsContent>

            <TabsContent value="out-of-scope" className="mt-4">
              <RichTextSection
                title="Out of Scope"
                content={template.outOfScope || ""}
                onChange={(value) => handleInputChange("outOfScope", value)}
                isEditable={isEditable || isNew}
              />
            </TabsContent>

            <TabsContent value="other-areas" className="mt-4">
              <RichTextSection
                title="Other Areas to Consider"
                content={template.otherAreasToConsider || ""}
                onChange={(value) =>
                  handleInputChange("otherAreasToConsider", value)
                }
                isEditable={isEditable || isNew}
              />
            </TabsContent>

            <TabsContent value="appendix" className="mt-4">
              <RichTextSection
                title="Appendix"
                content={template.appendix || ""}
                onChange={(value) => handleInputChange("appendix", value)}
                isEditable={isEditable || isNew}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            Cancel
          </Button>
          {(isEditable || isNew) && (
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isNew ? "Creating..." : "Saving..."}
                </>
              ) : isNew ? (
                "Create Template"
              ) : (
                "Save Changes"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

interface RichTextSectionProps {
  title: string;
  content: string;
  onChange: (value: string) => void;
  isEditable: boolean;
}

const RichTextSection = ({
  title,
  content,
  onChange,
  isEditable,
}: RichTextSectionProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">{title}</h3>
      {isEditable ? (
        <Editor
          apiKey={API_KEYS.TINYMCE}
          value={content}
          onEditorChange={(content) => onChange(content)}
          init={{
            height: 400,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | image media | help",
            content_style:
              "body { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif; font-size: 14px }",
            images_upload_handler: async (blobInfo) => {
              // This is a basic example that converts the image to base64
              // In production, you should upload to your server/cloud storage
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blobInfo.blob());
              });
            },
          }}
        />
      ) : (
        <div
          className="border rounded-md p-4 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
};

export default TemplateDetail;
