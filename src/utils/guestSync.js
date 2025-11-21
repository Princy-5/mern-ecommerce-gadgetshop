// src/utils/guestSync.js - FIXED
import { api } from "../api";
import { getOrCreateGuestId } from "./guestId";

export async function syncGuestDataAfterLogin() {
  try {
    const guestId = localStorage.getItem("guestId");
    if (!guestId) return;

    console.log("Syncing guest data for:", guestId);

    // Sync wishlist
    try {
      const guestWishlistRes = await api.get(`/wishlist?guestId=${guestId}`);
      const guestWishlist = guestWishlistRes.data?.wishlist || [];
      
      for (const product of guestWishlist) {
        const productId = product._id || product;
        await api.post("/wishlist/toggle", { productId }).catch(err => {
          console.warn("Failed to sync wishlist item:", err.message);
        });
      }
    } catch (err) {
      console.warn("Wishlist sync failed:", err.message);
    }

    // Sync cart
    try {
      const guestCartRes = await api.get(`/cart?guestId=${guestId}`);
      const guestCartItems = guestCartRes.data?.items || [];
      
      if (guestCartItems.length > 0) {
        const cartData = guestCartItems.map(item => ({
          productId: item.productId?._id || item.productId,
          quantity: item.quantity || 1
        }));
        
        await api.post("/cart/replace", { cart: cartData });
      }
    } catch (err) {
      console.warn("Cart sync failed:", err.message);
    }

    // Clear guest data from localStorage
    localStorage.removeItem("guest_cart");
    localStorage.removeItem("guest_wishlist");
    localStorage.removeItem("guestId");
    
    console.log("Guest data sync completed");
  } catch (err) {
    console.error("syncGuestDataAfterLogin error:", err);
  }
}