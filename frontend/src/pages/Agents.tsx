import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { RootState } from '../store';

interface Agent {
  id: number;
  name: string;
  type: string;
  configuration: Record<string, any>;
  is_active: boolean;
  last_run: string | null;
  performance_metrics: Record<string, any> | null;
}

interface AnalysisResult {
  predictions: Array<{
    symbol: string;
    prediction: number;
    confidence: number;
    reasoning: string;
  }>;
  portfolio_analysis: {
    overall_sentiment: string;
    risk_level: string;
    recommended_actions: string[];
  };
  market_context: {
    sector_performance: Record<string, number>;
    market_trends: string[];
  };
}

const Agents: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAnalysis, setOpenAnalysis] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [newAgent, setNewAgent] = useState({
    name: '',
    type: 'fundamental',
    configuration: {
      lookback_period: 30,
      confidence_threshold: 0.7,
      risk_tolerance: 'moderate',
      analysis_depth: 'comprehensive',
      include_sentiment: true,
      include_technical: true,
      include_fundamental: true,
    },
  });
  const { token } = useSelector((state: RootState) => state.auth);

  const fetchAgents = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/agents/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch agents');
      const data = await response.json();
      setAgents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [token]);

  const handleCreateAgent = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/agents/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAgent),
      });
      if (!response.ok) throw new Error('Failed to create agent');
      await fetchAgents();
      setOpenDialog(false);
      setNewAgent({
        name: '',
        type: 'fundamental',
        configuration: {
          lookback_period: 30,
          confidence_threshold: 0.7,
          risk_tolerance: 'moderate',
          analysis_depth: 'comprehensive',
          include_sentiment: true,
          include_technical: true,
          include_fundamental: true,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeleteAgent = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8001/api/agents/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete agent');
      await fetchAgents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleAnalyze = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8001/api/agents/${id}/analyze`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to run analysis');
      const result = await response.json();
      setAnalysisResult(result);
      setOpenAnalysis(true);
      await fetchAgents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'fundamental':
        return <AssessmentIcon />;
      case 'technical':
        return <TrendingUpIcon />;
      case 'sentiment':
        return <PsychologyIcon />;
      default:
        return <AssessmentIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">AI Agents</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Create Agent
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {agents.map((agent) => (
          <Grid item xs={12} md={6} lg={4} key={agent.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getAgentIcon(agent.type)}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {agent.name}
                  </Typography>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  Type: {agent.type}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Last Run: {agent.last_run || 'Never'}
                </Typography>
                {agent.performance_metrics && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Performance Metrics:</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        Accuracy: {(agent.performance_metrics.accuracy * 100).toFixed(1)}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={agent.performance_metrics.accuracy * 100}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>
                )}
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<PlayIcon />}
                  onClick={() => handleAnalyze(agent.id)}
                >
                  Analyze
                </Button>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteAgent(agent.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Agent</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Agent Name"
              value={newAgent.name}
              onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Agent Type</InputLabel>
              <Select
                value={newAgent.type}
                label="Agent Type"
                onChange={(e) => setNewAgent({ ...newAgent, type: e.target.value })}
              >
                <MenuItem value="fundamental">Fundamental Analysis</MenuItem>
                <MenuItem value="technical">Technical Analysis</MenuItem>
                <MenuItem value="sentiment">Sentiment Analysis</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Configuration</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Lookback Period (days)"
                  value={newAgent.configuration.lookback_period}
                  onChange={(e) => setNewAgent({
                    ...newAgent,
                    configuration: {
                      ...newAgent.configuration,
                      lookback_period: parseInt(e.target.value),
                    },
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Confidence Threshold"
                  value={newAgent.configuration.confidence_threshold}
                  onChange={(e) => setNewAgent({
                    ...newAgent,
                    configuration: {
                      ...newAgent.configuration,
                      confidence_threshold: parseFloat(e.target.value),
                    },
                  })}
                  inputProps={{ step: 0.1, min: 0, max: 1 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Risk Tolerance</InputLabel>
                  <Select
                    value={newAgent.configuration.risk_tolerance}
                    label="Risk Tolerance"
                    onChange={(e) => setNewAgent({
                      ...newAgent,
                      configuration: {
                        ...newAgent.configuration,
                        risk_tolerance: e.target.value,
                      },
                    })}
                  >
                    <MenuItem value="conservative">Conservative</MenuItem>
                    <MenuItem value="moderate">Moderate</MenuItem>
                    <MenuItem value="aggressive">Aggressive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Analysis Depth</InputLabel>
                  <Select
                    value={newAgent.configuration.analysis_depth}
                    label="Analysis Depth"
                    onChange={(e) => setNewAgent({
                      ...newAgent,
                      configuration: {
                        ...newAgent.configuration,
                        analysis_depth: e.target.value,
                      },
                    })}
                  >
                    <MenuItem value="basic">Basic</MenuItem>
                    <MenuItem value="comprehensive">Comprehensive</MenuItem>
                    <MenuItem value="deep">Deep</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateAgent} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAnalysis}
        onClose={() => setOpenAnalysis(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Analysis Results</Typography>
            <IconButton onClick={() => setOpenAnalysis(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {analysisResult && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Portfolio Analysis</Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1">Overall Sentiment</Typography>
                <Chip
                  label={analysisResult.portfolio_analysis.overall_sentiment}
                  color={
                    analysisResult.portfolio_analysis.overall_sentiment === 'Bullish'
                      ? 'success'
                      : analysisResult.portfolio_analysis.overall_sentiment === 'Bearish'
                      ? 'error'
                      : 'warning'
                  }
                  sx={{ mt: 1 }}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1">Risk Level</Typography>
                <Chip
                  label={analysisResult.portfolio_analysis.risk_level}
                  color={
                    analysisResult.portfolio_analysis.risk_level === 'Low'
                      ? 'success'
                      : analysisResult.portfolio_analysis.risk_level === 'High'
                      ? 'error'
                      : 'warning'
                  }
                  sx={{ mt: 1 }}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1">Recommended Actions</Typography>
                <Box sx={{ mt: 1 }}>
                  {analysisResult.portfolio_analysis.recommended_actions.map((action, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                      • {action}
                    </Typography>
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>Stock Predictions</Typography>
              <Grid container spacing={2}>
                {analysisResult.predictions.map((prediction) => (
                  <Grid item xs={12} sm={6} md={4} key={prediction.symbol}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{prediction.symbol}</Typography>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="subtitle2">Prediction</Typography>
                          <Typography
                            variant="h6"
                            color={prediction.prediction > 0 ? 'success.main' : 'error.main'}
                          >
                            {prediction.prediction > 0 ? '+' : ''}
                            {prediction.prediction.toFixed(2)}%
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="subtitle2">Confidence</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={prediction.confidence * 100}
                            sx={{ mt: 0.5 }}
                          />
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {(prediction.confidence * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="subtitle2">Reasoning</Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {prediction.reasoning}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>Market Context</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1">Sector Performance</Typography>
                  <Box sx={{ mt: 1 }}>
                    {Object.entries(analysisResult.market_context.sector_performance).map(([sector, performance]) => (
                      <Box key={sector} sx={{ mb: 1 }}>
                        <Typography variant="body2">{sector}</Typography>
                        <LinearProgress
                          variant="determinate"
                          value={Math.abs(performance) * 100}
                          color={performance > 0 ? 'success' : 'error'}
                          sx={{ mt: 0.5 }}
                        />
                        <Typography
                          variant="body2"
                          color={performance > 0 ? 'success.main' : 'error.main'}
                          sx={{ mt: 0.5 }}
                        >
                          {performance > 0 ? '+' : ''}{performance.toFixed(2)}%
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1">Market Trends</Typography>
                  <Box sx={{ mt: 1 }}>
                    {analysisResult.market_context.market_trends.map((trend, index) => (
                      <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                        • {trend}
                      </Typography>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Agents; 