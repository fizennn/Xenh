const express = require('express');
const SavedPost = require('../models/SavedPost');
const router = express.Router();

const generateId = () => Math.random().toString(36).substr(2, 9);

router.post('/', async (req, res) => {
  try {
    const savedPost = new SavedPost({ ...req.body, posts_id: generateId() });
    await savedPost.save();
    res.status(201).json(savedPost);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/:posts_id', async (req, res) => {
  try {
    const savedPost = await SavedPost.findOne({ posts_id: req.params.posts_id });
    if (!savedPost) return res.status(404).json({ error: 'SavedPost not found' });
    res.json(savedPost);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:posts_id', async (req, res) => {
  try {
    const savedPost = await SavedPost.findOneAndUpdate(
      { posts_id: req.params.posts_id },
      req.body,
      { new: true }
    );
    if (!savedPost) return res.status(404).json({ error: 'SavedPost not found' });
    res.json(savedPost);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:posts_id', async (req, res) => {
  try {
    const savedPost = await SavedPost.findOneAndDelete({ posts_id: req.params.posts_id });
    if (!savedPost) return res.status(404).json({ error: 'SavedPost not found' });
    res.json({ message: 'SavedPost deleted' });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/save/:user_id', async (req, res) => {
  const { post_id } = req.body;

  if (!post_id) {
    return res.status(400).json({ error: 'post_id is required' });
  }

  try {
    const savedPost = await SavedPost.findOneAndUpdate(
      { user_id: req.params.user_id },
      { $addToSet: { post_id } }, // tránh trùng lặp
      { new: true, upsert: true } // tạo mới nếu chưa tồn tại
    );

    res.json(savedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;