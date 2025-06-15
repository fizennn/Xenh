const express = require('express');
const Favorite = require('../models/Favorite');
const Post = require('../models/Post');
const router = express.Router();

const generateId = () => Math.random().toString(36).substr(2, 9);

router.post('/', async (req, res) => {
  try {
    const favorite = new Favorite({ ...req.body, fav_id: generateId() });
    await favorite.save();
    await Post.findOneAndUpdate(
      { post_id: req.body.post_id },
      { $inc: { favs: 1 } }
    );
    res.status(201).json(favorite);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/:fav_id', async (req, res) => {
  try {
    const favorite = await Favorite.findOne({ fav_id: req.params.fav_id });
    if (!favorite) return res.status(404).json({ error: 'Favorite not found' });
    res.json(favorite);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:fav_id', async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndUpdate(
      { fav_id: req.params.fav_id },
      req.body,
      { new: true }
    );
    if (!favorite) return res.status(404).json({ error: 'Favorite not found' });
    res.json(favorite);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:fav_id', async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({ fav_id: req.params.fav_id });
    if (!favorite) return res.status(404).json({ error: 'Favorite not found' });
    await Post.findOneAndUpdate(
      { post_id: favorite.post_id },
      { $inc: { favs: -1 } }
    );
    res.json({ message: 'Favorite deleted' });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;