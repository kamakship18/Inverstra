/**
 * Fetch.ai Setup Script
 * This script helps set up Fetch.ai integration for the Inverstra platform
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class FetchAISetup {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.configPath = path.join(this.projectRoot, 'config');
    this.servicesPath = path.join(this.projectRoot, 'services');
    this.routesPath = path.join(this.projectRoot, 'routes');
  }

  /**
   * Run the complete Fetch.ai setup
   */
  async setup() {
    console.log('🚀 Starting Fetch.ai setup for Inverstra...\n');

    try {
      await this.checkPrerequisites();
      await this.createDirectories();
      await this.setupEnvironment();
      await this.installDependencies();
      await this.initializeAgents();
      await this.createDocumentation();
      
      console.log('\n✅ Fetch.ai setup completed successfully!');
      console.log('\n📋 Next steps:');
      console.log('1. Update your .env file with Fetch.ai configuration');
      console.log('2. Start the backend server: npm start');
      console.log('3. Initialize Fetch.ai agents: POST /api/fetchai/initialize');
      console.log('4. Test the integration: GET /api/fetchai/health');
      console.log('\n📚 Documentation: README-FETCHAI.md');
      
    } catch (error) {
      console.error('\n❌ Setup failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Check prerequisites
   */
  async checkPrerequisites() {
    console.log('🔍 Checking prerequisites...');

    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 16) {
      throw new Error('Node.js version 16 or higher is required');
    }
    console.log(`✅ Node.js version: ${nodeVersion}`);

    // Check if package.json exists
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json not found. Please run this script from the backend directory.');
    }
    console.log('✅ package.json found');

    // Check if required directories exist
    const requiredDirs = ['config', 'services', 'routes'];
    for (const dir of requiredDirs) {
      const dirPath = path.join(this.projectRoot, dir);
      if (!fs.existsSync(dirPath)) {
        throw new Error(`Required directory not found: ${dir}`);
      }
    }
    console.log('✅ Required directories found');
  }

  /**
   * Create necessary directories
   */
  async createDirectories() {
    console.log('\n📁 Creating directories...');

    const directories = [
      'logs',
      'logs/fetchai',
      'data/fetchai',
      'data/fetchai/agents',
      'data/fetchai/analyses',
      'data/fetchai/metrics'
    ];

    for (const dir of directories) {
      const dirPath = path.join(this.projectRoot, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
      } else {
        console.log(`ℹ️  Directory already exists: ${dir}`);
      }
    }
  }

  /**
   * Setup environment configuration
   */
  async setupEnvironment() {
    console.log('\n⚙️  Setting up environment configuration...');

    const envExamplePath = path.join(this.configPath, 'fetchai.env.example');
    const envPath = path.join(this.projectRoot, '.env');

    if (fs.existsSync(envExamplePath)) {
      console.log('✅ Fetch.ai environment example found');
      
      if (!fs.existsSync(envPath)) {
        console.log('📝 Creating .env file from example...');
        const envContent = fs.readFileSync(envExamplePath, 'utf8');
        fs.writeFileSync(envPath, envContent);
        console.log('✅ .env file created');
      } else {
        console.log('ℹ️  .env file already exists');
      }
    } else {
      console.log('⚠️  Fetch.ai environment example not found');
    }
  }

  /**
   * Install dependencies
   */
  async installDependencies() {
    console.log('\n📦 Installing dependencies...');

    const dependencies = [
      'axios',
      'uuid',
      'dotenv'
    ];

    try {
      for (const dep of dependencies) {
        console.log(`Installing ${dep}...`);
        execSync(`npm install ${dep}`, { 
          cwd: this.projectRoot, 
          stdio: 'inherit' 
        });
        console.log(`✅ ${dep} installed`);
      }
    } catch (error) {
      console.log('⚠️  Some dependencies may already be installed');
    }
  }

  /**
   * Initialize Fetch.ai agents
   */
  async initializeAgents() {
    console.log('\n🤖 Initializing Fetch.ai agents...');

    const agentConfigs = [
      {
        id: 'prediction-analyzer-agent',
        name: 'Prediction Analysis Agent',
        type: 'predictionAnalyzer'
      },
      {
        id: 'market-data-collector-agent',
        name: 'Market Data Collector Agent',
        type: 'marketDataCollector'
      },
      {
        id: 'risk-assessment-agent',
        name: 'Risk Assessment Agent',
        type: 'riskAssessmentAgent'
      },
      {
        id: 'news-aggregator-agent',
        name: 'News Aggregator Agent',
        type: 'newsAggregatorAgent'
      },
      {
        id: 'dao-governance-agent',
        name: 'DAO Governance Agent',
        type: 'daoGovernanceAgent'
      }
    ];

    const agentsDataPath = path.join(this.projectRoot, 'data/fetchai/agents/agents.json');
    fs.writeFileSync(agentsDataPath, JSON.stringify(agentConfigs, null, 2));
    console.log('✅ Agent configurations created');

    // Create initial metrics file
    const metricsDataPath = path.join(this.projectRoot, 'data/fetchai/metrics/initial.json');
    const initialMetrics = {
      totalAgents: agentConfigs.length,
      activeAgents: agentConfigs.length,
      totalTasks: 0,
      completedTasks: 0,
      totalRewards: 0,
      averageAccuracy: 0.85,
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(metricsDataPath, JSON.stringify(initialMetrics, null, 2));
    console.log('✅ Initial metrics created');
  }

  /**
   * Create documentation
   */
  async createDocumentation() {
    console.log('\n📚 Creating documentation...');

    const readmePath = path.join(this.projectRoot, '..', 'README-FETCHAI.md');
    
    const readmeContent = `# 🤖 Fetch.ai Integration for Inverstra

## Overview

This document describes the Fetch.ai integration for the Inverstra platform. Fetch.ai agents provide enhanced AI capabilities for prediction analysis, market data collection, risk assessment, and more.

## Features

- **Multi-Agent Analysis**: Specialized AI agents for different tasks
- **Decentralized AI**: Agent-based architecture for scalability
- **Token Economy**: Agents earn tokens for quality services
- **Real-time Monitoring**: Comprehensive metrics and health checks
- **Seamless Integration**: Works alongside existing functionality

## Quick Start

### 1. Setup

\`\`\`bash
cd backend
node scripts/setup-fetchai.js
\`\`\`

### 2. Configuration

Update your \`.env\` file with Fetch.ai settings:

\`\`\`env
FETCHAI_MOCK_MODE=true
FETCHAI_LOG_LEVEL=debug
FETCHAI_AGENT_REWARD_RATE=5
\`\`\`

### 3. Initialize Agents

\`\`\`bash
curl -X POST http://localhost:5004/api/fetchai/initialize
\`\`\`

### 4. Test Integration

\`\`\`bash
curl http://localhost:5004/api/fetchai/health
\`\`\`

## API Endpoints

### Agent Management
- \`POST /api/fetchai/initialize\` - Initialize all agents
- \`GET /api/fetchai/agents\` - Get all agents
- \`GET /api/fetchai/agents/:id\` - Get specific agent

### Analysis
- \`POST /api/fetchai/analyze-prediction\` - Analyze prediction with agents
- \`POST /api/fetchai/compare-analysis\` - Compare with traditional analysis

### Monitoring
- \`GET /api/fetchai/health\` - Health check
- \`GET /api/fetchai/metrics\` - Agent metrics
- \`GET /api/fetchai/stats\` - Performance statistics

## Agent Types

### 1. Prediction Analyzer Agent
- **Purpose**: Analyze investment predictions
- **Capabilities**: Credibility assessment, market alignment
- **Reward Rate**: 5 tokens per analysis

### 2. Market Data Collector Agent
- **Purpose**: Collect real-time market data
- **Capabilities**: Price tracking, volume analysis
- **Reward Rate**: 3 tokens per collection

### 3. Risk Assessment Agent
- **Purpose**: Evaluate investment risks
- **Capabilities**: Risk analysis, volatility assessment
- **Reward Rate**: 4 tokens per assessment

### 4. News Aggregator Agent
- **Purpose**: Collect and analyze financial news
- **Capabilities**: Sentiment analysis, trend identification
- **Reward Rate**: 2 tokens per aggregation

### 5. DAO Governance Agent
- **Purpose**: Assist DAO decision-making
- **Capabilities**: Proposal analysis, consensus building
- **Reward Rate**: 6 tokens per task

## Frontend Integration

### Components

\`\`\`jsx
import FetchAIDashboard from '../components/fetchai/FetchAIDashboard';
import FetchAIAnalysis from '../components/fetchai/FetchAIAnalysis';
\`\`\`

### Usage

\`\`\`jsx
// Dashboard
<FetchAIDashboard />

// Analysis
<FetchAIAnalysis predictionData={data} onAnalysisComplete={handleComplete} />
\`\`\`

## Smart Contract Integration

The \`FetchAIPredictionDAO.sol\` contract extends the original DAO with:

- AI analysis tracking
- Agent authorization
- AI-influenced voting
- Token rewards for agents

## Configuration

### Environment Variables

See \`config/fetchai.env.example\` for all available options.

### Agent Configuration

Agents are configured in \`config/fetchai.js\`:

\`\`\`javascript
agents: {
  predictionAnalyzer: {
    id: 'prediction-analyzer-agent',
    capabilities: ['market-analysis', 'credibility-assessment'],
    rewardRate: 5
  }
}
\`\`\`

## Monitoring

### Health Checks

\`\`\`bash
curl http://localhost:5004/api/fetchai/health
\`\`\`

### Metrics

\`\`\`bash
curl http://localhost:5004/api/fetchai/metrics
\`\`\`

### Performance Stats

\`\`\`bash
curl http://localhost:5004/api/fetchai/stats
\`\`\`

## Development

### Adding New Agents

1. Update \`config/fetchai.js\`
2. Add agent logic in \`services/fetchaiService.js\`
3. Update frontend components
4. Test integration

### Debugging

Enable debug mode:

\`\`\`env
FETCHAI_DEBUG_MODE=true
FETCHAI_LOG_LEVEL=debug
\`\`\`

## Troubleshooting

### Common Issues

1. **Agents not initializing**
   - Check environment variables
   - Verify dependencies are installed
   - Check logs for errors

2. **Analysis failing**
   - Verify agent status
   - Check network connectivity
   - Review error logs

3. **Performance issues**
   - Monitor response times
   - Check agent metrics
   - Adjust timeout settings

### Logs

Logs are stored in:
- \`logs/fetchai.log\` - Agent logs
- \`logs/app.log\` - Application logs

## Support

For issues and questions:
1. Check the logs
2. Review this documentation
3. Test with mock mode enabled
4. Contact the development team

## License

This Fetch.ai integration is part of the Inverstra project and follows the same license terms.
`;

    fs.writeFileSync(readmePath, readmeContent);
    console.log('✅ Documentation created: README-FETCHAI.md');
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new FetchAISetup();
  setup.setup().catch(console.error);
}

module.exports = FetchAISetup;
