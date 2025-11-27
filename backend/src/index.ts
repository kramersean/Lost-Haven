import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import bossRoutes from './routes/bossRoutes';
import crimeRoutes from './routes/crimeRoutes';
import combatRoutes from './routes/combatRoutes';
import propertyRoutes from './routes/propertyRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import { env } from './config/env';

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/boss', bossRoutes);
app.use('/api/crimes', crimeRoutes);
app.use('/api/combat', combatRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/inventory', inventoryRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error' });
});

app.listen(env.port, () => {
  console.log(`API server running on port ${env.port}`);
});
