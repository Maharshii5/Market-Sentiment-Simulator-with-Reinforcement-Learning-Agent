// Types for the financial market sentiment simulator

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

export interface HistoricalPrice {
  date: string;
  open: number;
  high: number;
  close: number;
  low: number;
  volume: number;
}

export interface PortfolioHolding {
  symbol: string;
  name: string;
  shares: number;
  averageCost: number;
  currentPrice: number;
  value: number;
  pnl: number;
  pnlPercent: number;
}

export interface AgentDecision {
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  timestamp: string;
  price: number;
  quantity: number;
  reasoning: string;
}

export interface SentimentData {
  symbol: string;
  overallScore: number;
  positiveScore: number; 
  negativeScore: number;
  neutralScore: number;
  sources: number;
  recentTrend: 'up' | 'down' | 'stable';
}

export interface TradeLogEntry {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  timestamp: string;
  pnl?: number;
  agent: 'AI' | 'Manual';
}

export interface PerformanceMetric {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

export interface SimulationParameters {
  riskTolerance: number;
  tradingFrequency: number;
  maxPositionSize: number;
  useHistoricalData: boolean;
  includeSentiment: boolean;
  learningRate: number;
}