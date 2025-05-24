import { useState, useEffect } from 'react';
import categoryService, { Category } from '@/services/categoryService';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch categories:', err);
      // Set default categories on error
      setCategories([]);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, refetch: fetchCategories };
};
