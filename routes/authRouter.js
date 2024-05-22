// routes/auth.js

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { registerValidation, loginValidation } = require("../middleware/authValidation");
const { authenticate, authorize} = require("../middleware/authMiddleware");

router.post("/register", registerValidation, async (req, res) => {
 
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

 
  const user = new User({
    username: req.body.username,
    password: hashedPassword,
    role: req.body.role || "user"
  });

  try {
    const savedUser = await user.save();
    res.json({ savedUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.post("/login", loginValidation, async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).json({ message: "Username not found" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.header("Authorization", token).json({ token });
});



router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin-only route example
router.delete("/user/:id", authenticate, authorize(['admin']), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
