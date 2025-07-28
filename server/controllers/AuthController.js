import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const { sign } = jwt;


const registerWithEmailAndPassword =   async (req, res) => {
  const { username, password, role, email } = req.body; 

  if (!username || !password || !role || !email) { 
    return res.status(400).json({ message: 'All fields are required.' });
  }


  const emailRegex = /.+\@.+\..+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  // Validate username length
  if (username.length < 3 || username.length > 30) {
    return res.status(400).json({ 
      message: 'Username must be between 3 and 30 characters.' 
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ 
      message: 'Password must be at least 6 characters long.' 
    });
  }

  if (!['customer', 'staff'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role.' });
  }

  try {
   
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      return res.status(409).json({ 
        message: existingUser.username === username 
          ? 'Username already exists.' 
          : 'Email already exists.'
      });
    }

    const hashedPassword = await hash(password, 10);
    const newUser = new User({ 
      username, 
      password: hashedPassword, 
      role,
      email 
    });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}


const loginWithEmailAndPassword = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Find user by email and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = sign(
      { 
        userId: user._id,
        username: user.username, 
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '8h' }
    );

    res.json({ 
      token,
      user: {
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export  { registerWithEmailAndPassword, loginWithEmailAndPassword };