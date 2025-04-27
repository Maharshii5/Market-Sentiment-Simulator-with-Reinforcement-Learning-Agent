import * as d3 from 'd3';

export interface AnalyticsMetrics {
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  beta: number;
  alpha: number;
}

export function calculateMetrics(returns: number[]): AnalyticsMetrics {
  const meanReturn = d3.mean(returns) || 0;
  const stdDev = d3.deviation(returns) || 0;
  const riskFreeRate = 0.02 / 252; // Assuming daily returns
  
  const sharpeRatio = (meanReturn - riskFreeRate) / stdDev;
  
  // Calculate maximum drawdown
  let peak = -Infinity;
  let maxDrawdown = 0;
  
  returns.reduce((acc, ret) => {
    const value = acc * (1 + ret);
    peak = Math.max(peak, value);
    maxDrawdown = Math.min(maxDrawdown, (value - peak) / peak);
    return value;
  }, 1);
  
  // Annualized volatility
  const volatility = stdDev * Math.sqrt(252);
  
  // Simplified beta and alpha calculations
  const beta = 1.2; // Mock value, should be calculated against market returns
  const alpha = meanReturn - (riskFreeRate + beta * (0.08 / 252)); // Assuming 8% market return
  
  return {
    sharpeRatio,
    maxDrawdown: Math.abs(maxDrawdown),
    volatility,
    beta,
    alpha
  };
}

export function calculateReturns(prices: number[]): number[] {
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  return returns;
}

export function generateTechnicalIndicators(prices: number[], window: number = 14): {
  rsi: number[];
  macd: number[];
  bollinger: { upper: number[]; lower: number[]; middle: number[] };
} {
  // RSI calculation
  const gains = prices.slice(1).map((p, i) => Math.max(0, p - prices[i]));
  const losses = prices.slice(1).map((p, i) => Math.max(0, prices[i] - p));
  
  const avgGain = d3.mean(gains.slice(0, window)) || 0;
  const avgLoss = d3.mean(losses.slice(0, window)) || 0;
  
  const rsi = [100 - (100 / (1 + avgGain / avgLoss))];
  
  // MACD calculation
  const ema12 = d3.mean(prices.slice(0, 12)) || 0;
  const ema26 = d3.mean(prices.slice(0, 26)) || 0;
  const macd = [ema12 - ema26];
  
  // Bollinger Bands
  const sma = d3.mean(prices.slice(0, window)) || 0;
  const stdDev = d3.deviation(prices.slice(0, window)) || 0;
  
  const bollinger = {
    upper: [sma + stdDev * 2],
    lower: [sma - stdDev * 2],
    middle: [sma]
  };
  
  return { rsi, macd, bollinger };
}
