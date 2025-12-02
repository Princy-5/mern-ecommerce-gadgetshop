// src/utils/guestId.js
export function getOrCreateGuestId() {
  try {
    let gid = localStorage.getItem("guestId");
    if (!gid) {
      gid = `guest_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
      localStorage.setItem("guestId", gid);
    }
    return gid;
  } catch (err) {
    console.warn("guestId error", err);
    return null;
  }
}
