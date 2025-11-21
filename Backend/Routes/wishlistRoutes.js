// routes/wishlistRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { 
  getWishlist, 
  toggleWishlist 
} = require("../controllers/wishlistController");

router.get("/", auth, getWishlist);
router.post("/toggle", auth, toggleWishlist);

module.exports = router;