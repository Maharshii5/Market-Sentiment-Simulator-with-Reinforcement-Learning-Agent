import React from 'react';
import { MessageSquare, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { SentimentData } from '../../types';

interface SentimentAnalysisProps {
  data: SentimentData[];
  onSymbolSelect: (symbol: string) => void;
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ data, onSymbolSelect }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-6 w-6 text-emerald-500" />
        <h2 className="text-xl font-bold text-white">Sentiment Analysis</h2>
      </div>
      
      <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2">
        {data.map((item) => (
          <div 
            key={item.symbol}
            className="bg-slate-700/50 rounded-lg p-4 cursor-pointer transition-all hover:bg-slate-700"
            onClick={() => onSymbolSelect(item.symbol)}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-white">{item.symbol}</span>
              <div className="flex items-center text-sm">
                <span className="mr-1 text-xs text-slate-400">Trend:</span>
                {item.recentTrend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                ) : item.recentTrend === 'down' ? (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                ) : (
                  <Minus className="h-4 w-4 text-amber-500" />
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-400">Overall Sentiment</span>
                  <span className={`text-xs font-medium ${
                    item.overallScore > 0.6 
                      ? 'text-emerald-500' 
                      : item.overallScore < 0.4 
                        ? 'text-red-500' 
                        : 'text-amber-500'
                  }`}>
                    {(item.overallScore * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      item.overallScore > 0.6 
                        ? 'bg-emerald-500' 
                        : item.overallScore < 0.4 
                          ? 'bg-red-500' 
                          : 'bg-amber-500'
                    }`}
                    style={{ width: `${item.overallScore * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex -mx-1">
                <div className="px-1 w-1/3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-400">Positive</span>
                    <span className="text-xs font-medium text-emerald-500">
                      {(item.positiveScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${item.positiveScore * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="px-1 w-1/3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-400">Neutral</span>
                    <span className="text-xs font-medium text-blue-500">
                      {(item.neutralScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${item.neutralScore * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="px-1 w-1/3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-400">Negative</span>
                    <span className="text-xs font-medium text-red-500">
                      {(item.negativeScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-red-500"
                      style={{ width: `${item.negativeScore * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-3 text-xs text-slate-400">
              Based on {item.sources} news sources
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentimentAnalysis;