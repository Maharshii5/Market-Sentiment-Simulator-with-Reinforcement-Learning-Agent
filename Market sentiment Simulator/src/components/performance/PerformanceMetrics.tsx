import React from 'react';
import { BarChart2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PerformanceMetric } from '../../types';

interface PerformanceMetricsProps {
  metrics: PerformanceMetric[];
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <BarChart2 className="h-6 w-6 text-emerald-500" />
        <h2 className="text-xl font-bold text-white">Performance Metrics</h2>
      </div>
      
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-medium text-white">{metric.name}</h3>
                <p className="text-xs text-slate-400">{metric.description}</p>
              </div>
              <div className="flex items-center">
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                ) : metric.trend === 'down' ? (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                ) : (
                  <Minus className="h-4 w-4 text-amber-500" />
                )}
              </div>
            </div>
            
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold text-white">
                {metric.name.includes('Rate') || metric.name.includes('Return') ? `${metric.value}%` : metric.value}
              </div>
              
              <div className={`flex items-center text-sm ${
                metric.change > 0 
                  ? 'text-emerald-500' 
                  : metric.change < 0 
                    ? 'text-red-500' 
                    : 'text-slate-400'
              }`}>
                {metric.change > 0 ? '+' : ''}
                {metric.change}
                {metric.name.includes('Rate') || metric.name.includes('Return') ? '%' : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceMetrics;