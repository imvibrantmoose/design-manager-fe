import React, { useState, useEffect, forwardRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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
import { ArrowLeft, Save, Trash2, Loader2, FileDown, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import templateService, { Template, CommentType } from "../../../services/templateService";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Toaster, toast } from 'react-hot-toast';
import Comments from '../../../components/Comments';
import { exportToPdf, exportToMarkdown } from "../../../utils/exportUtils";
import { useCategories } from '../hooks/useCategories';

interface TemplateDetailProps {
  isNew?: boolean;
  isEdit?: boolean;
  userRole?: 'read' | 'read-write' | 'admin';
}

const TemplateDetail = ({
  isNew = false,
  isEdit = false,
  userRole = 'read',
}: TemplateDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading } = useCategories();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("design-context");
  const [comments, setComments] = useState<CommentType[]>([]);

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
    createdBy: "",
    createdByName: "",
    likes: [], 
    commentCount: 0,
    bookmarkCount: 0,
    isBookmarked: false
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

  useEffect(() => {
    if (!isNew && id) {
      const fetchComments = async () => {
        try {
          const data = await templateService.getComments(id);
          setComments(data);
        } catch (err) {
          console.error('Failed to fetch comments:', err);
        }
      };
      fetchComments();
    }
  }, [id, isNew]);

  const handleInputChange = (field: string, value: string) => {
    setTemplate((prev) => ({ ...prev, [field]: value }));
  };

  const validateTemplate = () => {
    if (!template.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!template.description.trim()) {
      toast.error('Description is required');
      return false;
    }
    if (!template.designContext.trim()) {
      toast.error('Design Context is required');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateTemplate()) return;

    try {
      setSaving(true);
      setError(null);

      let savedTemplate;
      if (isNew) {
        savedTemplate = await templateService.createTemplate(template);
        toast.success('Template created successfully');
      } else {
        savedTemplate = await templateService.updateTemplate(
          template.id,
          template,
        );
        toast.success('Template updated successfully');
      }

      // Navigate back to templates list after successful save
      navigate("/templates");
    } catch (err: any) {
      toast.error(err.message || "Failed to save template");
      setError(err.message || "Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await templateService.deleteTemplate(template.id);
      toast.success('Template deleted successfully');
      navigate("/templates");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete template");
      setError(err.message || "Failed to delete template");
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/templates");
  };

  const handleAddComment = async (content: string) => {
    if (!id) return;
    try {
      const newComment = await templateService.addComment(id, content);
      setComments(prev => [newComment, ...prev]);
      setTemplate(prev => ({
        ...prev,
        commentCount: (prev.commentCount || 0) + 1
      }));
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const handleExportPdf = async () => {
    try {
      await exportToPdf(template);
      toast.success('Template exported to PDF');
    } catch (err) {
      toast.error('Failed to export template');
    }
  };

  const handleExportMarkdown = () => {
    try {
      const markdown = exportToMarkdown(template);
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.title.toLowerCase().replace(/\s+/g, '-')}.md`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Template exported to Markdown');
    } catch (err) {
      toast.error('Failed to export template');
    }
  };

  const mode = isNew ? 'create' : isEdit ? 'edit' : 'view';

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
      <Toaster position="top-right" />
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
        {!isNew && (
          <div className="flex space-x-2 mr-4">
            <Button variant="outline" size="sm" onClick={handleExportPdf}>
              <FileDown className="h-4 w-4 mr-1" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportMarkdown}>
              <FileText className="h-4 w-4 mr-1" />
              Export MD
            </Button>
          </div>
        )}
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
                required
                className={template.title.trim() ? "" : "border-red-500"}
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
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
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
              required
              className={template.description.trim() ? "" : "border-red-500"}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 shadow-md">
        <CardHeader className="border-b">
          <CardTitle className="text-xl text-primary">Template Details</CardTitle>
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

            <TabsContent value="design-context" className="mt-6 px-4">
              <RichTextSection
                title="Design Context"
                content={template.designContext || ""}
                onChange={(value) => handleInputChange("designContext", value)}
                isEditable={isEditable || isNew}
              />
            </TabsContent>

            <TabsContent value="system-impacts" className="mt-6 px-4">
              <RichTextSection
                title="System Impacts"
                content={template.systemImpacts || ""}
                onChange={(value) => handleInputChange("systemImpacts", value)}
                isEditable={isEditable || isNew}
              />
            </TabsContent>

            <TabsContent value="assumptions" className="mt-6 px-4">
              <RichTextSection
                title="Assumptions"
                content={template.assumptions || ""}
                onChange={(value) => handleInputChange("assumptions", value)}
                isEditable={isEditable || isNew}
              />
            </TabsContent>

            <TabsContent value="out-of-scope" className="mt-6 px-4">
              <RichTextSection
                title="Out of Scope"
                content={template.outOfScope || ""}
                onChange={(value) => handleInputChange("outOfScope", value)}
                isEditable={isEditable || isNew}
              />
            </TabsContent>

            <TabsContent value="other-areas" className="mt-6 px-4">
              <RichTextSection
                title="Other Areas to Consider"
                content={template.otherAreasToConsider || ""}
                onChange={(value) =>
                  handleInputChange("otherAreasToConsider", value)
                }
                isEditable={isEditable || isNew}
              />
            </TabsContent>

            <TabsContent value="appendix" className="mt-6 px-4">
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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <Comments
            templateId={template.id}
            onAddComment={handleAddComment}
            comments={comments}
          />
        </CardContent>
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

const RichTextSection = forwardRef<ReactQuill, RichTextSectionProps>(
  ({ title, content, onChange, isEditable }, ref) => {
    const modules = {
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        [{ align: [] }],
        ["clean"],
      ],
    };

    const formats = [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "bullet",
      "link",
      "image",
      "align",
    ];

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-medium text-primary">{title}</h3>
        {isEditable ? (
          <div className="rich-text-editor">
            <ReactQuill
              ref={ref}
              theme="snow"
              value={content}
              onChange={onChange}
              modules={modules}
              formats={formats}
              className="bg-background min-h-[500px]"
              style={{ height: '500px' }}
            />
            <style>{`
              .rich-text-editor .ql-container {
                height: calc(500px - 42px) !important;
                font-size: 16px;
              }
              .rich-text-editor .ql-editor {
                padding: 1.5rem;
              }
              .rich-text-editor .ql-toolbar {
                border-top-left-radius: 0.5rem;
                border-top-right-radius: 0.5rem;
                background-color: hsl(var(--background));
                border-color: hsl(var(--border));
              }
              .rich-text-editor .ql-container {
                border-bottom-left-radius: 0.5rem;
                border-bottom-right-radius: 0.5rem;
                background-color: hsl(var(--background));
                border-color: hsl(var(--border));
              }
              .rich-text-editor .ql-editor {
                color: hsl(var(--foreground));
              }
              :root[class~='dark'] .rich-text-editor .ql-snow .ql-stroke {
                stroke: hsl(var(--foreground));
              }
              :root[class~='dark'] .rich-text-editor .ql-snow .ql-fill {
                fill: hsl(var(--foreground));
              }
            `}</style>
          </div>
        ) : (
          <div
            className="border rounded-md p-6 prose dark:prose-invert max-w-none min-h-[300px] bg-background"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    );
  }
);

RichTextSection.displayName = "RichTextSection";

export default TemplateDetail;
