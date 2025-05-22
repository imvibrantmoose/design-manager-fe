import { useState, useEffect } from 'react';
import templateService from '../services/templateService';
import { Template } from '../types';

export const useTemplateList = (userId: string = '', initialPage = 0, pageSize = 9) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalTemplates, setTotalTemplates] = useState(0);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await templateService.getAllTemplates(currentPage, pageSize);
        if ('content' in response) {
          setTemplates(response.content);
          setTotalPages(response.totalPages);
          setTotalTemplates(response.totalElements);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [currentPage, pageSize]);

  const handleLike = async (templateId: string) => {
    try {
      await templateService.toggleLike(templateId);
      setTemplates(prevTemplates => 
        prevTemplates.map(t => {
          if (t.id === templateId) {
            return {
              ...t,
              likes: (t.likes || []).includes(userId) 
                ? (t.likes || []).filter(id => id !== userId)
                : [...(t.likes || []), userId]
            };
          }
          return t;
        })
      );
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleBookmark = async (templateId: string) => {
    try {
      await templateService.toggleBookmark(templateId);
      setTemplates(prevTemplates =>
        prevTemplates.map(t => {
          if (t.id === templateId) {
            return {
              ...t,
              isBookmarked: !t.isBookmarked,
              bookmarkCount: (t.isBookmarked ? t.bookmarkCount - 1 : t.bookmarkCount + 1)
            };
          }
          return t;
        })
      );
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const handleDelete = async (templateId: string) => {
    try {
      await templateService.deleteTemplate(templateId);
      setTemplates(prevTemplates => prevTemplates.filter(t => t.id !== templateId));
    } catch (err) {
      console.error('Failed to delete template:', err);
    }
  };

  return {
    templates,
    loading,
    error,
    currentPage,
    totalPages,
    totalTemplates,
    setCurrentPage,
    handleLike,
    handleBookmark,
    handleDelete
  };
};
