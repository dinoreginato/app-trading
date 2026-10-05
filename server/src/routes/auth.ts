import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth';
import { logger } from '../utils/logger';

export const authRoutes = Router();

// Registro de usuario
authRoutes.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validación básica
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // En producción, guardar en base de datos
    // Por ahora, generamos un ID simulado
    const userId = `user_${Date.now()}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    // TODO: Guardar en base de datos
    logger.info(`👤 Nuevo usuario registrado: ${email}`);

    const token = generateToken(userId);

    res.json({
      success: true,
      token,
      user: {
        id: userId,
        email,
        name,
        role: 'user'
      }
    });
  } catch (error: any) {
    logger.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Login
authRoutes.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    // TODO: Verificar credenciales en base de datos
    // Por ahora, aceptamos cualquier credencial para desarrollo
    const userId = `user_${email.replace(/[^a-z0-9]/gi, '')}`;
    const token = generateToken(userId);

    logger.info(`✅ Login exitoso: ${email}`);

    res.json({
      success: true,
      token,
      user: {
        id: userId,
        email,
        name: email.split('@')[0],
        role: 'user'
      }
    });
  } catch (error: any) {
    logger.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
