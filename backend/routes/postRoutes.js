const express = require("express");
const Post = require("../models/post");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

/* CREATE POST */
router.post(
  "/",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      let mediaUrl = "";
      let mediaType = "";

      if (req.file) {
        const isVideo = req.file.mimetype.startsWith("video/");

        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: isVideo ? "video" : "image",
          folder: "petconnect"
        });

        mediaUrl = result.secure_url;
        mediaType = isVideo ? "video" : "image";
      }

      const post = await Post.create({
        user: user._id,
        petName: user.name,
        text: req.body.text,
        image: mediaUrl,
        mediaType: mediaType
      });

      res.status(201).json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Post creation failed" });
    }
  }
);

/* GET FEED */
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "name bio profileImage")
      .populate("comments.user", "name profileImage");

    res.json(posts);
  } catch {
    res.status(500).json({ message: "Failed to load feed" });
  }
});

/* ADD COMMENT */
router.post("/:id/comment", auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: req.user.id, text: text.trim() });
    await post.save();

    const updated = await Post.findById(req.params.id)
      .populate("user", "name bio profileImage")
      .populate("comments.user", "name profileImage");

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add comment" });
  }
});

/* LIKE / UNLIKE */
router.post("/:id/like", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  const userId = req.user.id;

  if (post.likes.includes(userId)) {
    post.likes = post.likes.filter(id => id.toString() !== userId);
  } else {
    post.likes.push(userId);
  }

  await post.save();
  res.json(post);
});

/* DELETE POST */
router.delete("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json({ message: "Post not found" });

  if (post.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await post.deleteOne();
  res.json({ message: "Post deleted" });
});

module.exports = router;