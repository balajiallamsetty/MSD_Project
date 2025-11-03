const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Support either raw token or "Bearer <token>" header value
  const authHeader = req.header('Authorization') || req.header('authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Extract token when header is in the form: "Bearer <token>"
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: ... }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;
