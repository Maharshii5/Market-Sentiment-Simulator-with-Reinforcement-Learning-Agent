import { 
  StockData, 
  HistoricalPrice, 
  PortfolioHolding, 
  AgentDecision,
  SentimentData,
  TradeLogEntry,
  PerformanceMetric
} from '../types';

// Mock stock symbols
const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM'];

// Generate a random number between min and max
const randomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

// Generate a random integer between min and max
const randomInt = (min: number, max: number) => {
  return Math.floor(randomNumber(min, max));
};

// Generate mock stock data
export const generateMockStockData = (): StockData[] => {
  return symbols.map(symbol => {
    const price = parseFloat(randomNumber(50, 500).toFixed(2));
    const previousClose = parseFloat((price * (1 + randomNumber(-0.05, 0.05))).toFixed(2));
    const change = parseFloat((price - previousClose).toFixed(2));
    const changePercent = parseFloat(((change / previousClose) * 100).toFixed(2));
    
    return {
      symbol,
      name: getCompanyName(symbol),
      price,
      previousClose,
      change,
      changePercent,
      volume: randomInt(1000000, 10000000),
      marketCap: randomInt(100000000000, 3000000000000)
    };
  });
};

// Get company name from symbol
const getCompanyName = (symbol: string): string => {
  const companies: Record<string, string> = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'META': 'Meta Platforms Inc.',
    'TSLA': 'Tesla Inc.',
    'NVDA': 'NVIDIA Corporation',
    'JPM': 'JPMorgan Chase & Co.'
  };
  
  return companies[symbol] || `${symbol} Corp`;
};

// Generate historical price data for a given symbol
export const generateHistoricalPrices = (symbol: string, days: number = 30): HistoricalPrice[] => {
  const today = new Date();
  const data: HistoricalPrice[] = [];
  let price = randomNumber(100, 500);
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    const dailyVolatility = randomNumber(0.01, 0.03);
    const change = price * randomNumber(-dailyVolatility, dailyVolatility);
    
    const open = parseFloat((price + change * 0.2).toFixed(2));
    const close = parseFloat((price + change).toFixed(2));
    const high = parseFloat(Math.max(open, close) * (1 + randomNumber(0.001, 0.015)).toFixed(2));
    const low = parseFloat(Math.min(open, close) * (1 - randomNumber(0.001, 0.015)).toFixed(2));
    
    data.push({
      date: date.toISOString().split('T')[0],
      open,
      high,
      close,
      low,
      volume: randomInt(1000000, 10000000)
    });
    
    price = close; // Next day starts from previous close
  }
  
  return data;
};

// Generate mock portfolio holdings
export const generatePortfolioHoldings = (): PortfolioHolding[] => {
  const stockData = generateMockStockData();
  
  return stockData.slice(0, 5).map(stock => {
    const shares = randomInt(10, 100);
    const averageCost = parseFloat((stock.price * (1 + randomNumber(-0.15, 0.15))).toFixed(2));
    const value = parseFloat((shares * stock.price).toFixed(2));
    const costBasis = shares * averageCost;
    const pnl = parseFloat((value - costBasis).toFixed(2));
    const pnlPercent = parseFloat(((pnl / costBasis) * 100).toFixed(2));
    
    return {
      symbol: stock.symbol,
      name: stock.name,
      shares,
      averageCost,
      currentPrice: stock.price,
      value,
      pnl,
      pnlPercent
    };
  });
};

// Generate mock agent decisions
export const generateAgentDecisions = (count: number = 10): AgentDecision[] => {
  const decisions: AgentDecision[] = [];
  const stockData = generateMockStockData();
  const actions: ('BUY' | 'SELL' | 'HOLD')[] = ['BUY', 'SELL', 'HOLD'];
  
  for (let i = 0; i < count; i++) {
    const stock = stockData[randomInt(0, stockData.length - 1)];
    const action = actions[randomInt(0, 2)];
    const now = new Date();
    now.setMinutes(now.getMinutes() - randomInt(0, 60));
    
    decisions.push({
      symbol: stock.symbol,
      action,
      confidence: parseFloat(randomNumber(0.6, 0.98).toFixed(2)),
      timestamp: now.toISOString(),
      price: stock.price,
      quantity: randomInt(1, 50),
      reasoning: generateDecisionReasoning(action, stock.symbol)
    });
  }
  
  return decisions.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Generate a reasoning for the agent's decision
const generateDecisionReasoning = (action: string, symbol: string): string => {
  const buyReasons = [
    `Positive sentiment detected in recent news articles about ${symbol}`,
    `${symbol} is trading below its 50-day moving average, indicating a potential buying opportunity`,
    `Strong technical indicators suggesting upward momentum for ${symbol}`,
    `Recent earnings report for ${symbol} exceeded analyst expectations`
  ];
  
  const sellReasons = [
    `Negative sentiment detected in recent news articles about ${symbol}`,
    `${symbol} is trading above its historical resistance level`,
    `Technical indicators suggesting a potential downward trend for ${symbol}`,
    `${symbol} has reached the target price in our trading strategy`
  ];
  
  const holdReasons = [
    `No significant change in sentiment or price movement for ${symbol}`,
    `${symbol} is trading within expected volatility range`,
    `Insufficient data to make a high-confidence decision for ${symbol}`,
    `Waiting for more market signals before adjusting position on ${symbol}`
  ];
  
  if (action === 'BUY') {
    return buyReasons[randomInt(0, buyReasons.length - 1)];
  } else if (action === 'SELL') {
    return sellReasons[randomInt(0, sellReasons.length - 1)];
  } else {
    return holdReasons[randomInt(0, holdReasons.length - 1)];
  }
};

// Generate mock sentiment data
export const generateSentimentData = (): SentimentData[] => {
  return symbols.map(symbol => {
    const overallScore = parseFloat(randomNumber(0, 1).toFixed(2));
    const neutralScore = parseFloat(randomNumber(0.2, 0.4).toFixed(2));
    const remainingScore = 1 - neutralScore;
    
    let positiveScore, negativeScore;
    if (overallScore > 0.5) {
      positiveScore = parseFloat((remainingScore * overallScore).toFixed(2));
      negativeScore = parseFloat((remainingScore - positiveScore).toFixed(2));
    } else {
      negativeScore = parseFloat((remainingScore * (1 - overallScore)).toFixed(2));
      positiveScore = parseFloat((remainingScore - negativeScore).toFixed(2));
    }
    
    const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
    
    return {
      symbol,
      overallScore,
      positiveScore,
      negativeScore,
      neutralScore,
      sources: randomInt(10, 100),
      recentTrend: trends[randomInt(0, 2)]
    };
  });
};

// Generate mock trade logs
export const generateTradeLogs = (count: number = 20): TradeLogEntry[] => {
  const logs: TradeLogEntry[] = [];
  const stockData = generateMockStockData();
  const actions: ('BUY' | 'SELL')[] = ['BUY', 'SELL'];
  const agents: ('AI' | 'Manual')[] = ['AI', 'Manual'];
  
  for (let i = 0; i < count; i++) {
    const stock = stockData[randomInt(0, stockData.length - 1)];
    const action = actions[randomInt(0, 1)];
    const quantity = randomInt(1, 100);
    const now = new Date();
    now.setHours(now.getHours() - randomInt(0, 72));
    
    logs.push({
      id: `trade-${i}`,
      symbol: stock.symbol,
      action,
      price: parseFloat((stock.price * (1 + randomNumber(-0.05, 0.05))).toFixed(2)),
      quantity,
      timestamp: now.toISOString(),
      pnl: action === 'SELL' ? parseFloat((quantity * stock.price * randomNumber(-0.2, 0.3)).toFixed(2)) : undefined,
      agent: agents[randomInt(0, 1)]
    });
  }
  
  return logs.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Generate performance metrics
export const generatePerformanceMetrics = (): PerformanceMetric[] => {
  const metrics: PerformanceMetric[] = [
    {
      name: 'Total Return',
      value: parseFloat(randomNumber(-15, 30).toFixed(2)),
      change: parseFloat(randomNumber(-5, 5).toFixed(2)),
      trend: Math.random() > 0.5 ? 'up' : 'down',
      description: 'Overall return percentage from all trades'
    },
    {
      name: 'Sharpe Ratio',
      value: parseFloat(randomNumber(0.5, 2.5).toFixed(2)),
      change: parseFloat(randomNumber(-0.3, 0.3).toFixed(2)),
      trend: Math.random() > 0.5 ? 'up' : 'down',
      description: 'Measure of risk-adjusted return'
    },
    {
      name: 'Win Rate',
      value: parseFloat(randomNumber(40, 70).toFixed(2)),
      change: parseFloat(randomNumber(-3, 3).toFixed(2)),
      trend: Math.random() > 0.5 ? 'up' : 'down',
      description: 'Percentage of profitable trades'
    },
    {
      name: 'Max Drawdown',
      value: parseFloat(randomNumber(5, 25).toFixed(2)),
      change: parseFloat(randomNumber(-2, 2).toFixed(2)),
      trend: Math.random() > 0.5 ? 'down' : 'up',
      description: 'Largest percentage drop from peak to trough'
    },
    {
      name: 'Avg. Holding Period',
      value: parseFloat(randomNumber(1, 10).toFixed(1)),
      change: parseFloat(randomNumber(-1, 1).toFixed(1)),
      trend: Math.random() > 0.5 ? 'up' : 'stable',
      description: 'Average number of days positions are held'
    }
  ];
  
  return metrics;
};

export const defaultSimulationParameters = {
  riskTolerance: 0.5,
  tradingFrequency: 10,
  maxPositionSize: 25,
  useHistoricalData: true,
  includeSentiment: true,
  learningRate: 0.01
};
