import { prisma } from '../config/prisma';

export async function listItems() {
  return prisma.item.findMany();
}

export async function getInventory(userId: number) {
  return prisma.inventoryItem.findMany({
    where: { userId },
    include: { item: true },
  });
}

export async function buyItem(userId: number, itemId: number) {
  const item = await prisma.item.findUnique({ where: { id: itemId } });
  const boss = await prisma.boss.findUnique({ where: { userId } });
  if (!item || !boss) throw new Error('Missing item or boss');
  if (boss.cash < item.buyPrice) throw new Error('Not enough cash');

  const inventory = await prisma.inventoryItem.upsert({
    where: { userId_itemId: { userId, itemId } },
    update: { quantity: { increment: 1 } },
    create: { userId, itemId, quantity: 1 },
  });

  await prisma.boss.update({ where: { id: boss.id }, data: { cash: boss.cash - item.buyPrice } });
  return inventory;
}

export async function sellItem(userId: number, itemId: number) {
  const inv = await prisma.inventoryItem.findUnique({ where: { userId_itemId: { userId, itemId } }, include: { item: true } });
  const boss = await prisma.boss.findUnique({ where: { userId } });
  if (!inv || !boss) throw new Error('Missing item in inventory');

  if (inv.quantity <= 1) {
    await prisma.inventoryItem.delete({ where: { id: inv.id } });
  } else {
    await prisma.inventoryItem.update({ where: { id: inv.id }, data: { quantity: { decrement: 1 } } });
  }

  await prisma.boss.update({ where: { id: boss.id }, data: { cash: boss.cash + inv.item.sellPrice } });
  return { sellPrice: inv.item.sellPrice };
}

export async function equipItem(userId: number, itemId: number, slot: 'weapon' | 'armor' | 'accessoryOne' | 'accessoryTwo') {
  const item = await prisma.item.findUnique({ where: { id: itemId } });
  const boss = await prisma.boss.findUnique({ where: { userId } });
  if (!item || !boss) throw new Error('Missing item or boss');
  if (boss.level < item.levelRequirement) throw new Error('Level too low');

  const data: Record<string, number | null> = { weaponId: null, armorId: null, accessoryOneId: null, accessoryTwoId: null };
  data[`${slot}Id`] = itemId;

  return prisma.boss.update({ where: { id: boss.id }, data });
}

export async function unequip(userId: number, slot: 'weaponId' | 'armorId' | 'accessoryOneId' | 'accessoryTwoId') {
  const boss = await prisma.boss.findUnique({ where: { userId } });
  if (!boss) throw new Error('Boss not found');
  return prisma.boss.update({ where: { id: boss.id }, data: { [slot]: null } });
}
