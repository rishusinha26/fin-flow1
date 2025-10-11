import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const SpendingCharts = () => {
  const categoryData = [
    { name: 'Food', value: 450, color: '#8884d8' },
    { name: 'Transportation', value: 320, color: '#82ca9d' },
    { name: 'Entertainment', value: 180, color: '#ffc658' },
    { name: 'Bills', value: 520, color: '#ff7300' },
    { name: 'Shopping', value: 230, color: '#8dd1e1' },
    { name: 'Healthcare', value: 120, color: '#d084d0' }
  ];

  const monthlyData = [
    { month: 'Jan', spending: 1580 },
    { month: 'Feb', spending: 1720 },
    { month: 'Mar', spending: 1650 },
    { month: 'Apr', spending: 1820 },
    { month: 'May', spending: 1680 }
  ];

  const dailyData = [
    { day: 'Mon', spending: 120 },
    { day: 'Tue', spending: 85 },
    { day: 'Wed', spending: 200 },
    { day: 'Thu', spending: 95 },
    { day: 'Fri', spending: 180 },
    { day: 'Sat', spending: 250 },
    { day: 'Sun', spending: 140 }
  ];

  const heatmapData = [
    { day: 'Mon', '6-9': 45, '9-12': 120, '12-15': 85, '15-18': 95, '18-21': 180, '21-24': 30 },
    { day: 'Tue', '6-9': 35, '9-12': 90, '12-15': 110, '15-18': 75, '18-21': 140, '21-24': 25 },
    { day: 'Wed', '6-9': 50, '9-12': 200, '12-15': 95, '15-18': 120, '18-21': 160, '21-24': 40 },
    { day: 'Thu', '6-9': 40, '9-12': 80, '12-15': 70, '15-18': 65, '18-21': 150, '21-24': 35 },
    { day: 'Fri', '6-9': 55, '9-12': 110, '12-15': 130, '15-18': 180, '18-21': 220, '21-24': 60 },
    { day: 'Sat', '6-9': 30, '9-12': 80, '12-15': 150, '15-18': 200, '18-21': 280, '21-24': 80 },
    { day: 'Sun', '6-9': 25, '9-12': 60, '12-15': 120, '15-18': 140, '18-21': 190, '21-24': 45 }
  ];

  const getHeatmapColor = (value: number) => {
    if (value < 50) return '#e8f5e8';
    if (value < 100) return '#a8e6a8';
    if (value < 150) return '#69d669';
    if (value < 200) return '#2eb82e';
    return '#1a751a';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">
            ₹{payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 bg-white shadow-lg border-0 rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        📊 Spending Analysis
      </h2>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Trend</TabsTrigger>
          <TabsTrigger value="daily">Daily Trend</TabsTrigger>
          <TabsTrigger value="heatmap">Expense Heatmap</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Spending by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category Breakdown */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Category Breakdown</h3>
              <div className="space-y-3">
                {categoryData.map((category) => (
                  <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium text-gray-700">{category.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800">₹{category.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="monthly">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Monthly Spending Trend</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="spending" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                📈 <strong>Insight:</strong> Your spending has been relatively stable, with a slight increase in April. Consider reviewing your April expenses to identify areas for optimization.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="daily">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Daily Spending Trend (This Week)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="spending" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                📊 <strong>Daily Insight:</strong> Your weekend spending tends to be higher. Saturday shows the highest spending at ₹250. Consider planning weekend activities within budget.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="heatmap">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Spending Heatmap by Day & Time</h3>
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Time Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  <div className="text-center text-sm font-medium text-gray-600 py-2">Time</div>
                  {['6-9 AM', '9-12 PM', '12-3 PM', '3-6 PM', '6-9 PM', '9-12 AM'].map((time) => (
                    <div key={time} className="text-center text-sm font-medium text-gray-600 py-2">
                      {time}
                    </div>
                  ))}
                </div>
                
                {/* Heatmap Grid */}
                <div className="space-y-1">
                  {heatmapData.map((dayData) => (
                    <div key={dayData.day} className="grid grid-cols-7 gap-1">
                      <div className="text-center text-sm font-medium text-gray-600 py-3 flex items-center justify-center">
                        {dayData.day}
                      </div>
                      {Object.entries(dayData).filter(([key]) => key !== 'day').map(([timeSlot, value]) => (
                        <div
                          key={timeSlot}
                          className="h-12 rounded flex items-center justify-center text-xs font-medium text-gray-700 hover:scale-105 transition-transform cursor-pointer border border-gray-200"
                          style={{ backgroundColor: getHeatmapColor(value as number) }}
                          title={`${dayData.day} ${timeSlot}: ₹${value}`}
                        >
                          ₹{value}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                
                {/* Legend */}
                <div className="mt-6 flex items-center justify-center gap-4">
                  <span className="text-sm text-gray-600">Less</span>
                  <div className="flex gap-1">
                    {[0, 75, 125, 175, 225].map((value) => (
                      <div
                        key={value}
                        className="w-4 h-4 rounded border border-gray-200"
                        style={{ backgroundColor: getHeatmapColor(value) }}
                        title={`₹${value}+`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">More</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-800">
                🔥 <strong>Heatmap Insight:</strong> Your spending peaks during 6-9 PM on weekends, especially Saturday. Consider setting spending alerts for high-activity periods to stay within budget.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default SpendingCharts;
