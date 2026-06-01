import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../types';

export async function getDashboard(req: AuthRequest, res: Response): Promise<void> {
  try {
    const [totalUsers, totalProducts, totalReports, recentProducts, recentUsers] = await Promise.all([
      prisma.user.count({ where: { active: true } }),
      prisma.product.count({ where: { active: true } }),
      prisma.report.count(),
      prisma.product.findMany({
        where: { active: true },
        select: { id: true, name: true, price: true, stock: true, category: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.user.findMany({
        where: { active: true },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    const productsByCategory = await prisma.product.groupBy({
      by: ['category'],
      where: { active: true },
      _count: { id: true },
      _sum: { stock: true },
    });

    res.json({
      stats: {
        totalUsers,
        totalProducts,
        totalReports,
      },
      recentProducts,
      recentUsers,
      productsByCategory: productsByCategory.map((c) => ({
        category: c.category,
        count: c._count.id,
        totalStock: c._sum.stock || 0,
      })),
    });
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
