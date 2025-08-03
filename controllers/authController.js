import {
  createUser,
  findUserByEmailAndPassword,
} from '../models/authModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export async function signUp(req, res) {
  const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const { error } = await createUser(
     name,
     email,
     hashedPassword,
  );

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({ message: 'User created successfully' });
}

export async function login(req, res) {
  const { email, password } = req.body;

  // Step 1: Find user by email
  const { data: user, error } = await findUserByEmailAndPassword(email);

  if (error || !user) {
  return res.status(401).json({ success: false, error: 'User not found. Please sign up to continue.' });
  }

  // Step 2: Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, error: 'Invalid password' });
  }

  // Step 3: Generate JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

  // Step 4: Exclude password from response
  const { password: _, ...safeUser } = user;

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: safeUser,
  });
}
