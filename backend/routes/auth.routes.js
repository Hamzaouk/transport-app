const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {
  validateLogin,
  validateRegister,
  checkValidation,
} = require("../middleware/validate.middleware");

router.post("/register", validateRegister, checkValidation, authController.register)
router.post("/login", validateLogin, checkValidation, authController.login)


module.exports = router

