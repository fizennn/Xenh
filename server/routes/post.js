const express = require('express');
const Post = require('../models/Post');
const router = express.Router();


router.post('/', async (req, res) => {
  try {
    const post = new Post({ ...req.body });
    await post.save();
    res.status(201).json(post);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/:_id', async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params._id });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/user/:user_id', async (req, res) => {
  try {
    const post = await Post.find({ user_id: req.params.user_id });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:_id', async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/fav/:_id', async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) return res.status(400).json({ error: 'user_id is required' });

  try {
    const post = await Post.findById(req.params._id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const isFav = post.favs.includes(user_id);

    let updatedPost;
    if (isFav) {
      // Nếu đã có, thì gỡ ra
      updatedPost = await Post.findByIdAndUpdate(
        req.params._id,
        { $pull: { favs: user_id } },
        { new: true }
      );
    } else {
      // Nếu chưa có, thì thêm vào
      updatedPost = await Post.findByIdAndUpdate(
        req.params._id,
        { $addToSet: { favs: user_id } },
        { new: true }
      );
    }

    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.delete('/:_id', async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params._id });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;