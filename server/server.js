const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user');
const userInfoRoutes = require('./routes/userInfo');
const itemRoutes = require('./routes/item');
const wardrobeRoutes = require('./routes/wardrobe');
const postRoutes = require('./routes/post');
const savedPostRoutes = require('./routes/savedPost');
const favoriteRoutes = require('./routes/favorite');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/userinfo', userInfoRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/wardrobe', wardrobeRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/savedposts', savedPostRoutes);
app.use('/api/favorites', favoriteRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));