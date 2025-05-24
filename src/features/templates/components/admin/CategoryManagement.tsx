import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
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
import categoryService from '@/services/categoryService';

export const CategoryManagement = () => {
  const [categories, setCategories] = useState<Array<{
    id: string;
    name: string;
    description: string;
    usageCount: number;
  }>>([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      const categoriesWithUsage = await Promise.all(
        data.map(async (category) => ({
          ...category,
          usageCount: await categoryService.getCategoryUsageCount(category.name)
        }))
      );
      setCategories(categoriesWithUsage);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const handleAddCategory = async () => {
    try {
      setLoading(true);
      await categoryService.createCategory(newCategory);
      setNewCategory({ name: '', description: '' });
      await fetchCategories();
      toast.success('Category added successfully');
    } catch (error) {
      toast.error('Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string, usageCount: number) => {
    if (usageCount > 0) {
      toast.error('Cannot delete category that is being used by templates');
      return;
    }

    try {
      setLoading(true);
      await categoryService.deleteCategory(id);
      await fetchCategories();
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="Category name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />
          <Input
            placeholder="Description"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
          />
          <Button 
            onClick={handleAddCategory} 
            disabled={loading || !newCategory.name.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        <div className="grid gap-4">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-grow">
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
                <div className="text-sm text-muted-foreground mt-1">
                  Used in {category.usageCount} templates
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    disabled={category.usageCount > 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Category</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this category? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handleDeleteCategory(category.id, category.usageCount)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
