import { apiClient } from './client';
import { Task, CreateTaskInput, UpdateTaskInput } from '../types';

export const getTasks = async (params?: { categoryId?: string; dueDate?: Date }): Promise<Task[]> => {
  const { data } = await apiClient.get('/tasks', { params });
  return data;
};

export const getTask = async (id: string): Promise<Task> => {
  const { data } = await apiClient.get(`/tasks/${id}`);
  return data;
};

export const createTask = async (input: CreateTaskInput): Promise<Task> => {
  const { data } = await apiClient.post('/tasks', input);
  return data;
};

export const updateTask = async (id: string, input: UpdateTaskInput): Promise<Task> => {
  const { data } = await apiClient.put(`/tasks/${id}`, input);
  return data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};

export const completeTask = async (id: string, notes?: string): Promise<Task> => {
  const { data } = await apiClient.post(`/tasks/${id}/complete`, { notes });
  return data;
};

export const getTaskHistory = async (id: string): Promise<any[]> => {
  const { data } = await apiClient.get(`/tasks/${id}/history`);
  return data;
};