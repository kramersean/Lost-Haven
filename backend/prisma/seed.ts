import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const starterItems = [
    {
      name: 'Rusty Pistol',
      type: 'weapon',
      rarity: 'common',
      statBonuses: { strength: 2, cunning: 1 },
      dpsBonus: 6,
      levelRequirement: 1,
      buyPrice: 200,
      sellPrice: 80,
    },
    {
      name: 'Kevlar Vest',
      type: 'armor',
      rarity: 'rare',
      statBonuses: { strength: 1, tech: 2 },
      dpsBonus: 0,
      levelRequirement: 3,
      buyPrice: 450,
      sellPrice: 180,
    },
    {
      name: 'Neon Signet',
      type: 'accessory',
      rarity: 'epic',
      statBonuses: { charisma: 3 },
      dpsBonus: 0,
      levelRequirement: 5,
      buyPrice: 800,
      sellPrice: 350,
    },
  ];

  for (const item of starterItems) {
    await prisma.item.upsert({
      where: { name: item.name },
      update: item,
      create: item,
    });
  }

  const crimes = [
    {
      name: 'Shakedown a Shop',
      description: 'Intimidate a corner shop owner for quick cash.',
      difficulty: 2,
      energyCost: 10,
      recommendedStats: { cunning: 6, strength: 5 },
      baseRewardCash: 120,
      baseRewardStreetCred: 5,
      baseHeatGain: 3,
      failurePenalty: { cashLoss: 40, heatGain: 5 },
    },
    {
      name: 'Corner Store Robbery',
      description: 'Stage a quick robbery with minimal witnesses.',
      difficulty: 4,
      energyCost: 18,
      recommendedStats: { cunning: 8, strength: 7 },
      baseRewardCash: 260,
      baseRewardStreetCred: 10,
      baseHeatGain: 6,
      failurePenalty: { cashLoss: 80, heatGain: 8 },
    },
  ];

  for (const crime of crimes) {
    await prisma.crimeTemplate.upsert({
      where: { name: crime.name },
      update: crime,
      create: crime,
    });
  }

  const enemies = [
    {
      name: 'Street Thug',
      level: 1,
      maxHealth: 60,
      baseDps: 5,
      cashReward: 80,
      xpReward: 35,
      dropRate: 0.05,
    },
    {
      name: 'Rival Enforcer',
      level: 3,
      maxHealth: 120,
      baseDps: 10,
      cashReward: 150,
      xpReward: 70,
      dropRate: 0.08,
    },
  ];

  for (const enemy of enemies) {
    await prisma.enemy.upsert({
      where: { name: enemy.name },
      update: enemy,
      create: enemy,
    });
  }

  const properties = [
    {
      name: 'Back Alley Bar',
      type: 'front',
      basePurchaseCost: 500,
      baseIncomePerMinute: 30,
      baseStreetCredPerMinute: 1,
      baseHeatPerMinute: 1,
      unlockLevel: 1,
      unlockStreetCred: 0,
    },
    {
      name: 'Cyber Chop Shop',
      type: 'illegal',
      basePurchaseCost: 1500,
      baseIncomePerMinute: 90,
      baseStreetCredPerMinute: 4,
      baseHeatPerMinute: 3,
      unlockLevel: 4,
      unlockStreetCred: 25,
    },
  ];

  for (const property of properties) {
    await prisma.propertyTemplate.upsert({
      where: { name: property.name },
      update: property,
      create: property,
    });
  }

  const passwordHash = await bcrypt.hash('changeme', 10);
  await prisma.user.upsert({
    where: { email: 'demo@crime.com' },
    update: {},
    create: {
      username: 'demo',
      email: 'demo@crime.com',
      passwordHash,
      boss: {
        create: {
          name: 'Demo Boss',
          cash: 700,
          streetCred: 10,
          strength: 6,
          cunning: 6,
          charisma: 5,
          tech: 5,
        },
      },
    },
  });
}

main()
  .then(() => console.log('Seeded data.'))
  .catch((e) => console.error(e))
  .finally(async () => prisma.$disconnect());
