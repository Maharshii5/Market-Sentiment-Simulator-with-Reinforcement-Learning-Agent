import React from 'react';
import { History, ArrowUpCircle, ArrowDownCircle, User, Bot } from 'lucide-react';
import { TradeLogEntry } from '../../types';

interface TradeLogProps {
  trades: TradeLogEntry[];
}

const TradeLog: React.FC<TradeLogProps> = ({ trades }) => {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Format date
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="bg-slate-800 rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <History className="h-6 w-6 text-emerald-500" />
          <h2 className="text-xl font-bold text-white">Trade History</h2>
        </div>
        <div className="flex">
          <button className="px-3 py-1 text-sm rounded-md bg-slate-700 text-white hover:bg-slate-600 transition-colors">
            Export
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-400 text-sm border-b border-slate-700">
              <th className="pb-3 font-medium">Time</th>
              <th className="pb-3 font-medium">Symbol</th>
              <th className="pb-3 font-medium">Action</th>
              <th className="pb-3 font-medium">Price</th>
              <th className="pb-3 font-medium">Quantity</th>
              <th className="pb-3 font-medium">Value</th>
              <th className="pb-3 font-medium">P&L</th>
              <th className="pb-3 font-medium">Agent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {trades.map((trade) => (
              <tr key={trade.id} className="text-sm hover:bg-slate-700/20 transition-colors">
                <td className="py-3 text-slate-300">{formatDate(trade.timestamp)}</td>
                <td className="py-3 font-medium text-white">{trade.symbol}</td>
                <td className="py-3">
                  <div className="flex items-center">
                    {trade.action === 'BUY' ? (
                      <ArrowUpCircle className="h-4 w-4 text-emerald-500 mr-1" />
                    ) : (
                      <ArrowDownCircle className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={trade.action === 'BUY' ? 'text-emerald-500' : 'text-red-500'}>
                      {trade.action}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-slate-300">{formatCurrency(trade.price)}</td>
                <td className="py-3 text-slate-300">{trade.quantity}</td>
                <td className="py-3 text-slate-300">{formatCurrency(trade.price * trade.quantity)}</td>
                <td className="py-3">
                  {trade.pnl !== undefined ? (
                    <span className={trade.pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                      {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                    </span>
                  ) : (
                    <span className="text-slate-500">-</span>
                  )}
                </td>
                <td className="py-3">
                  <div className="flex items-center">
                    {trade.agent === 'AI' ? (
                      <Bot className="h-4 w-4 text-blue-500 mr-1" />
                    ) : (
                      <User className="h-4 w-4 text-amber-500 mr-1" />
                    )}
                    <span className="text-slate-300">{trade.agent}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeLog;