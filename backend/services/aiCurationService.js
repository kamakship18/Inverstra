const axios = require('axios');

class AICurationService {
  constructor() {
    this.groqApiKey = process.env.GROQ_API_KEY;
    this.perplexityApiKey = process.env.PERPLEXITY_API_KEY;
  }

  // Generate personalized market insights using GROQ AI
  async generatePersonalizedInsights(userProfile) {
    try {
      const prompt = this.buildPersonalizationPrompt(userProfile);
      
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are an expert financial advisor and market analyst. Provide personalized investment insights based on user profiles. Be concise, actionable, and specific to their risk tolerance and interests.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return this.parseAIResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating personalized insights:', error);
      return this.getFallbackInsights(userProfile);
    }
  }

  // Get real-time market news using Perplexity API
  async getMarketNews(userProfile) {
    try {
      const query = this.buildNewsQuery(userProfile);
      
      const response = await axios.post('https://api.perplexity.ai/chat/completions', {
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: 500,
        temperature: 0.2
      }, {
        headers: {
          'Authorization': `Bearer ${this.perplexityApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return this.parseNewsResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error fetching market news:', error);
      return this.getFallbackNews(userProfile);
    }
  }

  // Generate learning recommendations
  async generateLearningRecommendations(userProfile) {
    try {
      const prompt = `Based on this user profile, suggest 3-5 specific learning topics and resources:
      
      User Profile:
      - Experience Level: ${userProfile.experienceLevel}
      - Areas of Interest: ${userProfile.areasOfInterest.join(', ')}
      - Primary Goal: ${userProfile.primaryGoal}
      - Risk Tolerance: ${userProfile.riskTolerance}
      - Investment Amount: $${userProfile.investmentAmount}
      - Time Horizon: ${userProfile.timeHorizon}
      
      Provide specific, actionable learning recommendations that match their level and interests.`;

      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are an expert financial educator. Provide specific, actionable learning recommendations tailored to the user\'s experience level and interests.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.6
      }, {
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return this.parseLearningResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating learning recommendations:', error);
      return this.getFallbackLearningRecommendations(userProfile);
    }
  }

  // Generate risk alerts based on user profile
  async generateRiskAlerts(userProfile) {
    try {
      const prompt = `Analyze potential risks for this investor profile and provide 2-3 specific risk alerts:
      
      User Profile:
      - Risk Tolerance: ${userProfile.riskTolerance}
      - Areas of Interest: ${userProfile.areasOfInterest.join(', ')}
      - Investment Amount: $${userProfile.investmentAmount}
      - Experience Level: ${userProfile.experienceLevel}
      
      Focus on risks specific to their investment interests and risk tolerance level.`;

      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a risk management expert. Provide specific, actionable risk alerts tailored to the user\'s investment profile and risk tolerance.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 600,
        temperature: 0.5
      }, {
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return this.parseRiskAlerts(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating risk alerts:', error);
      return this.getFallbackRiskAlerts(userProfile);
    }
  }

  // Build personalization prompt
  buildPersonalizationPrompt(userProfile) {
    return `Create personalized market insights for this investor:

    Profile:
    - Name: ${userProfile.name}
    - Experience: ${userProfile.experienceLevel}
    - Interests: ${userProfile.areasOfInterest.join(', ')}
    - Goal: ${userProfile.primaryGoal}
    - Risk Tolerance: ${userProfile.riskTolerance}
    - Investment Amount: $${userProfile.investmentAmount}
    - Time Horizon: ${userProfile.timeHorizon}

    Provide:
    1. 2-3 current market trends relevant to their interests
    2. Specific investment opportunities matching their risk profile
    3. Personalized advice based on their goals and experience level

    Format as JSON with keys: marketTrends, opportunities, personalizedAdvice`;
  }

  // Build news query
  buildNewsQuery(userProfile) {
    const interests = userProfile.areasOfInterest.join(' OR ');
    return `Find the latest news and market updates about: ${interests}. Focus on developments that would be relevant for a ${userProfile.experienceLevel} investor with ${userProfile.riskTolerance} risk tolerance. Include recent price movements, regulatory changes, and market sentiment.`;
  }

  // Parse AI responses
  parseAIResponse(content) {
    try {
      // Try to parse as JSON first
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback to text parsing
      return {
        marketTrends: [content.split('\n').filter(line => line.trim()).slice(0, 3)],
        opportunities: ['AI-generated insights available'],
        personalizedAdvice: [content]
      };
    } catch (error) {
      return {
        marketTrends: [content],
        opportunities: ['AI insights generated'],
        personalizedAdvice: [content]
      };
    }
  }

  parseNewsResponse(content) {
    const lines = content.split('\n').filter(line => line.trim());
    return lines.slice(0, 5); // Return top 5 news items
  }

  parseLearningResponse(content) {
    const lines = content.split('\n').filter(line => line.trim());
    return lines.slice(0, 5); // Return top 5 recommendations
  }

  parseRiskAlerts(content) {
    const lines = content.split('\n').filter(line => line.trim());
    return lines.slice(0, 3); // Return top 3 risk alerts
  }

  // Fallback methods when AI services are unavailable
  getFallbackInsights(userProfile) {
    return {
      marketTrends: [
        `Current ${userProfile.areasOfInterest[0]} market shows moderate volatility`,
        `Consider ${userProfile.riskTolerance} investment strategies for your portfolio`
      ],
      opportunities: [
        `Diversification opportunities in ${userProfile.areasOfInterest.join(' and ')}`,
        `Long-term growth potential for ${userProfile.primaryGoal} investors`
      ],
      personalizedAdvice: [
        `As a ${userProfile.experienceLevel} investor, focus on building a solid foundation`,
        `Your ${userProfile.riskTolerance} risk tolerance suggests balanced portfolio allocation`
      ]
    };
  }

  getFallbackNews(userProfile) {
    return [
      `Market update: ${userProfile.areasOfInterest[0]} sector showing positive trends`,
      `Investment news: Opportunities in ${userProfile.primaryGoal} strategies`,
      `Market analysis: ${userProfile.riskTolerance} risk approach recommended`
    ];
  }

  getFallbackLearningRecommendations(userProfile) {
    return [
      `Learn about ${userProfile.areasOfInterest[0]} fundamentals`,
      `Understand ${userProfile.riskTolerance} risk management strategies`,
      `Study ${userProfile.primaryGoal} investment approaches`,
      `Explore portfolio diversification techniques`,
      `Master market analysis for ${userProfile.experienceLevel} level`
    ];
  }

  getFallbackRiskAlerts(userProfile) {
    return [
      `Monitor ${userProfile.areasOfInterest[0]} market volatility`,
      `Consider risk management for ${userProfile.riskTolerance} investments`,
      `Stay informed about market changes affecting your portfolio`
    ];
  }

  // Main curation method that combines all AI services
  async curateContentForUser(userProfile) {
    try {
      const [insights, news, learning, risks] = await Promise.all([
        this.generatePersonalizedInsights(userProfile),
        this.getMarketNews(userProfile),
        this.generateLearningRecommendations(userProfile),
        this.generateRiskAlerts(userProfile)
      ]);

      return {
        lastUpdated: new Date(),
        marketTrends: insights.marketTrends || [],
        personalizedNews: news || [],
        riskAlerts: risks || [],
        learningRecommendations: learning || [],
        personalizedAdvice: insights.personalizedAdvice || []
      };
    } catch (error) {
      console.error('Error curating content:', error);
      return {
        lastUpdated: new Date(),
        marketTrends: this.getFallbackInsights(userProfile).marketTrends,
        personalizedNews: this.getFallbackNews(userProfile),
        riskAlerts: this.getFallbackRiskAlerts(userProfile),
        learningRecommendations: this.getFallbackLearningRecommendations(userProfile),
        personalizedAdvice: this.getFallbackInsights(userProfile).personalizedAdvice
      };
    }
  }
}

module.exports = new AICurationService();
