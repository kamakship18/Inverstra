const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use environment variable or fallback to new MongoDB Atlas
    const mongoURI = process.env.MONGODB_URI;
    
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  MONGODB_URI not set, using fallback:', mongoURI);
    }
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('💡 Tip: Make sure MongoDB is running locally or set MONGODB_URI environment variable');
    console.log('💡 For local development: brew install mongodb-community && brew services start mongodb-community');
    // Don't exit process, just log the error so the server can still run for DAO functionality
    console.log('⚠️  Server will continue without MongoDB (DAO functionality will work)');
  }
};

module.exports = connectDB;
