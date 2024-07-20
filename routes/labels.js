const express = require("express");
const router = express.Router();
const {
  createLabel,
  getLabel,
  getLabels,
  getLabelsRefernces,
  updateLabel,
  deleteLabel,
} = require("../controls/labels");
const { verifyToken } = require("../middlewares/checkAuth.js");

router.post("/", verifyToken, createLabel);
router.get("/", verifyToken, getLabels);
router.get("/references", verifyToken, getLabelsRefernces);
router.get("/:id", verifyToken, getLabel);
router.put("/:id", verifyToken, updateLabel);
router.delete("/:id", verifyToken, deleteLabel);

module.exports = router;
