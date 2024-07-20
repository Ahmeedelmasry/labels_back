const express = require("express");
const router = express.Router();
const {
  createLabel,
  getLabel,
  getLabels,
  updateLabel,
  deleteLabel,
} = require("../controls/labels");
const { verifyToken } = require("../middlewares/checkAuth.js");

router.post("/", verifyToken, createLabel);
router.get("/", verifyToken, getLabels);
router.get("/:id", verifyToken, getLabel);
router.put("/:id", verifyToken, updateLabel);
router.delete("/:id", verifyToken, deleteLabel);

module.exports = router;
