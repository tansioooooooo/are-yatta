import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { addDays, addWeeks, addMonths } from 'date-fns';

const router = Router();
const prisma = new PrismaClient();

// タスク一覧取得
router.get('/', async (req, res) => {
  try {
    const { categoryId, dueDate } = req.query;
    
    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (dueDate) where.nextDueDate = { lte: new Date(dueDate as string) };

    const tasks = await prisma.task.findMany({
      where,
      include: {
        category: true,
        histories: {
          orderBy: { completedAt: 'desc' },
          take: 1
        }
      },
      orderBy: { nextDueDate: 'asc' }
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// タスク作成
router.post('/', async (req, res) => {
  try {
    const { title, description, categoryId, recurrencePattern, recurrenceInterval } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        categoryId,
        recurrencePattern,
        recurrenceInterval: recurrenceInterval || 1,
        nextDueDate: new Date()
      },
      include: { category: true }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// タスク更新
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, categoryId, recurrencePattern, recurrenceInterval } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        categoryId,
        recurrencePattern,
        recurrenceInterval
      },
      include: { category: true }
    });

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// タスク削除
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// タスク完了
router.post('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const task = await prisma.task.findUnique({
      where: { id }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // 履歴を作成
    await prisma.taskHistory.create({
      data: {
        taskId: id,
        notes
      }
    });

    // 次回実行日を計算
    let nextDueDate = new Date(task.nextDueDate);
    
    switch (task.recurrencePattern) {
      case 'DAILY':
        nextDueDate = addDays(nextDueDate, task.recurrenceInterval);
        break;
      case 'WEEKLY':
        nextDueDate = addWeeks(nextDueDate, task.recurrenceInterval);
        break;
      case 'MONTHLY':
        nextDueDate = addMonths(nextDueDate, task.recurrenceInterval);
        break;
      case 'CUSTOM':
        nextDueDate = addDays(nextDueDate, task.recurrenceInterval);
        break;
    }

    // タスクを更新
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { nextDueDate },
      include: { category: true }
    });

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to complete task' });
  }
});

// タスク履歴取得
router.get('/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    
    const histories = await prisma.taskHistory.findMany({
      where: { taskId: id },
      orderBy: { completedAt: 'desc' }
    });

    res.json(histories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch task history' });
  }
});

export default router;