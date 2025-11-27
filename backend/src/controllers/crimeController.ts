import { Request, Response } from 'express';
import { attemptCrime, listCrimes } from '../services/crimeService';

export async function getCrimes(_req: Request, res: Response) {
  const crimes = await listCrimes();
  return res.json(crimes);
}

export async function performCrime(req: Request, res: Response) {
  try {
    const crimeId = Number(req.body.crimeId);
    const result = await attemptCrime((req as any).userId, crimeId);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}
