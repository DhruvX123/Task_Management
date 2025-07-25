const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/userControllers");
const { verifyAccessToken, authorizeRoles } = require("../middlewares.js");

// Routes beginning with /api/users
router.get("/", verifyAccessToken, authorizeRoles('admin'), getUsers);
router.get("/:userId", verifyAccessToken, authorizeRoles('admin'), getUser);
router.post("/", verifyAccessToken, authorizeRoles('admin'), createUser);
router.put("/:userId", verifyAccessToken, authorizeRoles('admin'), updateUser);
router.delete("/:userId", verifyAccessToken, authorizeRoles('admin'), deleteUser);

module.exports = router;
