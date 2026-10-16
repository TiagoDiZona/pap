import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createToken(user) {
  return jwt.sign(
    { role: user.role },
    process.env.JWT_SECRET,
    { subject: String(user.id), expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
  );
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

router.post('/users', authenticateToken, authorizeRoles('admin'), asyncHandler(async (request, response) => {
  const { name, email, password, role } = request.body ?? {};
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 120) {
    return response.status(400).json({ error: 'O nome deve ter entre 2 e 120 caracteres.' });
  }
  if (!emailPattern.test(normalizedEmail) || normalizedEmail.length > 254) {
    return response.status(400).json({ error: 'Indique um endereço de email válido.' });
  }
  if (typeof password !== 'string' || password.length < 10 || password.length > 72) {
    return response.status(400).json({ error: 'A palavra-passe deve ter entre 10 e 72 caracteres.' });
  }
  if (!['manager', 'employee'].includes(role)) {
    return response.status(400).json({ error: 'O perfil deve ser gestor ou funcionário.' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name.trim(), normalizedEmail, passwordHash, role],
    );
    const user = result.rows[0];
    return response.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if (error.code === '23505') {
      return response.status(409).json({ error: 'Já existe uma conta com esse email.' });
    }
    throw error;
  }
}));

router.post('/login', asyncHandler(async (request, response) => {
  const { email, password } = request.body ?? {};
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!emailPattern.test(normalizedEmail) || typeof password !== 'string') {
    return response.status(400).json({ error: 'Email ou palavra-passe inválidos.' });
  }

  const result = await pool.query(
    'SELECT id, name, email, password_hash, role FROM users WHERE email = $1',
    [normalizedEmail],
  );
  const user = result.rows[0];
  const passwordMatches = user ? await bcrypt.compare(password, user.password_hash) : false;
  if (!passwordMatches) {
    return response.status(401).json({ error: 'Email ou palavra-passe inválidos.' });
  }

  return response.json({ user: publicUser(user), token: createToken(user) });
}));

export default router;