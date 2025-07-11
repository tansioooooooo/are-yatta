import React from 'react';
import { Link } from 'react-router-dom';
import { format, isPast, isToday } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '../types';
import { completeTask } from '../api/tasks';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const queryClient = useQueryClient();
  const dueDate = new Date(task.nextDueDate);
  const isOverdue = isPast(dueDate) && !isToday(dueDate);

  const completeMutation = useMutation({
    mutationFn: () => completeTask(task.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleComplete = (e: React.MouseEvent) => {
    e.preventDefault();
    completeMutation.mutate();
  };

  const getRecurrenceText = () => {
    switch (task.recurrencePattern) {
      case 'DAILY':
        return `${task.recurrenceInterval}日ごと`;
      case 'WEEKLY':
        return `${task.recurrenceInterval}週間ごと`;
      case 'MONTHLY':
        return `${task.recurrenceInterval}ヶ月ごと`;
      case 'CUSTOM':
        return `${task.recurrenceInterval}日ごと（カスタム）`;
      default:
        return '';
    }
  };

  return (
    <Link to={`/tasks/${task.id}`} className="block">
      <div className={`bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border-l-4 ${
        isOverdue ? 'border-red-500' : 'border-transparent'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <span
                className="inline-block w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: task.category.color }}
              />
              <span className="text-sm text-gray-500">{task.category.name}</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
            )}
            <div className="flex flex-wrap gap-2 text-sm">
              <span className={`inline-flex items-center ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {format(dueDate, 'M月d日', { locale: ja })}
              </span>
              <span className="text-gray-500">
                <svg className="w-4 h-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {getRecurrenceText()}
              </span>
            </div>
          </div>
          <button
            onClick={handleComplete}
            disabled={completeMutation.isPending}
            className="ml-4 p-2 text-gray-400 hover:text-green-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default TaskCard;