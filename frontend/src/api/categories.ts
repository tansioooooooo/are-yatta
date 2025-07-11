import { apiClient } from './client';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '../types';

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await apiClient.get('/categories');
  return data;
};

export const createCategory = async (input: CreateCategoryInput): Promise<Category> => {
  const { data } = await apiClient.post('/categories', input);
  return data;
};

export const updateCategory = async (id: string, input: UpdateCategoryInput): Promise<Category> => {
  const { data } = await apiClient.put(`/categories/${id}`, input);
  return data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
};