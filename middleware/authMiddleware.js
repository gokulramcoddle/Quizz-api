import { verifyToken } from '../utils/jwt.js';
import { getUser } from '../controllers/userController.js';
import { findUserById } from '../models/authModel.js';

export const protect = async (req, res, next) => {
  /* 1. Extract Bearer token */
  const auth = req.headers.authorization || '';
  if (!auth.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = auth.split(' ')[1];

  try {
    /* 2. Verify signature */
    const decoded = verifyToken(token);          // { id, email, name, ... }

    /* 3. (Optional) fetch latest user data */
    const { data: user } = await findUserById(decoded.id); // select { id, name, email }
    if (!user) throw new Error('User not found');

    /* 4. Attach safe user object to request */
    req.user = { id: user.id, email: user.email, name: user.name };

    next();
  } catch (err) {
    console.error('JWT Error:', err.message);
    const msg =
      process.env.NODE_ENV === 'production'
        ? 'Invalid or expired token'
        : err.message;
    return res.status(401).json({ error: msg });
  }
};
