const express = require('express');
const Wardrobe = require('../models/Wardrobe');
const router = express.Router();


router.post('/', async (req, res) => {
  try {
    const wardrobe = new Wardrobe({ ...req.body});
    await wardrobe.save();
    res.status(201).json(wardrobe);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/:_id', async (req, res) => {
  try {
    const wardrobe = await Wardrobe.findOne({ _id: req.params._id });
    if (!wardrobe) return res.status(404).json({ error: 'Wardrobe not found' });
    res.json(wardrobe);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/user/:user_id', async (req, res) => {
  try {
    const wardrobe = await Wardrobe.findOne({ user_id: req.params.user_id });
    if (!wardrobe) return res.status(404).json({ error: 'Wardrobe not found' });
    res.json(wardrobe);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:_id', async (req, res) => {
  try {
    const wardrobe = await Wardrobe.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    if (!wardrobe) return res.status(404).json({ error: 'Wardrobe not found' });
    res.json(wardrobe);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:_id', async (req, res) => {
  try {
    const wardrobe = await Wardrobe.findOneAndDelete({ _id: req.params._id });
    if (!wardrobe) return res.status(404).json({ error: 'Wardrobe not found' });
    res.json({ message: 'Wardrobe deleted' });
  } catch (err) { res.status(400).json({ error: err.message }); }
});


router.put('/add-item/:user_id', async (req, res) => {
  const { item_id } = req.body;

  if (!item_id) return res.status(400).json({ error: 'item_id is required' });

  try {
    const wardrobe = await Wardrobe.findOneAndUpdate(
      { user_id: req.params.user_id },
      { $addToSet: { item_id: item_id } }, // tránh trùng lặp
      { new: true, upsert: true } // upsert tạo mới nếu chưa tồn tại
    );

    res.json(wardrobe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// PUT /api/wardrobes/:user_id/remove-item
router.put('/remove-item/:user_id', async (req, res) => {
  const { item_id } = req.body;

  if (!item_id) return res.status(400).json({ error: 'item_id is required' });

  try {
    const wardrobe = await Wardrobe.findOneAndUpdate(
      { user_id: req.params.user_id },
      { $pull: { item_id: item_id } },
      { new: true }
    );

    if (!wardrobe) return res.status(404).json({ error: 'Wardrobe not found' });

    res.json(wardrobe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;