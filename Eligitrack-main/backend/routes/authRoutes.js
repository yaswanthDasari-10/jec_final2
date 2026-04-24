const express = require("express");
const { signup, login } = require("../Controllers/authController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
// Only logged-in users
router.get("/profile", protect, (req, res) => {
    const user = req.user?.toObject ? req.user.toObject() : req.user;
    // Avoid leaking password hash to the client.
    if (user && user.password) delete user.password;

    res.json({
        message: "Profile accessed",
        user
    });
});
// Admin-only route
router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {

    res.json({ message: "Welcome Admin 🔥" });
});
module.exports = router;