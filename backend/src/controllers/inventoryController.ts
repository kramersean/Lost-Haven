import { Request, Response } from 'express';
import { buyItem, equipItem, getInventory, listItems, sellItem, unequip } from '../services/inventoryService';

export async function getItems(_req: Request, res: Response) {
  const items = await listItems();
  return res.json(items);
}

export async function getInventoryForUser(req: Request, res: Response) {
  const inventory = await getInventory((req as any).userId);
  return res.json(inventory);
}

export async function buy(req: Request, res: Response) {
  try {
    const result = await buyItem((req as any).userId, Number(req.body.itemId));
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

export async function sell(req: Request, res: Response) {
  try {
    const result = await sellItem((req as any).userId, Number(req.body.itemId));
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

export async function equip(req: Request, res: Response) {
  try {
    const { itemId, slot } = req.body;
    const result = await equipItem((req as any).userId, Number(itemId), slot);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

export async function unequipSlot(req: Request, res: Response) {
  try {
    const { slot } = req.body;
    const result = await unequip((req as any).userId, slot);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}
