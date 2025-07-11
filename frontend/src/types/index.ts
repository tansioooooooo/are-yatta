export type RecurrencePattern = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    tasks: number;
  };
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  category: Category;
  recurrencePattern: RecurrencePattern;
  recurrenceInterval: number;
  nextDueDate: string;
  createdAt: string;
  updatedAt: string;
  histories?: TaskHistory[];
}

export interface TaskHistory {
  id: string;
  taskId: string;
  completedAt: string;
  notes?: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  categoryId: string;
  recurrencePattern: RecurrencePattern;
  recurrenceInterval?: number;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  categoryId?: string;
  recurrencePattern?: RecurrencePattern;
  recurrenceInterval?: number;
}

export interface CreateCategoryInput {
  name: string;
  color: string;
  icon?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  color?: string;
  icon?: string;
}