import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// カテゴリー一覧取得
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { tasks: true }
        }
      }
    });

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// カテゴリー作成
router.post('/', async (req, res) => {
  try {
    const { name, color, icon } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        color,
        icon
      }
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// カテゴリー更新
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, icon } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        color,
        icon
      }
    });

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// カテゴリー削除
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;