import jwt from 'jsonwebtoken';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  //console.log(token)
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is a customer
const isCustomer = (req, res, next) => {

  if (req.user.role !== 'customer') {
    return res.status(403).json({ message: 'Access denied. Customer only.' });
  }

  next();
};

// Middleware to check if user is staff
const isStaff = (req, res, next) => {
  if (req.user.role !== 'staff') {
    return res.status(403).json({ message: 'Access denied. Staff only.' });
  }
  next();
};

// Middleware to check if user has valid role
const hasValidRole = (req, res, next) => {
  if (!['customer', 'staff'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Invalid role' });
  }
  next();
};

export { verifyToken, isCustomer, isStaff, hasValidRole };