const { body, validationResult } = require("express-validator");

const validateRegister = [
  body("firstName")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("First name must be between 3 and 20 characters"),
  body("lastName")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Last name must be between 3 and 20 characters"),
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  body("phoneNumber")
    .trim()
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be exactly 10 digits")
    .isNumeric()
    .withMessage("Phone number must contain only numbers"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const validateLogin = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").exists().withMessage("Password is required"),
];

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: "Validation failed", 
      errors: errors.array() 
    });
  }
  next();
};

module.exports = { validateLogin, validateRegister, checkValidation };