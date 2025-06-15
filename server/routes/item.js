const express = require('express');
const Item = require('../models/Item');
const router = express.Router();


router.post('/', async (req, res) => {
  try {
    const item = new Item({ ...req.body});
    await item.save();
    res.status(201).json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/:_id', async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params._id });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/user/:_id', async (req, res) => {
  try {
    const item = await Item.find({ user_id: req.params._id });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:_id', async (req, res) => {
  try {
    const item = await Item.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:_id', async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({ _id: req.params._id });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;