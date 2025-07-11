import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getTask, getTaskHistory, deleteTask, completeTask } from '../api/tasks';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: task, isLoading } = useQuery({
    queryKey: ['task', id],
    queryFn: () => getTask(id!),
    enabled: !!id,
  });

  const { data: history } = useQuery({
    queryKey: ['task', id, 'history'],
    queryFn: () => getTaskHistory(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      navigate('/tasks');
    },
  });

  const completeMutation = useMutation({
    mutationFn: (notes: string) => completeTask(id!, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleDelete = () => {
    if (window.confirm('このタスクを削除してもよろしいですか？')) {
      deleteMutation.mutate(id!);
    }
  };

  const handleComplete = () => {
    const notes = window.prompt('完了メモ（任意）:');
    completeMutation.mutate(notes || '');
  };

  if (isLoading || !task) {
    return <div className="px-4 sm:px-0">読み込み中...</div>;
  }

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
    <div className="px-4 sm:px-0 max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: task.category.color }}
                  />
                  {task.category.name}
                </span>
                <span>{getRecurrenceText()}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleComplete}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                完了
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                削除
              </button>
            </div>
          </div>

          {task.description && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">説明</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">次回実行日</h3>
            <p className="text-gray-600">
              {format(new Date(task.nextDueDate), 'yyyy年M月d日 (EEEE)', { locale: ja })}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">実行履歴</h3>
            {history && history.length > 0 ? (
              <div className="space-y-2">
                {history.map((item) => (
                  <div key={item.id} className="border-l-4 border-gray-200 pl-4 py-2">
                    <p className="text-sm text-gray-600">
                      {format(new Date(item.completedAt), 'yyyy年M月d日 HH:mm', { locale: ja })}
                    </p>
                    {item.notes && (
                      <p className="text-sm text-gray-500 mt-1">{item.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">まだ実行履歴がありません</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;