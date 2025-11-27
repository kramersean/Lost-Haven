import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { getBossForUser } from '../services/bossService';

export async function register(req: Request, res: Response) {
  try {
    const { username, email, password, bossName } = req.body;
    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        boss: { create: { name: bossName || `${username}'s Boss` } },
      },
    });
    const token = jwt.sign({ userId: user.id }, env.jwtSecret, { expiresIn: '7d' });
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Registration failed' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id }, env.jwtSecret, { expiresIn: '7d' });
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Login failed' });
  }
}

export async function me(req: Request, res: Response) {
  try {
    const userId = (req as any).userId as number;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, username: true, email: true } });
    const boss = await getBossForUser(userId);
    return res.json({ user, boss });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch profile' });
  }
}
