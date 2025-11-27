import { prisma } from '../config/prisma';
import { calculateEffectiveStats, getBossForUser } from './bossService';

function computeSuccessChance(stats: Record<string, number>, crimeDifficulty: number, heat: number) {
  const powerScore = (stats.cunning || 0) * 1.3 + (stats.strength || 0) * 1.1 + (stats.charisma || 0) * 0.4;
  const difficultyFactor = crimeDifficulty * 8 + heat * 0.5;
  const chance = Math.max(10, Math.min(95, 60 + powerScore - difficultyFactor));
  return chance;
}

export async function listCrimes() {
  return prisma.crimeTemplate.findMany();
}

export async function attemptCrime(userId: number, crimeId: number) {
  const crime = await prisma.crimeTemplate.findUnique({ where: { id: crimeId } });
  const boss = await getBossForUser(userId);
  if (!crime || !boss) throw new Error('Missing boss or crime');
  if (boss.energy < crime.energyCost) throw new Error('Not enough energy');

  const updatedBoss = await prisma.boss.update({
    where: { id: boss.id },
    data: { energy: boss.energy - crime.energyCost },
  });

  const stats = calculateEffectiveStats({ ...updatedBoss, weapon: boss.weapon, armor: boss.armor, accessoryOne: boss.accessoryOne, accessoryTwo: boss.accessoryTwo });
  const chance = computeSuccessChance(stats, crime.difficulty, updatedBoss.heat);
  const roll = Math.random() * 100;
  const success = roll <= chance;

  let cashChange = 0;
  let streetCredChange = 0;
  let heatChange = crime.baseHeatGain;
  let xpGain = Math.round(15 + crime.difficulty * 3);

  if (success) {
    const scaling = 1 + updatedBoss.level * 0.1;
    cashChange = Math.round(crime.baseRewardCash * scaling);
    streetCredChange = Math.round(crime.baseRewardStreetCred * scaling * 0.6);
  } else {
    const penalty = crime.failurePenalty as { cashLoss?: number; heatGain?: number };
    cashChange = -(penalty.cashLoss || 0);
    heatChange += penalty.heatGain || 0;
    xpGain = Math.round(xpGain * 0.5);
  }

  const finalBoss = await prisma.boss.update({
    where: { id: updatedBoss.id },
    data: {
      cash: updatedBoss.cash + cashChange,
      streetCred: updatedBoss.streetCred + streetCredChange,
      heat: Math.max(0, updatedBoss.heat + heatChange),
      experience: updatedBoss.experience + xpGain,
    },
  });

  return {
    success,
    chance,
    roll,
    boss: finalBoss,
    rewards: { cashChange, streetCredChange, heatChange, xpGain },
    crime,
  };
}
