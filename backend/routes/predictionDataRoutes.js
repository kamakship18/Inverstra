const express = require('express');
const router = express.Router();
const PredictionData = require('../models/PredictionData');

// GET - Get all prediction data
router.get('/', async (req, res) => {
  try {
    const { status, category, createdBy, limit = 50, page = 1 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (category) filter['formData.category'] = category;
    if (createdBy) filter.createdBy = createdBy;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const predictions = await PredictionData.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await PredictionData.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: predictions.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: predictions
    });
  } catch (error) {
    console.error('Error fetching prediction data:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not fetch prediction data',
      error: error.message
    });
  }
});

// GET - Get prediction data by ID
router.get('/:id', async (req, res) => {
  try {
    const prediction = await PredictionData.findById(req.params.id);
    
    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction data not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: prediction
    });
  } catch (error) {
    console.error('Error fetching prediction data:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not fetch prediction data',
      error: error.message
    });
  }
});

// POST - Create new prediction data
router.post('/', async (req, res) => {
  try {
    const predictionData = new PredictionData(req.body);
    const savedPrediction = await predictionData.save();
    
    res.status(201).json({
      success: true,
      message: 'Prediction data created successfully',
      data: savedPrediction
    });
  } catch (error) {
    console.error('Error creating prediction data:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not create prediction data',
      error: error.message
    });
  }
});

// PUT - Update prediction data
router.put('/:id', async (req, res) => {
  try {
    const updatedPrediction = await PredictionData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedPrediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction data not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Prediction data updated successfully',
      data: updatedPrediction
    });
  } catch (error) {
    console.error('Error updating prediction data:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not update prediction data',
      error: error.message
    });
  }
});

// GET - Get predictions by creator
router.get('/creator/:createdBy', async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const predictions = await PredictionData.find({ createdBy: req.params.createdBy })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await PredictionData.countDocuments({ createdBy: req.params.createdBy });
    
    res.status(200).json({
      success: true,
      count: predictions.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: predictions
    });
  } catch (error) {
    console.error('Error fetching predictions by creator:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not fetch predictions',
      error: error.message
    });
  }
});

// GET - Get approved predictions (for learners to see)
router.get('/approved/live', async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const predictions = await PredictionData.find({ 
      'daoData.isApproved': true,
      status: 'approved'
    })
      .sort({ 'daoData.approvalDate': -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await PredictionData.countDocuments({ 
      'daoData.isApproved': true,
      status: 'approved'
    });
    
    res.status(200).json({
      success: true,
      count: predictions.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: predictions
    });
  } catch (error) {
    console.error('Error fetching approved predictions:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not fetch approved predictions',
      error: error.message
    });
  }
});

// POST - Update prediction status
router.post('/:id/status', async (req, res) => {
  try {
    const { status, ...updateData } = req.body;
    
    const updatedPrediction = await PredictionData.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...updateData,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!updatedPrediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction data not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Prediction status updated successfully',
      data: updatedPrediction
    });
  } catch (error) {
    console.error('Error updating prediction status:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not update prediction status',
      error: error.message
    });
  }
});

module.exports = router;
