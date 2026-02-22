const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

/* GET MY PROFILE */
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

/* UPDATE PROFILE */
router.put(
  "/me",
  auth,
  upload.single("profileImage"),
  async (req, res) => {
    const { bio, name } = req.body;

    const user = await User.findById(req.user.id);

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      user.profileImage = result.secure_url;
    }

    if (bio !== undefined) user.bio = bio;
    if (name !== undefined) user.name = name;

    await user.save();
    res.json(user);
  }
);

module.exports = router;
