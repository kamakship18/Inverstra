module.exports = {
  network: {
    name: 'fetchhub-4',
    chainId: 'fetchhub-4',
    rpc: 'https://rpc-fetchhub.fetch.ai:443',
    rest: 'https://rest-fetchhub.fetch.ai'
  },
  agents: {
    predictionAnalyzer: {
      name: 'prediction-analyzer-agent',
      capabilities: ['market-analysis', 'credibility-assessment'],
      tasks: ['analyze-prediction', 'verify-sources']
    },
    marketDataCollector: {
      name: 'market-data-collector-agent',
      capabilities: ['real-time-data', 'multi-source-aggregation'],
      tasks: ['collect-market-data', 'validate-prices']
    },
    riskAssessmentAgent: {
      name: 'risk-assessment-agent',
      capabilities: ['risk-evaluation', 'portfolio-analysis'],
      tasks: ['assess-risks', 'identify-vulnerabilities']
    },
    newsAggregator: {
      name: 'news-aggregator-agent',
      capabilities: ['news-sentiment', 'market-impact'],
      tasks: ['aggregate-news', 'analyze-sentiment']
    },
    daoGovernanceAgent: {
      name: 'dao-governance-agent',
      capabilities: ['voting-assistance', 'proposal-evaluation'],
      tasks: ['evaluate-proposals', 'recommend-votes']
    }
  }
};
