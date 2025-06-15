const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://fizennn:123451211@xenh.u88dujz.mongodb.net/?retryWrites=true&w=majority&appName=Xenh', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false, // Disable autoIndex for production
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;