import { Request, Response } from 'express';
import { buyProperty, collectIncome, getOwnerships, listProperties, upgradeProperty } from '../services/propertyService';

export async function listPropertyTemplates(_req: Request, res: Response) {
  const properties = await listProperties();
  return res.json(properties);
}

export async function listOwned(req: Request, res: Response) {
  const ownerships = await getOwnerships((req as any).userId);
  return res.json(ownerships);
}

export async function buy(req: Request, res: Response) {
  try {
    const ownership = await buyProperty((req as any).userId, Number(req.body.propertyId));
    return res.json(ownership);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

export async function collect(req: Request, res: Response) {
  try {
    const result = await collectIncome((req as any).userId, Number(req.body.ownershipId));
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

export async function upgrade(req: Request, res: Response) {
  try {
    const result = await upgradeProperty((req as any).userId, Number(req.body.ownershipId));
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}
