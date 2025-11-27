import { Request, Response } from 'express';
import { startCombat } from '../services/combatService';
import { prisma } from '../config/prisma';

export async function listEnemies(_req: Request, res: Response) {
  const enemies = await prisma.enemy.findMany();
  return res.json(enemies);
}

export async function startCombatEncounter(req: Request, res: Response) {
  try {
    const enemyId = Number(req.body.enemyId);
    const result = await startCombat((req as any).userId, enemyId);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}
