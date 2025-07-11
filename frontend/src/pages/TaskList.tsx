import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../api/tasks';
import { getCategories } from '../api/categories';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';

const TaskList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks', selectedCategory],
    queryFn: () => getTasks(selectedCategory ? { categoryId: selectedCategory } : undefined),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  return (
    <div className="px-4 sm:px-0">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">タスク一覧</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <svg className="w-5 h-5 mr-2 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新規タスク
        </button>
      </div>

      <div className="mb-6">
        <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
          カテゴリーでフィルター
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="block w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">すべてのカテゴリー</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {isLoadingTasks ? (
          <div className="text-gray-500">読み込み中...</div>
        ) : tasks?.length === 0 ? (
          <div className="text-gray-500">タスクがありません</div>
        ) : (
          tasks?.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>

      {isCreateModalOpen && (
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          categories={categories || []}
        />
      )}
    </div>
  );
};

export default TaskList;