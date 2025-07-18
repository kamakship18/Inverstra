const express = require('express');
const router = express.Router();
const TestData = require('../models/TestData');

// GET - Retrieve all test data
router.get('/', async (req, res) => {
  try {
    const testData = await TestData.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: testData.length,
      data: testData
    });
  } catch (error) {
    console.error('Error fetching test data:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not fetch data',
      error: error.message
    });
  }
});

// POST - Create new test data
router.post('/', async (req, res) => {
  try {
    const { name, email, message, walletAddress } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message'
      });
    }
    
    const newTestData = new TestData({
      name,
      email,
      message,
      walletAddress
    });
    
    const savedData = await newTestData.save();
    
    res.status(201).json({
      success: true,
      message: 'Data saved successfully!',
      data: savedData
    });
  } catch (error) {
    console.error('Error saving test data:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not save data',
      error: error.message
    });
  }
});

// GET - Get single test data by ID
router.get('/:id', async (req, res) => {
  try {
    const testData = await TestData.findById(req.params.id);
    
    if (!testData) {
      return res.status(404).json({
        success: false,
        message: 'Data not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: testData
    });
  } catch (error) {
    console.error('Error fetching test data:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// DELETE - Delete test data by ID
router.delete('/:id', async (req, res) => {
  try {
    const testData = await TestData.findByIdAndDelete(req.params.id);
    
    if (!testData) {
      return res.status(404).json({
        success: false,
        message: 'Data not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Data deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting test data:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

module.exports = router;
