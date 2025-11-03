const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const verifyToken = require("../middleware/verifyToken");

router.get("/", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const newPost = new Post({ ...req.body, author: req.userId });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ error: "Failed to create post", details: err.message });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.author.toString() !== req.userId) return res.status(403).json({ error: "Not your post" });

    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update post", details: err.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.author.toString() !== req.userId) return res.status(403).json({ error: "Not your post" });

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete post", details: err.message });
  }
});


module.exports = router;
