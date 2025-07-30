const jwt = require('jsonwebtoken');
const  User  = require('../Models/user');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};


const authorize = (...roles) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findByPk(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized: User not found' });
      }

      req.user = {
        id: user.id,
        role: user.role
      };

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token', error: error.message });
    }
  };
};
module.exports = { authenticate, authorize };