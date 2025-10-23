/**
 * Fetch.ai Integration Test Script
 * This script tests the Fetch.ai integration to ensure everything is working correctly
 */

const axios = require('axios');

class FetchAITest {
  constructor() {
    this.baseURL = 'http://localhost:5004';
    this.testResults = [];
  }

  /**
   * Run all tests
   */
  async runTests() {
    console.log('🧪 Starting Fetch.ai Integration Tests...\n');

    try {
      await this.testServerConnection();
      await this.testAgentInitialization();
      await this.testAgentListing();
      await this.testPredictionAnalysis();
      await this.testHealthCheck();
      await this.testMetrics();
      await this.testStats();
      
      this.printResults();
    } catch (error) {
      console.error('❌ Test suite failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Test server connection
   */
  async testServerConnection() {
    console.log('🔌 Testing server connection...');
    
    try {
      const response = await axios.get(`${this.baseURL}/api/health`);
      this.addTestResult('Server Connection', true, 'Server is running');
    } catch (error) {
      this.addTestResult('Server Connection', false, `Server not accessible: ${error.message}`);
    }
  }

  /**
   * Test agent initialization
   */
  async testAgentInitialization() {
    console.log('🤖 Testing agent initialization...');
    
    try {
      const response = await axios.post(`${this.baseURL}/api/fetchai/initialize`);
      
      if (response.data.success) {
        this.addTestResult('Agent Initialization', true, `Initialized ${response.data.agents?.length || 0} agents`);
      } else {
        this.addTestResult('Agent Initialization', false, response.data.error || 'Initialization failed');
      }
    } catch (error) {
      this.addTestResult('Agent Initialization', false, `Initialization error: ${error.message}`);
    }
  }

  /**
   * Test agent listing
   */
  async testAgentListing() {
    console.log('📋 Testing agent listing...');
    
    try {
      const response = await axios.get(`${this.baseURL}/api/fetchai/agents`);
      
      if (response.data.success && response.data.data.length > 0) {
        this.addTestResult('Agent Listing', true, `Found ${response.data.data.length} agents`);
      } else {
        this.addTestResult('Agent Listing', false, 'No agents found');
      }
    } catch (error) {
      this.addTestResult('Agent Listing', false, `Listing error: ${error.message}`);
    }
  }

  /**
   * Test prediction analysis
   */
  async testPredictionAnalysis() {
    console.log('🔍 Testing prediction analysis...');
    
    const testPrediction = {
      title: 'Test Prediction: Bitcoin will reach $100k',
      description: 'This is a test prediction for Fetch.ai integration testing',
      category: 'crypto',
      creator: '0x1234567890123456789012345678901234567890',
      createdAt: new Date().toISOString()
    };

    try {
      const response = await axios.post(`${this.baseURL}/api/fetchai/analyze-prediction`, {
        predictionData: testPrediction
      });
      
      if (response.data.success && response.data.data.analysis) {
        const analysis = response.data.data.analysis;
        this.addTestResult('Prediction Analysis', true, 
          `Analysis completed in ${response.data.data.responseTime}ms with ${response.data.data.agentsUsed} agents`);
      } else {
        this.addTestResult('Prediction Analysis', false, response.data.error || 'Analysis failed');
      }
    } catch (error) {
      this.addTestResult('Prediction Analysis', false, `Analysis error: ${error.message}`);
    }
  }

  /**
   * Test health check
   */
  async testHealthCheck() {
    console.log('❤️  Testing health check...');
    
    try {
      const response = await axios.get(`${this.baseURL}/api/fetchai/health`);
      
      if (response.data.success) {
        const health = response.data.data;
        this.addTestResult('Health Check', true, 
          `System health: ${health.overall}, ${Object.keys(health.agents || {}).length} agents monitored`);
      } else {
        this.addTestResult('Health Check', false, 'Health check failed');
      }
    } catch (error) {
      this.addTestResult('Health Check', false, `Health check error: ${error.message}`);
    }
  }

  /**
   * Test metrics
   */
  async testMetrics() {
    console.log('📊 Testing metrics...');
    
    try {
      const response = await axios.get(`${this.baseURL}/api/fetchai/metrics`);
      
      if (response.data.success) {
        const metrics = response.data.data;
        const agentCount = Object.keys(metrics).length;
        this.addTestResult('Metrics', true, `Metrics available for ${agentCount} agents`);
      } else {
        this.addTestResult('Metrics', false, 'Metrics not available');
      }
    } catch (error) {
      this.addTestResult('Metrics', false, `Metrics error: ${error.message}`);
    }
  }

  /**
   * Test statistics
   */
  async testStats() {
    console.log('📈 Testing statistics...');
    
    try {
      const response = await axios.get(`${this.baseURL}/api/fetchai/stats`);
      
      if (response.data.success) {
        const stats = response.data.data;
        this.addTestResult('Statistics', true, 
          `${stats.totalAgents} agents, ${stats.completedTasks} tasks completed, ${stats.totalRewards} tokens distributed`);
      } else {
        this.addTestResult('Statistics', false, 'Statistics not available');
      }
    } catch (error) {
      this.addTestResult('Statistics', false, `Statistics error: ${error.message}`);
    }
  }

  /**
   * Add test result
   */
  addTestResult(testName, passed, message) {
    this.testResults.push({
      test: testName,
      passed,
      message
    });
    
    const status = passed ? '✅' : '❌';
    console.log(`  ${status} ${testName}: ${message}`);
  }

  /**
   * Print test results summary
   */
  printResults() {
    console.log('\n📋 Test Results Summary:');
    console.log('='.repeat(50));
    
    const passed = this.testResults.filter(r => r.passed).length;
    const total = this.testResults.length;
    
    this.testResults.forEach(result => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${result.test}`);
      if (!result.passed) {
        console.log(`    ${result.message}`);
      }
    });
    
    console.log('='.repeat(50));
    console.log(`Total: ${passed}/${total} tests passed`);
    
    if (passed === total) {
      console.log('🎉 All tests passed! Fetch.ai integration is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Please check the errors above.');
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new FetchAITest();
  tester.runTests().catch(console.error);
}

module.exports = FetchAITest;
