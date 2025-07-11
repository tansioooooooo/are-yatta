import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, isToday, isPast } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getTasks } from '../api/tasks';
import TaskCard from '../components/TaskCard';

const Dashboard: React.FC = () => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const { data: todayTasks, isLoading: isLoadingToday } = useQuery({
    queryKey: ['tasks', 'today'],
    queryFn: () => getTasks({ dueDate: today }),
  });

  const { data: overdueTasks, isLoading: isLoadingOverdue } = useQuery({
    queryKey: ['tasks', 'overdue'],
    queryFn: async () => {
      const tasks = await getTasks({ dueDate: today });
      return tasks.filter(task => isPast(new Date(task.nextDueDate)) && !isToday(new Date(task.nextDueDate)));
    },
  });

  const todayCount = todayTasks?.filter(task => isToday(new Date(task.nextDueDate))).length || 0;
  const overdueCount = overdueTasks?.length || 0;

  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ダッシュボード</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">今日のタスク</dt>
                <dd className="text-2xl font-semibold text-gray-900">{todayCount}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">期限切れ</dt>
                <dd className="text-2xl font-semibold text-gray-900">{overdueCount}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {overdueCount > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              期限切れのタスク
            </h2>
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              {isLoadingOverdue ? (
                <div className="text-gray-500">読み込み中...</div>
              ) : (
                overdueTasks?.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">今日のタスク</h2>
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {isLoadingToday ? (
              <div className="text-gray-500">読み込み中...</div>
            ) : todayCount === 0 ? (
              <div className="text-gray-500">今日のタスクはありません</div>
            ) : (
              todayTasks?.filter(task => isToday(new Date(task.nextDueDate))).map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;