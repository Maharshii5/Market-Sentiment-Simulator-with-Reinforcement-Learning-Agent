import React from 'react';
import { TrendingUp, TrendingDown, Briefcase, DollarSign } from 'lucide-react';
import { PortfolioHolding } from '../../types';

interface PortfolioSummaryProps {
  portfolioValue: number;
  portfolioChange: number;
  portfolioChangePercent: number;
  holdings: PortfolioHolding[];
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ 
  portfolioValue, 
  portfolioChange, 
  portfolioChangePercent,
  holdings
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const isPositive = portfolioChange >= 0;
  
  return (
    <div className="bg-slate-800 rounded-xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-emerald-500" />
          <h2 className="text-xl font-bold text-white">Portfolio Summary</h2>
        </div>
        <span className="text-sm text-slate-400">AI-managed assets</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Total Value</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(portfolioValue)}</p>
        </div>
        
        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Today's Change</p>
          <div className="flex items-center">
            <p className={`text-2xl font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{formatCurrency(portfolioChange)}
            </p>
            <span className={`ml-2 flex items-center ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
              {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            </span>
          </div>
        </div>
        
        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Percent Change</p>
          <p className={`text-2xl font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{portfolioChangePercent.toFixed(2)}%
          </p>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold">Holdings</h3>
          <button className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors">
            View All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-slate-400 text-sm">
                <th className="pb-2">Symbol</th>
                <th className="pb-2">Shares</th>
                <th className="pb-2">Avg. Cost</th>
                <th className="pb-2">Current</th>
                <th className="pb-2">Value</th>
                <th className="pb-2">P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {holdings.map((holding) => (
                <tr key={holding.symbol} className="text-sm">
                  <td className="py-3">
                    <div>
                      <p className="font-medium text-white">{holding.symbol}</p>
                      <p className="text-slate-400 text-xs">{holding.name}</p>
                    </div>
                  </td>
                  <td className="py-3">{holding.shares}</td>
                  <td className="py-3">{formatCurrency(holding.averageCost)}</td>
                  <td className="py-3">{formatCurrency(holding.currentPrice)}</td>
                  <td className="py-3">{formatCurrency(holding.value)}</td>
                  <td className="py-3">
                    <div className={`flex items-center ${holding.pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      <span>{holding.pnl >= 0 ? '+' : ''}{formatCurrency(holding.pnl)}</span>
                      <span className="ml-1 text-xs">({holding.pnl >= 0 ? '+' : ''}{holding.pnlPercent.toFixed(2)}%)</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;