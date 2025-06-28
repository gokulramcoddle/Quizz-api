import {
  createUser,
  findUserByEmailAndPassword,
} from '../models/authModel.js';
import jwt from 'jsonwebtoken';


export async function signUp(req, res) {
  const { name, email, password } = req.body;
  const { error } = await createUser(name, email, password);
  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({ message: 'User created successfully' });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const { data, error } = await findUserByEmailAndPassword(email, password);
  if (error || !data) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }

  const user = data;

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

  // Send token along with user
  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user
  });
}
