import { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { AuthRequest } from '../types';

const reportSchema = z.object({
  title: z.string().min(2, 'Título deve ter pelo menos 2 caracteres'),
  content: z.string().min(10, 'Conteúdo deve ter pelo menos 10 caracteres'),
  type: z.string().min(1, 'Tipo é obrigatório'),
});

export async function listReports(req: AuthRequest, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const type = req.query.type as string;

    const where: any = {};
    if (type) where.type = type;

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: { createdBy: { select: { name: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.report.count({ where }),
    ]);

    res.json({
      data: reports,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function getReport(req: AuthRequest, res: Response): Promise<void> {
  try {
    const report = await prisma.report.findUnique({
      where: { id: req.params.id },
      include: { createdBy: { select: { name: true, email: true } } },
    });

    if (!report) {
      res.status(404).json({ error: 'Relatório não encontrado' });
      return;
    }

    res.json(report);
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function createReport(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = reportSchema.parse(req.body);

    const report = await prisma.report.create({
      data: {
        ...data,
        createdById: req.user!.userId,
      },
    });

    res.status(201).json(report);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function deleteReport(req: AuthRequest, res: Response): Promise<void> {
  try {
    await prisma.report.delete({ where: { id: req.params.id } });
    res.json({ message: 'Relatório removido com sucesso' });
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
