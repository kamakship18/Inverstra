const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const fetchaiService = require('../services/fetchaiService');

// Initialize agents
router.post('/initialize', async (req, res) => {
  try {
    const result = await fetchaiService.initializeAgents();
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error initializing Fetch.ai agents:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analyze prediction
router.post('/analyze-prediction', async (req, res) => {
  try {
    const { predictionData } = req.body;
    
    if (!predictionData) {
      return res.status(400).json({
        success: false,
        error: 'Prediction data is required'
      });
    }

    const result = await fetchaiService.analyzePrediction(predictionData);
    res.json(result);
  } catch (error) {
    console.error('Error analyzing prediction:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get agent health
router.get('/health', async (req, res) => {
  try {
    const health = fetchaiService.getAgentHealth();
    res.json({ success: true, data: health });
  } catch (error) {
    console.error('Error getting agent health:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get agent statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = fetchaiService.getAgentStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error getting agent stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Deploy specific agent
router.post('/deploy-agent', async (req, res) => {
  try {
    const { taskType, taskData } = req.body;
    let result;
    switch (taskType) {
      case 'prediction-analysis':
        result = await fetchaiService.deployPredictionAnalyzer(taskData, crypto.randomUUID());
        break;
      case 'market-data-collection':
        result = await fetchaiService.deployMarketDataCollector(taskData, crypto.randomUUID());
        break;
      case 'risk-assessment':
        result = await fetchaiService.deployRiskAssessmentAgent(taskData, crypto.randomUUID());
        break;
      case 'news-aggregation':
        result = await fetchaiService.deployNewsAggregator(taskData, crypto.randomUUID());
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid task type'
        });
    }
    res.json({ success: true, message: `${taskType} agent deployed`, data: result });
  } catch (error) {
    console.error(`Error deploying ${taskType} agent:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get analysis history
router.get('/analysis-history', async (req, res) => {
  try {
    const history = fetchaiService.analysisHistory;
    res.json({ success: true, data: history });
  } catch (error) {
    console.error('Error getting analysis history:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get agent performance
router.get('/agent-performance/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const agent = fetchaiService.agents.get(agentId);
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }

    const metrics = fetchaiService.agentMetrics.get(agentId);
    res.json({ 
      success: true, 
      data: {
        agent,
        metrics
      }
    });
  } catch (error) {
    console.error('Error getting agent performance:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
