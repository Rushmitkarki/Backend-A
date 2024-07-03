const router = require("express").Router();
const userController = require("../controllers/userControllers");

// Creating user registration route
router.post("/create", userController.createUser);

// Creating user login route
router.post("/login", userController.loginUser);

// Creating user forgot password route
router.post("/forgot-password", userController.forgotPassword);

// Creating user reset password route
router.post("/reset-password", userController.resetPassword);

module.exports = router;
