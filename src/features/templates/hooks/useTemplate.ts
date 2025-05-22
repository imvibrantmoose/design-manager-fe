import { useState, useEffect } from 'react';
import { Template } from '../types';
import { templateService } from '../services/templateService';

export const useTemplate = (id?: string) => {
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const data = await templateService.getTemplateById(id);
        setTemplate(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);

  return { template, loading, error };
};
