import { prisma } from '../config/prisma';

export function computeIncome(base: number, level: number, bossLevel: number) {
  const levelScale = 1 + bossLevel * 0.08;
  const upgradeScale = Math.pow(1.25, level - 1);
  return Math.round(base * levelScale * upgradeScale);
}

export async function listProperties() {
  return prisma.propertyTemplate.findMany();
}

export async function getOwnerships(userId: number) {
  return prisma.propertyOwnership.findMany({
    where: { userId },
    include: { property: true },
  });
}

export async function buyProperty(userId: number, propertyId: number) {
  const property = await prisma.propertyTemplate.findUnique({ where: { id: propertyId } });
  const boss = await prisma.boss.findUnique({ where: { userId } });
  if (!property || !boss) throw new Error('Missing property or boss');
  if (boss.cash < property.basePurchaseCost) throw new Error('Not enough cash');

  const ownership = await prisma.propertyOwnership.create({
    data: { userId, propertyId, upgradeLevel: 1 },
  });

  await prisma.boss.update({
    where: { id: boss.id },
    data: { cash: boss.cash - property.basePurchaseCost },
  });

  return ownership;
}

export async function collectIncome(userId: number, ownershipId: number) {
  const ownership = await prisma.propertyOwnership.findFirst({
    where: { id: ownershipId, userId },
    include: { property: true },
  });
  const boss = await prisma.boss.findUnique({ where: { userId } });
  if (!ownership || !boss) throw new Error('Missing ownership or boss');

  const now = new Date();
  const minutes = Math.max(1, Math.floor((now.getTime() - ownership.lastCollectedAt.getTime()) / 60000));
  const incomePerMinute = computeIncome(ownership.property.baseIncomePerMinute, ownership.upgradeLevel, boss.level);
  const cashGain = incomePerMinute * minutes;
  const streetCredGain = computeIncome(ownership.property.baseStreetCredPerMinute, ownership.upgradeLevel, boss.level);
  const heatGain = computeIncome(ownership.property.baseHeatPerMinute, ownership.upgradeLevel, boss.level);

  const updatedOwnership = await prisma.propertyOwnership.update({
    where: { id: ownership.id },
    data: { lastCollectedAt: now },
  });

  const updatedBoss = await prisma.boss.update({
    where: { id: boss.id },
    data: {
      cash: boss.cash + cashGain,
      streetCred: boss.streetCred + streetCredGain,
      heat: Math.max(0, boss.heat + heatGain),
    },
  });

  return { ownership: updatedOwnership, boss: updatedBoss, rewards: { cashGain, streetCredGain, heatGain } };
}

export async function upgradeProperty(userId: number, ownershipId: number) {
  const ownership = await prisma.propertyOwnership.findFirst({
    where: { id: ownershipId, userId },
    include: { property: true },
  });
  const boss = await prisma.boss.findUnique({ where: { userId } });
  if (!ownership || !boss) throw new Error('Missing ownership or boss');

  const cost = Math.round(ownership.property.basePurchaseCost * Math.pow(1.6, ownership.upgradeLevel));
  if (boss.cash < cost) throw new Error('Not enough cash');

  const updatedOwnership = await prisma.propertyOwnership.update({
    where: { id: ownership.id },
    data: { upgradeLevel: ownership.upgradeLevel + 1 },
    include: { property: true },
  });

  const updatedBoss = await prisma.boss.update({
    where: { id: boss.id },
    data: { cash: boss.cash - cost },
  });

  return { ownership: updatedOwnership, boss: updatedBoss, cost };
}
