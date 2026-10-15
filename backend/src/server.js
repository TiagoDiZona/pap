import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { pool } from './db.js';
import authRoutes from './routes/auth.js';

if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
  throw new Error('Define DATABASE_URL e JWT_SECRET no ficheiro .env.');
}

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origem não autorizada por CORS.'));
  },
}));
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', async (_request, response, next) => {
  try {
    await pool.query('SELECT 1');
    response.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    next(error);
  }
});
app.use('/api/auth', authRoutes);

app.use((error, _request, response, _next) => {
  console.error(error);
  if (error.message === 'Origem não autorizada por CORS.') {
    return response.status(403).json({ error: error.message });
  }
  return response.status(500).json({ error: 'Ocorreu um erro interno.' });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`API Forma disponível na porta ${port}`));