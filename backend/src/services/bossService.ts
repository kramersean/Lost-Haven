import { prisma } from '../config/prisma';
import { Boss, Item } from '@prisma/client';

const ENERGY_REGEN_PER_MINUTE = 5;

export async function getBossForUser(userId: number) {
  const boss = await prisma.boss.findUnique({
    where: { userId },
    include: {
      weapon: true,
      armor: true,
      accessoryOne: true,
      accessoryTwo: true,
    },
  });

  if (!boss) return null;
  return applyEnergyRegeneration(boss);
}

export async function applyEnergyRegeneration(boss: Boss & { weapon?: Item | null; armor?: Item | null; accessoryOne?: Item | null; accessoryTwo?: Item | null }) {
  const now = new Date();
  const minutesElapsed = Math.floor((now.getTime() - boss.lastEnergyAt.getTime()) / 60000);
  if (minutesElapsed <= 0) return boss;

  const restored = minutesElapsed * ENERGY_REGEN_PER_MINUTE;
  const newEnergy = Math.min(boss.maxEnergy, boss.energy + restored);

  return prisma.boss.update({
    where: { id: boss.id },
    data: { energy: newEnergy, lastEnergyAt: now },
    include: {
      weapon: true,
      armor: true,
      accessoryOne: true,
      accessoryTwo: true,
    },
  });
}

export function calculateEffectiveStats(boss: Boss & { weapon?: Item | null; armor?: Item | null; accessoryOne?: Item | null; accessoryTwo?: Item | null }) {
  const base = { strength: boss.strength, cunning: boss.cunning, charisma: boss.charisma, tech: boss.tech };
  const bonuses = [boss.weapon, boss.armor, boss.accessoryOne, boss.accessoryTwo]
    .filter(Boolean)
    .map((item) => (item?.statBonuses as Record<string, number>) || {});

  const effective = { ...base } as Record<string, number>;
  for (const bonus of bonuses) {
    Object.entries(bonus).forEach(([key, value]) => {
      effective[key] = (effective[key] || 0) + Number(value);
    });
  }
  return effective;
}

export function calculateBossDps(boss: Boss & { weapon?: Item | null }) {
  const effectiveStats = calculateEffectiveStats({ ...boss, armor: boss.armor, accessoryOne: boss.accessoryOne, accessoryTwo: boss.accessoryTwo });
  const baseDps = Math.round(effectiveStats.strength * 1.5 + effectiveStats.cunning * 1.2 + (boss.weapon?.dpsBonus || 0));
  return Math.max(4, baseDps);
}

export async function allocateStatPoints(bossId: number, payload: Partial<Record<'strength' | 'cunning' | 'charisma' | 'tech', number>>) {
  const boss = await prisma.boss.findUnique({ where: { id: bossId } });
  if (!boss) throw new Error('Boss not found');
  const totalRequested = Object.values(payload).reduce((acc, val) => acc + (val || 0), 0);
  if (totalRequested > boss.statPoints) {
    throw new Error('Not enough stat points');
  }
  return prisma.boss.update({
    where: { id: bossId },
    data: {
      statPoints: boss.statPoints - totalRequested,
      strength: boss.strength + (payload.strength || 0),
      cunning: boss.cunning + (payload.cunning || 0),
      charisma: boss.charisma + (payload.charisma || 0),
      tech: boss.tech + (payload.tech || 0),
    },
  });
}

export async function adjustResources(bossId: number, changes: Partial<Boss>) {
  return prisma.boss.update({
    where: { id: bossId },
    data: changes,
  });
}
