const express = require('express');
const router = express.Router();
const WebScrapingService = require('../services/webScrapingService');

const webScrapingService = new WebScrapingService();

/**
 * GET /api/scraping/yahoo/:symbol
 * Scrape Yahoo Finance for specific stock symbol
 */
router.get('/yahoo/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Stock symbol is required'
      });
    }

    const result = await webScrapingService.scrapeYahooFinance(symbol.toUpperCase());
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        source: result.source,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to scrape Yahoo Finance',
        error: result.error
      });
    }

  } catch (error) {
    console.error('Yahoo Finance route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

/**
 * GET /api/scraping/marketwatch/:symbol
 * Scrape MarketWatch for specific stock symbol
 */
router.get('/marketwatch/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Stock symbol is required'
      });
    }

    const result = await webScrapingService.scrapeMarketWatch(symbol.toUpperCase());
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        source: result.source,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to scrape MarketWatch',
        error: result.error
      });
    }

  } catch (error) {
    console.error('MarketWatch route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

/**
 * GET /api/scraping/crypto/:symbol
 * Scrape CoinMarketCap for specific crypto symbol
 */
router.get('/crypto/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Crypto symbol is required'
      });
    }

    const result = await webScrapingService.scrapeCryptoData(symbol.toLowerCase());
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        source: result.source,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to scrape crypto data',
        error: result.error
      });
    }

  } catch (error) {
    console.error('Crypto scraping route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

/**
 * GET /api/scraping/news
 * Scrape financial news from MarketWatch
 */
router.get('/news', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const result = await webScrapingService.scrapeFinancialNews(parseInt(limit));
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        source: result.source,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to scrape financial news',
        error: result.error
      });
    }

  } catch (error) {
    console.error('News scraping route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

/**
 * GET /api/scraping/comprehensive/:symbol
 * Get comprehensive financial data from multiple sources
 */
router.get('/comprehensive/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { type = 'stock' } = req.query;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Symbol is required'
      });
    }

    const result = await webScrapingService.getComprehensiveData(symbol.toUpperCase(), type);
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to get comprehensive data',
        error: result.error
      });
    }

  } catch (error) {
    console.error('Comprehensive data route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

/**
 * GET /api/scraping/health
 * Health check endpoint for web scraping service
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Web scraping service is healthy',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/scraping/yahoo/:symbol',
      'GET /api/scraping/marketwatch/:symbol',
      'GET /api/scraping/crypto/:symbol',
      'GET /api/scraping/news',
      'GET /api/scraping/comprehensive/:symbol'
    ]
  });
});

module.exports = router;
