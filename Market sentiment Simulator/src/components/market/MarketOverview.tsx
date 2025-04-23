import React, { useState } from 'react';
import { Globe, Search, ArrowUpRight, ArrowDownRight, SortAsc, SortDesc } from 'lucide-react';
import { generateMockStockData } from '../../utils/mockData';
import { StockData } from '../../types';

interface MarketOverviewProps {
  onSymbolSelect: (symbol: string) => void;
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ onSymbolSelect }) => {
  const [stocks, setStocks] = useState<StockData[]>(generateMockStockData());
  const [sortField, setSortField] = useState<keyof StockData>('marketCap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Format large numbers (B, M)
  const formatLargeNumber = (value: number) => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(2)}B`;
    } else if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)}M`;
    } else {
      return value.toLocaleString();
    }
  };
  
  // Handle sort
  const handleSort = (field: keyof StockData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Filter and sort stocks
  const filteredAndSortedStocks = stocks
    .filter(stock => 
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      } else {
        const aString = String(aValue);
        const bString = String(bValue);
        return sortDirection === 'asc' 
          ? aString.localeCompare(bString) 
          : bString.localeCompare(aString);
      }
    });
  
  return (
    <div className="bg-slate-800 rounded-xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-emerald-500" />
          <h2 className="text-xl font-bold text-white">Market Overview</h2>
        </div>
        
        <div className="relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search symbol or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-700 text-white rounded-lg border-none focus:ring-2 focus:ring-emerald-500 text-sm w-64"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-400 text-sm border-b border-slate-700">
              <th 
                className="pb-3 font-medium cursor-pointer"
                onClick={() => handleSort('symbol')}
              >
                <div className="flex items-center">
                  <span>Symbol</span>
                  {sortField === 'symbol' && (
                    sortDirection === 'asc' ? 
                      <SortAsc className="h-3 w-3 ml-1" /> : 
                      <SortDesc className="h-3 w-3 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="pb-3 font-medium cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  <span>Name</span>
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? 
                      <SortAsc className="h-3 w-3 ml-1" /> : 
                      <SortDesc className="h-3 w-3 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="pb-3 font-medium cursor-pointer text-right"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center justify-end">
                  <span>Price</span>
                  {sortField === 'price' && (
                    sortDirection === 'asc' ? 
                      <SortAsc className="h-3 w-3 ml-1" /> : 
                      <SortDesc className="h-3 w-3 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="pb-3 font-medium cursor-pointer text-right"
                onClick={() => handleSort('changePercent')}
              >
                <div className="flex items-center justify-end">
                  <span>Change %</span>
                  {sortField === 'changePercent' && (
                    sortDirection === 'asc' ? 
                      <SortAsc className="h-3 w-3 ml-1" /> : 
                      <SortDesc className="h-3 w-3 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="pb-3 font-medium cursor-pointer text-right"
                onClick={() => handleSort('volume')}
              >
                <div className="flex items-center justify-end">
                  <span>Volume</span>
                  {sortField === 'volume' && (
                    sortDirection === 'asc' ? 
                      <SortAsc className="h-3 w-3 ml-1" /> : 
                      <SortDesc className="h-3 w-3 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="pb-3 font-medium cursor-pointer text-right"
                onClick={() => handleSort('marketCap')}
              >
                <div className="flex items-center justify-end">
                  <span>Market Cap</span>
                  {sortField === 'marketCap' && (
                    sortDirection === 'asc' ? 
                      <SortAsc className="h-3 w-3 ml-1" /> : 
                      <SortDesc className="h-3 w-3 ml-1" />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {filteredAndSortedStocks.map((stock) => (
              <tr 
                key={stock.symbol} 
                className="text-sm hover:bg-slate-700/20 transition-colors cursor-pointer"
                onClick={() => onSymbolSelect(stock.symbol)}
              >
                <td className="py-3 font-medium text-white">{stock.symbol}</td>
                <td className="py-3 text-slate-300">{stock.name}</td>
                <td className="py-3 text-right text-white">{formatCurrency(stock.price)}</td>
                <td className="py-3 text-right">
                  <div className={`flex items-center justify-end ${
                    stock.changePercent >= 0 ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    {stock.changePercent >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    <span>{stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                  </div>
                </td>
                <td className="py-3 text-right text-slate-300">{formatLargeNumber(stock.volume)}</td>
                <td className="py-3 text-right text-slate-300">{formatLargeNumber(stock.marketCap)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketOverview;
