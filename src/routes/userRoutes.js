const express = require("express");

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// router.route("/getallusers").get(userController.getAllUsers);

// router.route("/profile").get(authMiddleware.protectRoute, userController.getUserProfile);

router.route("/updatepassword").patch(authMiddleware.protectRoute, userController.updatePassword);

// Route for updating profile (firstname, lastname, bio)
router.route("/updateprofile").patch(authMiddleware.protectRoute, userController.updateProfile);

module.exports = router;