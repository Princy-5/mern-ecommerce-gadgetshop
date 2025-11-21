// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getCart,
  addItemToCart,
  removeItemFromCart,
  clearCart,
  replaceCart
} = require("../controllers/cartController");

// All cart routes with auth middleware
router.get("/", auth, getCart);
router.post("/add", auth, addItemToCart);
router.post("/replace", auth, replaceCart);
router.delete("/remove/:productId", auth, removeItemFromCart);
router.delete("/clear", auth, clearCart);

module.exports = router;