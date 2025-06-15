const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

const generateId = () => Math.random().toString(36).substr(2, 9);

router.post('/', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      email,
    });
    await user.save();
    res.status(201).json(user);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/:_id', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params._id }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:_id', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const update = { username, email };
    if (password) update.password = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { _id: req.params._id },
      update,
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:_id', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params._id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;