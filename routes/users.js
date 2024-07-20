const express = require("express");
const router = express.Router();
const {
  setUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  getClients,
} = require("../controls/users");
const { verifyToken } = require("../middlewares/checkAuth.js");

router.post("/", verifyToken,setUser);
router.get("/", verifyToken, getUsers);
router.get("/clients", verifyToken, getClients);
router.get("/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);

module.exports = router;
