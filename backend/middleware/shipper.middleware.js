
const shipperMiddleware = async (req, res, next) => {
  
    if (!req.user || req.user.isDriver) {
      return res.status(403).json({ message: 'Access denied. shipper permission required.' });
    }
    next();
  
};

module.exports = shipperMiddleware;