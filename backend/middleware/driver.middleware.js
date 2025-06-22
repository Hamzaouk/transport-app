
const driverMiddleware = async (req, res, next) => {
  
    if (!req.user || !req.user.isDriver) {
      return res.status(403).json({ message: 'Access denied. Driver permission required.' });
    }
    next();
  
};

module.exports = driverMiddleware;