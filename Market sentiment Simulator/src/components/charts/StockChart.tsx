import React, { useState, useEffect } from 'react';
import { LineChart, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { HistoricalPrice } from '../../types';
import { generateTechnicalIndicators } from '../../utils/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface StockChartProps {
  data: HistoricalPrice[];
  symbol: string;
  onSymbolChange: (symbol: string) => void;
}

const StockChart: React.FC<StockChartProps> = ({ data, symbol, onSymbolChange }) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | 'YTD' | '1Y'>('3M');
  const [showIndicators, setShowIndicators] = useState({
    bollinger: true,
    rsi: false,
    macd: false
  });
  
  // Calculate price change
  const firstPrice = data[0]?.close || 0;
  const lastPrice = data[data.length - 1]?.close || 0;
  const priceChange = lastPrice - firstPrice;
  const priceChangePercent = (priceChange / firstPrice) * 100;
  const isPositive = priceChange >= 0;
  
  // Calculate technical indicators
  const prices = data.map(d => d.close);
  const { bollinger, rsi, macd } = generateTechnicalIndicators(prices);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Chart data
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Price',
        data: data.map(d => d.close),
        borderColor: isPositive ? '#10b981' : '#ef4444',
        backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      },
      ...(showIndicators.bollinger ? [
        {
          label: 'Upper Band',
          data: bollinger.upper,
          borderColor: 'rgba(99, 102, 241, 0.5)',
          borderDash: [5, 5],
          fill: false
        },
        {
          label: 'Lower Band',
          data: bollinger.lower,
          borderColor: 'rgba(99, 102, 241, 0.5)',
          borderDash: [5, 5],
          fill: false
        }
      ] : []),
      ...(showIndicators.rsi ? [{
        label: 'RSI',
        data: rsi,
        borderColor: '#f59e0b',
        fill: false,
        yAxisID: 'rsi'
      }] : []),
      ...(showIndicators.macd ? [{
        label: 'MACD',
        data: macd,
        borderColor: '#8b5cf6',
        fill: false,
        yAxisID: 'macd'
      }] : [])
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        }
      },
      ...(showIndicators.rsi ? {
        rsi: {
          position: 'right' as const,
          min: 0,
          max: 100,
          grid: {
            display: false
          }
        }
      } : {}),
      ...(showIndicators.macd ? {
        macd: {
          position: 'right' as const,
          grid: {
            display: false
          }
        }
      } : {})
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#e2e8f0'
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false
      }
    }
  };
  
  // Stub symbols for demonstration
  const popularSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
  
  return (
    <div className="bg-slate-800 rounded-xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <LineChart className="h-6 w-6 text-emerald-500" />
          <h2 className="text-xl font-bold text-white">Price Chart</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                showIndicators.bollinger ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'
              }`}
              onClick={() => setShowIndicators(prev => ({ ...prev, bollinger: !prev.bollinger }))}
            >
              Bollinger
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                showIndicators.rsi ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'
              }`}
              onClick={() => setShowIndicators(prev => ({ ...prev, rsi: !prev.rsi }))}
            >
              RSI
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                showIndicators.macd ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300'
              }`}
              onClick={() => setShowIndicators(prev => ({ ...prev, macd: !prev.macd }))}
            >
              MACD
            </button>
          </div>
          
          <select 
            value={symbol}
            onChange={(e) => onSymbolChange(e.target.value)}
            className="bg-slate-700 text-white border-none rounded-lg py-1 px-3 focus:ring-2 focus:ring-emerald-500"
          >
            {popularSymbols.map(sym => (
              <option key={sym} value={sym}>{sym}</option>
            ))}
          </select>
          
          <div className="flex bg-slate-700 rounded-lg p-1">
            {(['1D', '1W', '1M', '3M', 'YTD', '1Y'] as const).map((period) => (
              <button
                key={period}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeframe === period 
                    ? 'bg-slate-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
                onClick={() => setTimeframe(period)}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white">{formatCurrency(lastPrice)}</h3>
          <div className={`flex items-center mt-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            <span className="font-medium">
              {isPositive ? '+' : ''}{formatCurrency(priceChange)} ({isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        
        <div className="flex items-center text-slate-400 text-sm">
          <Calendar className="h-4 w-4 mr-1" />
          <span>
            {data[0]?.date} - {data[data.length - 1]?.date}
          </span>
        </div>
      </div>
      
      <div className="h-[400px] w-full">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default StockChart;