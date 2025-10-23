/**
 * Fetch.ai Client for Frontend
 * Handles communication with Fetch.ai backend services
 */

export class FetchAIClient {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5004';
    this.initialized = false;
    this.agents = [];
    this.analysisHistory = [];
  }

  /**
   * Initialize Fetch.ai agents
   */
  async initializeAgents() {
    console.log('🤖 Initializing Fetch.ai agents from frontend...');
    try {
      const response = await fetch(`${this.baseURL}/api/fetchai/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initialize agents');
      }

      const data = await response.json();
      this.initialized = true;
      this.agents = data.data.agents || [];
      console.log('✅ Fetch.ai agents initialized successfully:', this.agents);
      return data;
    } catch (error) {
      console.error('❌ Error initializing Fetch.ai agents:', error);
      throw error;
    }
  }

  /**
   * Analyze a prediction using Fetch.ai agents
   */
  async analyzePrediction(predictionData) {
    console.log('🔍 Starting Fetch.ai prediction analysis...');
    try {
      const response = await fetch(`${this.baseURL}/api/fetchai/analyze-prediction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ predictionData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze prediction');
      }

      const data = await response.json();
      
      // Store in analysis history
      this.analysisHistory.push({
        id: data.analysisId,
        prediction: predictionData,
        analysis: data.analysis,
        timestamp: new Date(),
        responseTime: data.responseTime
      });

      console.log('✅ Prediction analysis completed:', data);
      return data;
    } catch (error) {
      console.error('❌ Error analyzing prediction:', error);
      throw error;
    }
  }

  /**
   * Get agent health status
   */
  async getAgentHealth() {
    try {
      const response = await fetch(`${this.baseURL}/api/fetchai/health`);
      
      if (!response.ok) {
        throw new Error('Failed to get agent health');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('❌ Error getting agent health:', error);
      throw error;
    }
  }

  /**
   * Get agent statistics
   */
  async getAgentStats() {
    try {
      const response = await fetch(`${this.baseURL}/api/fetchai/stats`);
      
      if (!response.ok) {
        throw new Error('Failed to get agent stats');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('❌ Error getting agent stats:', error);
      throw error;
    }
  }

  /**
   * Get analysis history
   */
  async getAnalysisHistory() {
    try {
      const response = await fetch(`${this.baseURL}/api/fetchai/analysis-history`);
      
      if (!response.ok) {
        throw new Error('Failed to get analysis history');
      }

      const data = await response.json();
      this.analysisHistory = data.data;
      return data.data;
    } catch (error) {
      console.error('❌ Error getting analysis history:', error);
      throw error;
    }
  }

  /**
   * Get agent performance
   */
  async getAgentPerformance(agentId) {
    try {
      const response = await fetch(`${this.baseURL}/api/fetchai/agent-performance/${agentId}`);
      
      if (!response.ok) {
        throw new Error('Failed to get agent performance');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('❌ Error getting agent performance:', error);
      throw error;
    }
  }

  /**
   * Deploy a specific agent
   */
  async deployAgent(taskType, taskData) {
    try {
      const response = await fetch(`${this.baseURL}/api/fetchai/deploy-agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskType, taskData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to deploy agent');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Error deploying agent:', error);
      throw error;
    }
  }

  /**
   * Get analysis quality rating
   */
  getAnalysisQuality(analysis) {
    if (!analysis || typeof analysis !== 'object') {
      return 'poor';
    }
    
    const score = analysis.credibilityScore || 0;
    
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'fair';
    return 'poor';
  }

  /**
   * Get quality color for UI
   */
  getQualityColor(quality) {
    switch (quality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  /**
   * Get quality background color for UI
   */
  getQualityBgColor(quality) {
    switch (quality) {
      case 'excellent': return 'bg-green-100';
      case 'good': return 'bg-blue-100';
      case 'fair': return 'bg-yellow-100';
      case 'poor': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  }

  /**
   * Format analysis summary for display
   */
  formatAnalysisSummary(analysis) {
    const quality = this.getAnalysisQuality(analysis);
    const credibilityScore = analysis.credibilityScore || 0;
    const confidence = analysis.overallConfidence || 0;
    
    return {
      quality,
      credibilityScore,
      confidence,
      summary: analysis.summary || 'No summary available',
      recommendations: analysis.recommendations || [],
      agentResults: analysis.agentResults || []
    };
  }

  /**
   * Check if client is initialized
   */
  isInitialized() {
    return this.initialized;
  }

  /**
   * Get available agents
   */
  getAgents() {
    return this.agents || [];
  }

  /**
   * Get analysis history
   */
  getHistory() {
    return this.analysisHistory || [];
  }

  /**
   * Clear analysis history
   */
  clearHistory() {
    this.analysisHistory = [];
  }
}

// Create singleton instance
const fetchaiClient = new FetchAIClient();

export default fetchaiClient;
