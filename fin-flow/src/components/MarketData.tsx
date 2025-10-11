import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MarketAsset {
  name: string;
  price: number;
  change: number;
  changePercent: number;
  type: 'stock' | 'crypto' | 'commodity';
}

// Mock data - Replace with actual API integration
const mockMarketData: MarketAsset[] = [
  { name: 'NIFTY 50', price: 22156.75, change: 123.45, changePercent: 0.56, type: 'stock' },
  { name: 'SENSEX', price: 73048.32, change: 367.21, changePercent: 0.51, type: 'stock' },
  { name: 'Bitcoin', price: 3456789.50, change: -45678.23, changePercent: -1.31, type: 'crypto' },
  { name: 'Ethereum', price: 178945.67, change: 2345.67, changePercent: 1.33, type: 'crypto' },
  { name: 'Gold', price: 62785.00, change: 785.00, changePercent: 1.27, type: 'commodity' },
  { name: 'Silver', price: 71250.00, change: -450.00, changePercent: -0.63, type: 'commodity' }
];

const alerts = [
  {
    asset: 'Gold',
    message: 'Gold prices dipped 5% this week. Consider buying for long-term investment.',
    type: 'opportunity'
  },
  {
    asset: 'NIFTY 50',
    message: 'Market showing bullish trends. Review your equity allocation.',
    type: 'info'
  },
  {
    asset: 'Bitcoin',
    message: 'High volatility detected. Monitor your crypto positions closely.',
    type: 'warning'
  }
];

export function MarketData() {
  const [marketData, setMarketData] = useState<MarketAsset[]>(mockMarketData);
  const [selectedType, setSelectedType] = useState<'all' | 'stock' | 'crypto' | 'commodity'>('all');
  const { toast } = useToast();

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMarketData(prev => prev.map(asset => ({
        ...asset,
        price: asset.price * (1 + (Math.random() * 0.002 - 0.001)),
        change: asset.price * (Math.random() * 0.004 - 0.002),
        changePercent: (Math.random() * 0.4 - 0.2)
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Show important alerts
    alerts.forEach(alert => {
      toast({
        title: `${alert.asset} Alert`,
        description: alert.message,
        variant: alert.type === 'warning' ? 'destructive' : 'default'
      });
    });
  }, []);

  const filteredData = marketData.filter(
    asset => selectedType === 'all' || asset.type === selectedType
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['all', 'stock', 'crypto', 'commodity'].map(type => (
          <Badge
            key={type}
            variant={selectedType === type ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedType(type as any)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredData.map((asset) => (
          <Card key={asset.name} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{asset.name}</h3>
                <p className="text-2xl font-bold mt-1">
                  ₹{asset.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
              {asset.changePercent >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
            </div>
            <div className={`text-sm mt-2 ${asset.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
              ({asset.change >= 0 ? '+' : ''}
              ₹{asset.change.toLocaleString(undefined, { maximumFractionDigits: 2 })})
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="font-semibold flex items-center gap-2 mb-3">
          <Bell className="w-5 h-5 text-blue-600" />
          Market Alerts
        </h3>
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div key={index} className="flex items-start gap-2">
              <AlertTriangle className={`w-5 h-5 ${
                alert.type === 'warning' ? 'text-orange-500' :
                alert.type === 'opportunity' ? 'text-green-500' : 'text-blue-500'
              }`} />
              <div>
                <p className="font-medium">{alert.asset}</p>
                <p className="text-sm text-gray-600">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 