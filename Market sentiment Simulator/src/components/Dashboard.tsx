import React, { useState, useEffect } from 'react';
import { Briefcase, BarChart2, LineChart, TrendingUp, Activity, PieChart, Settings } from 'lucide-react';
import PortfolioSummary from './portfolio/PortfolioSummary';
import StockChart from './charts/StockChart';
import AgentDecisions from './agent/AgentDecisions';
import SentimentAnalysis from './sentiment/SentimentAnalysis';
import TradeLog from './trades/TradeLog';
import PerformanceMetrics from './performance/PerformanceMetrics';
import SimulationControls from './simulation/SimulationControls';
import MarketOverview from './market/MarketOverview';
import { 
  generateHistoricalPrices, 
  generatePortfolioHoldings,
  generateAgentDecisions,
  generateSentimentData,
  generateTradeLogs,
  generatePerformanceMetrics,
  defaultSimulationParameters
} from '../utils/mockData';
import { SimulationParameters } from '../types';

const Dashboard: React.FC = () => {
  const [activeSymbol, setActiveSymbol] = useState<string>('AAPL');
  const [portfolioValue, setPortfolioValue] = useState<number>(100000);
  const [portfolioChange, setPortfolioChange] = useState<number>(1250.75);
  const [portfolioChangePercent, setPortfolioChangePercent] = useState<number>(1.27);
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
  const [simulationParameters, setSimulationParameters] = useState<SimulationParameters>(defaultSimulationParameters);
  const [historicalData, setHistoricalData] = useState(generateHistoricalPrices(activeSymbol, 90));
  const [portfolioHoldings, setPortfolioHoldings] = useState(generatePortfolioHoldings());
  const [agentDecisions, setAgentDecisions] = useState(generateAgentDecisions(8));
  const [sentimentData, setSentimentData] = useState(generateSentimentData());
  const [tradeLogs, setTradeLogs] = useState(generateTradeLogs(15));
  const [performanceMetrics, setPerformanceMetrics] = useState(generatePerformanceMetrics());

  // Simulate real-time updates
  useEffect(() => {
    if (!simulationRunning) return;
    
    const interval = setInterval(() => {
      // Update portfolio value with small changes
      setPortfolioValue(prev => {
        const change = prev * (Math.random() * 0.01 - 0.005);
        const newValue = prev + change;
        return parseFloat(newValue.toFixed(2));
      });
      
      // Occasionally add new trades
      if (Math.random() > 0.7) {
        setAgentDecisions(prev => {
          const newDecisions = generateAgentDecisions(1);
          return [...newDecisions, ...prev.slice(0, -1)];
        });
        
        setTradeLogs(prev => {
          const newLogs = generateTradeLogs(1);
          return [...newLogs, ...prev.slice(0, -1)];
        });
      }
      
      // Update sentiment occasionally
      if (Math.random() > 0.8) {
        setSentimentData(generateSentimentData());
      }
      
      // Update performance metrics occasionally
      if (Math.random() > 0.9) {
        setPerformanceMetrics(generatePerformanceMetrics());
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [simulationRunning]);
  
  // Update chart data when active symbol changes
  useEffect(() => {
    setHistoricalData(generateHistoricalPrices(activeSymbol, 90));
  }, [activeSymbol]);
  
  const toggleSimulation = () => {
    setSimulationRunning(!simulationRunning);
  };
  
  const handleSymbolSelect = (symbol: string) => {
    setActiveSymbol(symbol);
  };
  
  const handleParameterChange = (params: SimulationParameters) => {
    setSimulationParameters(params);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <LineChart className="h-8 w-8 text-emerald-500" />
            <h1 className="text-2xl font-bold text-white">FinSent AI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                simulationRunning 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-emerald-600 hover:bg-emerald-700'
              } transition-colors`}
              onClick={toggleSimulation}
            >
              <Activity className="h-5 w-5" />
              <span>{simulationRunning ? 'Stop Simulation' : 'Start Simulation'}</span>
            </button>
            <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {/* Portfolio summary row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="lg:col-span-8">
            <PortfolioSummary 
              portfolioValue={portfolioValue} 
              portfolioChange={portfolioChange} 
              portfolioChangePercent={portfolioChangePercent}
              holdings={portfolioHoldings}
            />
          </div>
          <div className="lg:col-span-4">
            <SimulationControls 
              isRunning={simulationRunning} 
              onToggle={toggleSimulation} 
              parameters={simulationParameters}
              onParametersChange={handleParameterChange}
            />
          </div>
        </div>

        {/* Charts and decision row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="lg:col-span-8">
            <StockChart 
              data={historicalData} 
              symbol={activeSymbol} 
              onSymbolChange={handleSymbolSelect}
            />
          </div>
          <div className="lg:col-span-4">
            <AgentDecisions decisions={agentDecisions} />
          </div>
        </div>

        {/* Sentiment and market row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="lg:col-span-4">
            <SentimentAnalysis data={sentimentData} onSymbolSelect={handleSymbolSelect} />
          </div>
          <div className="lg:col-span-8">
            <MarketOverview onSymbolSelect={handleSymbolSelect} />
          </div>
        </div>

        {/* Trades and metrics row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <TradeLog trades={tradeLogs} />
          </div>
          <div className="lg:col-span-4">
            <PerformanceMetrics metrics={performanceMetrics} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;