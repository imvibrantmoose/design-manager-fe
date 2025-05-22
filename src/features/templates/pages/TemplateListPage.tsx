import { useState, useMemo } from 'react';
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

  // Filter templates based on search and category
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.designContext.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === 'all' || template.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchTerm, categoryFilter]);

  if (loading) {
    return <div className="flex justify-center items-center py-12">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8 bg-background">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Design Templates</h1>
          <span className="text-muted-foreground">
            {totalTemplates} {totalTemplates === 1 ? 'template' : 'templates'}
          </span>
        </div>

        <TemplateFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          categories={categories}
        />

        {filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-xl text-muted-foreground mb-4">No templates found</p>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredTemplates.map((template) => (
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
        )}
        
        <TemplatePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};
