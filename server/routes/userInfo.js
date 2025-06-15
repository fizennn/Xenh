const express = require('express');
const UserInfo = require('../models/UserInfo');
const router = express.Router();


router.post('/', async (req, res) => {
  try {
    const userInfo = new UserInfo({ ...req.body});
    await userInfo.save();
    res.status(201).json(userInfo);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/:_id', async (req, res) => {
  try {
    const userInfo = await UserInfo.findOne({ _id: req.params._id });
    if (!userInfo) return res.status(404).json({ error: 'UserInfo not found' });
    res.json(userInfo);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:_id', async (req, res) => {
  try {
    const userInfo = await UserInfo.findOneAndUpdate(
      { _id: req.params._id },
      req.body,
      { new: true }
    );
    if (!userInfo) return res.status(404).json({ error: 'UserInfo not found' });
    res.json(userInfo);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:_id', async (req, res) => {
  try {
    const userInfo = await UserInfo.findOneAndDelete({ _id: req.params._id });
    if (!userInfo) return res.status(404).json({ error: 'UserInfo not found' });
    res.json({ message: 'UserInfo deleted' });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;