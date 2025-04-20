import React, { useState } from 'react';
import { Settings, Play, Pause, RefreshCw, Sliders } from 'lucide-react';
import { SimulationParameters } from '../../types';

interface SimulationControlsProps {
  isRunning: boolean;
  onToggle: () => void;
  parameters: SimulationParameters;
  onParametersChange: (params: SimulationParameters) => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({ 
  isRunning, 
  onToggle, 
  parameters,
  onParametersChange
}) => {
  const [showParameters, setShowParameters] = useState(false);
  const [localParams, setLocalParams] = useState<SimulationParameters>(parameters);
  
  const handleParamChange = (key: keyof SimulationParameters, value: any) => {
    const newParams = { ...localParams, [key]: value };
    setLocalParams(newParams);
    onParametersChange(newParams);
  };
  
  return (
    <div className="bg-slate-800 rounded-xl p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6 text-emerald-500" />
        <h2 className="text-xl font-bold text-white">Simulation Controls</h2>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <button
            className={`flex items-center justify-center gap-2 p-4 rounded-lg ${
              isRunning
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            } text-white transition-colors`}
            onClick={onToggle}
          >
            {isRunning ? (
              <>
                <Pause className="h-5 w-5" />
                <span>Pause Simulation</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>Start Simulation</span>
              </>
            )}
          </button>
          
          <button
            className="flex items-center justify-center gap-2 p-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
            onClick={() => onParametersChange({ ...parameters })}
          >
            <RefreshCw className="h-5 w-5" />
            <span>Reset Simulation</span>
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium">Agent Parameters</h3>
          <button
            className="flex items-center gap-1 text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
            onClick={() => setShowParameters(!showParameters)}
          >
            <Sliders className="h-4 w-4" />
            <span>{showParameters ? 'Hide Parameters' : 'Show Parameters'}</span>
          </button>
        </div>
        
        {showParameters && (
          <div className="space-y-4 mt-2 p-4 bg-slate-700/30 rounded-lg">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm text-slate-400">Risk Tolerance</label>
                <span className="text-sm text-white">{localParams.riskTolerance}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={localParams.riskTolerance}
                onChange={(e) => handleParamChange('riskTolerance', parseFloat(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-slate-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Conservative</span>
                <span>Aggressive</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm text-slate-400">Trading Frequency</label>
                <span className="text-sm text-white">{localParams.tradingFrequency} trades/day</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={localParams.tradingFrequency}
                onChange={(e) => handleParamChange('tradingFrequency', parseInt(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-slate-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm text-slate-400">Max Position Size (%)</label>
                <span className="text-sm text-white">{localParams.maxPositionSize}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={localParams.maxPositionSize}
                onChange={(e) => handleParamChange('maxPositionSize', parseInt(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-slate-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm text-slate-400">Learning Rate</label>
                <span className="text-sm text-white">{localParams.learningRate}</span>
              </div>
              <input
                type="range"
                min="0.001"
                max="0.1"
                step="0.001"
                value={localParams.learningRate}
                onChange={(e) => handleParamChange('learningRate', parseFloat(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-slate-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500"
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useHistoricalData"
                  checked={localParams.useHistoricalData}
                  onChange={(e) => handleParamChange('useHistoricalData', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-500 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="useHistoricalData" className="ml-2 text-sm text-slate-300">
                  Use Historical Data
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeSentiment"
                  checked={localParams.includeSentiment}
                  onChange={(e) => handleParamChange('includeSentiment', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-500 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="includeSentiment" className="ml-2 text-sm text-slate-300">
                  Include Sentiment
                </label>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-2 p-4 bg-slate-700/30 rounded-lg">
          <h3 className="text-sm font-medium text-white mb-2">Simulation Status</h3>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Status</span>
              <span className={isRunning ? 'text-emerald-500' : 'text-amber-500'}>
                {isRunning ? 'Running' : 'Paused'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Agent Type</span>
              <span className="text-white">PPO</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Training Episodes</span>
              <span className="text-white">1,245</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Market Data</span>
              <span className="text-white">Simulated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationControls;