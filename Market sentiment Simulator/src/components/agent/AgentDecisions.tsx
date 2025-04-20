import React, { useEffect, useState } from 'react';
import { Bot, ArrowUpCircle, ArrowDownCircle, CircleDot, Brain } from 'lucide-react';
import { AgentDecision } from '../../types';
import { TradingAgent } from '../../utils/mlAgent';

interface AgentDecisionsProps {
  decisions: AgentDecision[];
}

const AgentDecisions: React.FC<AgentDecisionsProps> = ({ decisions }) => {
  const [agent] = useState(() => new TradingAgent());
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  
  useEffect(() => {
    const trainAgent = async () => {
      if (!isTraining) return;
      
      // Simple training loop
      for (let i = 0; i < 100; i++) {
        const state = [Math.random(), Math.random(), Math.random()];
        const action = await agent.act(state);
        const reward = Math.random() - 0.5;
        const nextState = [Math.random(), Math.random(), Math.random()];
        
        await agent.train(state, action, reward, nextState);
        setTrainingProgress(i + 1);
      }
      
      setIsTraining(false);
      setTrainingProgress(0);
    };
    
    trainAgent();
  }, [isTraining, agent]);
  
  // Format time
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  return (
    <div className="bg-slate-800 rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-emerald-500" />
          <h2 className="text-xl font-bold text-white">Agent Decisions</h2>
        </div>
        
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            isTraining 
              ? 'bg-purple-600 hover:bg-purple-700' 
              : 'bg-emerald-600 hover:bg-emerald-700'
          } transition-colors`}
          onClick={() => setIsTraining(true)}
          disabled={isTraining}
        >
          <Brain className="h-4 w-4" />
          <span>{isTraining ? 'Training...' : 'Train Agent'}</span>
        </button>
      </div>
      
      {isTraining && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-slate-300 mb-1">
            <span>Training Progress</span>
            <span>{trainingProgress}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${trainingProgress}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2">
        {decisions.map((decision, index) => (
          <div 
            key={`${decision.symbol}-${index}`} 
            className="bg-slate-700/50 rounded-lg p-4 transition-all hover:bg-slate-700 hover:shadow-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                {decision.action === 'BUY' ? (
                  <ArrowUpCircle className="h-5 w-5 text-emerald-500 mr-2" />
                ) : decision.action === 'SELL' ? (
                  <ArrowDownCircle className="h-5 w-5 text-red-500 mr-2" />
                ) : (
                  <CircleDot className="h-5 w-5 text-amber-500 mr-2" />
                )}
                <div>
                  <h3 className="font-medium text-white">{decision.symbol}</h3>
                  <p className="text-xs text-slate-400">{formatTime(decision.timestamp)}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-sm font-medium ${
                  decision.action === 'BUY' 
                    ? 'text-emerald-500' 
                    : decision.action === 'SELL' 
                      ? 'text-red-500' 
                      : 'text-amber-500'
                }`}>
                  {decision.action}
                </span>
                <div className="flex items-center text-xs text-slate-400">
                  <span className="mr-1">Confidence:</span>
                  <span className="font-medium">{(decision.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
            
            {decision.action !== 'HOLD' && (
              <div className="text-sm text-slate-300 mb-2">
                <span className="text-slate-400">Amount: </span>
                {decision.quantity} shares @ {formatCurrency(decision.price)}
              </div>
            )}
            
            <p className="text-sm text-slate-300">
              {decision.reasoning}
            </p>
            
            <div className="mt-3 pt-2 border-t border-slate-600/50 flex justify-between items-center">
              <div className="flex items-center gap-1 text-xs text-purple-400">
                <Brain className="h-3 w-3" />
                <span>ML-based decision</span>
              </div>
              <button className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentDecisions;