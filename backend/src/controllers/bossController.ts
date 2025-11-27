import { Request, Response } from 'express';
import { allocateStatPoints, getBossForUser } from '../services/bossService';
import { prisma } from '../config/prisma';

export async function getBoss(req: Request, res: Response) {
  try {
    const boss = await getBossForUser((req as any).userId);
    return res.json(boss);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load boss' });
  }
}

export async function getResources(req: Request, res: Response) {
  try {
    const boss = await getBossForUser((req as any).userId);
    return res.json({
      cash: boss?.cash,
      streetCred: boss?.streetCred,
      heat: boss?.heat,
      energy: boss?.energy,
      maxEnergy: boss?.maxEnergy,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load resources' });
  }
}

export async function allocateStats(req: Request, res: Response) {
  try {
    const boss = await getBossForUser((req as any).userId);
    if (!boss) return res.status(404).json({ message: 'Boss not found' });
    const updated = await allocateStatPoints(boss.id, req.body || {});
    return res.json(updated);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

export async function layLow(req: Request, res: Response) {
  try {
    const boss = await getBossForUser((req as any).userId);
    if (!boss) return res.status(404).json({ message: 'Boss not found' });
    if (boss.energy < 10) return res.status(400).json({ message: 'Not enough energy' });
    const cooled = await prisma.boss.update({
      where: { id: boss.id },
      data: { energy: boss.energy - 10, heat: Math.max(0, boss.heat - 8) },
    });
    return res.json(cooled);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to lay low' });
  }
}
