import { prisma } from '../config/prisma';
import { calculateBossDps, calculateEffectiveStats, getBossForUser } from './bossService';

interface CombatTick {
  timestamp: number;
  bossHp: number;
  enemyHp: number;
}

const TICK_MS = 500;

export async function startCombat(userId: number, enemyId: number) {
  const enemy = await prisma.enemy.findUnique({ where: { id: enemyId } });
  const boss = await getBossForUser(userId);
  if (!enemy || !boss) throw new Error('Missing boss or enemy');

  const stats = calculateEffectiveStats({ ...boss, weapon: boss.weapon, armor: boss.armor, accessoryOne: boss.accessoryOne, accessoryTwo: boss.accessoryTwo });
  const bossDps = calculateBossDps({ ...boss, weapon: boss.weapon });
  const bossMaxHp = Math.round(stats.strength * 15 + stats.tech * 6 + 80);
  const enemyDps = Math.round(enemy.baseDps * (1 + boss.level * 0.05));

  let bossHp = bossMaxHp;
  let enemyHp = enemy.maxHealth;
  const log: CombatTick[] = [];
  let time = 0;
  while (bossHp > 0 && enemyHp > 0) {
    time += TICK_MS;
    enemyHp -= (bossDps / 1000) * TICK_MS;
    bossHp -= (enemyDps / 1000) * TICK_MS;
    log.push({ timestamp: time, bossHp: Math.max(0, Math.round(bossHp)), enemyHp: Math.max(0, Math.round(enemyHp)) });
  }

  const bossWon = enemyHp <= 0;
  const cashChange = bossWon ? enemy.cashReward : -Math.round(enemy.cashReward * 0.3);
  const xpGain = bossWon ? enemy.xpReward : Math.round(enemy.xpReward * 0.4);
  const streetCredChange = bossWon ? Math.round(enemy.level * 3) : 0;
  const heatChange = bossWon ? 1 : 3;

  const updatedBoss = await prisma.boss.update({
    where: { id: boss.id },
    data: {
      cash: boss.cash + cashChange,
      streetCred: boss.streetCred + streetCredChange,
      heat: Math.max(0, boss.heat + heatChange),
      experience: boss.experience + xpGain,
    },
  });

  const session = await prisma.combatSession.create({
    data: {
      userId,
      enemyId,
      bossCurrentHp: Math.max(0, Math.round(bossHp)),
      enemyCurrentHp: Math.max(0, Math.round(enemyHp)),
      bossEffectiveDps: bossDps,
      enemyEffectiveDps: enemyDps,
      status: bossWon ? 'won' : 'lost',
      log,
    },
  });

  return { session, boss: updatedBoss, rewards: { cashChange, xpGain, streetCredChange, heatChange }, enemy };
}
