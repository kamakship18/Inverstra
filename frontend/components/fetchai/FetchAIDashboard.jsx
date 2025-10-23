import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { 
  Bot, 
  Activity, 
  TrendingUp, 
  Shield, 
  Zap, 
  CheckCircle, 
  XCircle, 
  Loader2,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import fetchaiClient from '../../lib/fetchai';

const FetchAIDashboard = () => {
  const { theme } = useTheme();
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('agents');

  const darkMode = theme === 'dark';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize agents if not already done
      if (!fetchaiClient.isInitialized()) {
        await fetchaiClient.initializeAgents();
      }

      // Load health and stats in parallel
      const [healthData, statsData] = await Promise.all([
        fetchaiClient.getAgentHealth(),
        fetchaiClient.getAgentStats()
      ]);

      setHealth(healthData);
      setStats(statsData);
      setAgents(fetchaiClient.getAgents() || []);
    } catch (err) {
      console.error('❌ Error loading dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthBgColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 dark:bg-green-900/20';
      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'critical': return 'bg-red-100 dark:bg-red-900/20';
      default: return 'bg-gray-100 dark:bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-400" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading Fetch.ai Dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="mb-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
        <AlertDescription className="text-gray-900 dark:text-gray-100">
          Error loading Fetch.ai dashboard: {error}
          <Button 
            onClick={loadDashboardData} 
            variant="outline" 
            size="sm" 
            className="ml-2"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Fetch.ai Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and monitor your AI agents</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={loadDashboardData} 
            variant="outline" 
            size="sm"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Health Status */}
      {health && (
        <Alert className={health.success ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'}>
          <Activity className="h-4 w-4" />
          <AlertDescription className="text-gray-900 dark:text-gray-100">
            <strong>System Health:</strong> 
            <span className={`ml-2 ${getHealthColor(health.data?.overall)}`}>
              {health.data?.overall?.toUpperCase() || 'UNKNOWN'}
            </span>
            {health.data?.agents && (
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                ({Object.keys(health.data.agents).length} agents)
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalAgents}</div>
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                {stats.activeAgents} active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTasks}</div>
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                {stats.totalTasks} total tasks
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRewards}</div>
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                tokens distributed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageAccuracy}%</div>
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                across all agents
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'agents', label: 'Agents', icon: <Bot className="h-4 w-4" /> },
            { id: 'performance', label: 'Performance', icon: <TrendingUp className="h-4 w-4" /> },
            { id: 'recent', label: 'Recent Tasks', icon: <Activity className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'agents' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Agent Status</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-600 dark:text-gray-400" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading agents...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents && agents.length > 0 ? agents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{agent.name}</CardTitle>
                    <Badge 
                      variant={agent.status === 'active' ? 'default' : 'secondary'}
                      className={agent.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                    >
                      {agent.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tasks:</span>
                      <span className="text-gray-900 dark:text-white">{agent.metrics.totalTasks}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Success Rate:</span>
                      <span className="text-gray-900 dark:text-white">
                        {agent.metrics.totalTasks > 0 
                          ? Math.round((agent.metrics.successfulTasks / agent.metrics.totalTasks) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Rewards:</span>
                      <span className="text-gray-900 dark:text-white">{agent.metrics.totalRewards}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                No agents available
              </div>
            )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">System Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Health</span>
                      <span className={getHealthColor(health?.overall)}>
                        {health?.overall?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                    <Progress 
                      value={health?.overall === 'healthy' ? 100 : health?.overall === 'warning' ? 60 : 20} 
                      className="h-2" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Active Agents</span>
                      <span>{stats?.activeAgents || 0} / {stats?.totalAgents || 0}</span>
                    </div>
                    <Progress 
                      value={stats?.totalAgents > 0 ? (stats.activeAgents / stats.totalAgents) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Task Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Success Rate</span>
                      <span>{stats?.averageAccuracy || 0}%</span>
                    </div>
                    <Progress value={stats?.averageAccuracy || 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Total Tasks</span>
                      <span>{stats?.totalTasks || 0}</span>
                    </div>
                    <Progress value={Math.min((stats?.totalTasks || 0) / 100, 100)} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'recent' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          <div className="space-y-2">
            {fetchaiClient.getHistory() && fetchaiClient.getHistory().length > 0 ? fetchaiClient.getHistory().slice(0, 5).map((analysis, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Prediction Analysis
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {analysis.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {analysis.analysis.credibilityScore}% credibility
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {analysis.responseTime}ms
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No recent activity
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FetchAIDashboard;
