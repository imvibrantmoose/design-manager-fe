import { useState } from 'react';
import { useTemplateList } from '../hooks/useTemplateList';
import { TemplateCard } from '../components/list/TemplateCard';
import { TemplateFilters } from '../components/list/TemplateFilters';
import { TemplatePagination } from '../components/list/TemplatePagination';

interface TemplateListPageProps {
  userRole?: 'read' | 'read-write' | 'admin';
  userId?: string;
}

export const TemplateListPage = ({ userRole = 'read', userId = '' }: TemplateListPageProps) => {
  const {
    templates,
    loading,
    error,
    currentPage,
    totalPages,
    totalTemplates,
    setCurrentPage,
    handleLike,
    handleBookmark,
    handleDelete,
  } = useTemplateList(userId);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const categories = ['all', ...new Set(templates.map((t) => t.category))];

  if (loading || error) {
    return null; // Or loading/error component
  }

  return (
    <div className="container mx-auto py-8">
      <TemplateFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        categories={categories}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            userId={userId}
            userRole={userRole}
            onLike={handleLike}
            onBookmark={handleBookmark}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <TemplatePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
