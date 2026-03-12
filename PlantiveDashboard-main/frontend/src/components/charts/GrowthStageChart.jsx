import React, { useState, useEffect } from 'react';
import { getPlots } from '../../services/api/plots.api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Eye,
  ZoomIn,
  ZoomOut,
  Crop,
  Droplets,
  Sun,
  Thermometer
} from 'lucide-react';

const GrowthStageChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('bar'); // 'bar', 'line', 'area', 'pie'
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'quarter', 'year'
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedStage, setSelectedStage] = useState(null);
  const [uvData, setUvData] = useState({});
  const [showUvOverlay, setShowUvOverlay] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Mock data with UV exposure and growth metrics
  const stageColors = {
    'Germination': '#4F46E5',
    'Seedling': '#06B6D4',
    'Vegetative': '#10B981',
    'Flowering': '#F59E0B',
    'Fruiting': '#EF4444',
    'Maturation': '#8B5CF6',
    'Harvest': '#EC4899',
    'default': '#10B981'
  };

  const crops = [
    { value: 'all', label: 'All Crops' },
    { value: 'wheat', label: 'Wheat' },
    { value: 'rice', label: 'Rice' },
    { value: 'cotton', label: 'Cotton' },
    { value: 'soybean', label: 'Soybean' },
    { value: 'maize', label: 'Maize' }
  ];

  const uvImpactData = [
    { name: 'Low', value: 25, color: '#10B981' },
    { name: 'Moderate', value: 30, color: '#F59E0B' },
    { name: 'High', value: 25, color: '#EF4444' },
    { name: 'Very High', value: 15, color: '#DC2626' },
    { name: 'Extreme', value: 5, color: '#7F1D1D' }
  ];

  useEffect(() => {
    const fetchRealData = async () => {
      setLoading(true);
      try {
        const res = await getPlots();
        const plotData = res.data || (Array.isArray(res) ? res : []);
        
        const stagesMap = {};
        
        plotData.forEach(plot => {
          // If a crop filter is active, skip non-matching crops
          if (selectedCrop !== 'all' && plot.cropDetails?.name?.toLowerCase() !== selectedCrop.toLowerCase()) {
            return;
          }

          let stage = plot.cropDetails?.growthStage || 'Vegetative';
          // Capitalize first letter to match design
          stage = stage.charAt(0).toUpperCase() + stage.slice(1);
          
          if (!stagesMap[stage]) {
            stagesMap[stage] = {
              stage: stage,
              plants: 0,
              healthy: 0,
              stressed: 0,
              uvExposure: Math.floor(Math.random() * 5) + 2,
              growthRate: Math.floor(Math.random() * 50) + 30,
              temperature: 25,
              moisture: 60,
              duration: '10-20 days',
              successRate: 90,
              uvImpact: 'Moderate',
              color: stageColors[stage] || stageColors['default']
            };
          }
          const isHealthy = plot.healthStatus !== 'Poor';
          stagesMap[stage].plants += 100; // scaling up for chart visuals
          if (isHealthy) stagesMap[stage].healthy += 100;
          else stagesMap[stage].stressed += 100;
        });

        const aggregatedData = Object.values(stagesMap);
        setData(aggregatedData);

        setUvData({
          averageUv: 5.3,
          maxUv: 7.5,
          minUv: 2.1,
          optimalRange: '3.0-5.0',
          riskLevel: 'Moderate',
          recommendations: [
            'Provide shade during peak UV hours (11 AM - 3 PM)',
            'Increase irrigation frequency during high UV periods',
            'Consider UV-protective crop covers for sensitive stages'
          ]
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to load growth chart data", err);
        setLoading(false);
      }
    };

    fetchRealData();
  }, [selectedCrop, timeRange]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          <div className="space-y-1 mt-2">
            <p className="text-sm">
              <span className="text-gray-600">Plants:</span>{' '}
              <span className="font-semibold">{data.plants.toLocaleString()}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Healthy:</span>{' '}
              <span className="font-semibold text-green-600">{data.healthy.toLocaleString()}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Stressed:</span>{' '}
              <span className="font-semibold text-red-600">{data.stressed.toLocaleString()}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">UV Exposure:</span>{' '}
              <span className="font-semibold text-purple-600">{data.uvExposure} UV Index</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Growth Rate:</span>{' '}
              <span className="font-semibold text-blue-600">{data.growthRate}%</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Success Rate:</span>{' '}
              <span className="font-semibold text-green-600">{data.successRate}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const UvImpactTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm text-gray-600">{payload[0].value}% of crops</p>
        </div>
      );
    }
    return null;
  };

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const exportChart = () => {
    // Simulate export functionality
    alert('Exporting growth stage data...');
  };

  const getUvColor = (uvValue) => {
    if (uvValue <= 2) return '#10B981'; // Low - Green
    if (uvValue <= 5) return '#F59E0B'; // Moderate - Yellow
    if (uvValue <= 7) return '#EF4444'; // High - Red
    return '#7F1D1D'; // Extreme - Dark Red
  };

  const getUvRiskLevel = (uvValue) => {
    if (uvValue <= 2) return 'Low';
    if (uvValue <= 5) return 'Moderate';
    if (uvValue <= 7) return 'High';
    return 'Extreme';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading growth stage data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Crop Growth Stage Analysis</h2>
          <p className="text-gray-600">Monitor plant development and UV exposure impact</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUvOverlay(!showUvOverlay)}
            className={`flex items-center px-4 py-2 rounded-xl transition-all ${
              showUvOverlay
                ? 'bg-purple-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:border-purple-500'
            }`}
          >
            <Sun className="h-4 w-4 mr-2" />
            UV Analysis
          </button>
          <button
            onClick={exportChart}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={refreshData}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:border-green-500 hover:text-green-600 transition-all"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {crops.map(crop => (
                <option key={crop.value} value={crop.value}>
                  {crop.label}
                </option>
              ))}
            </select>
            
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>

            <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
              <button
                onClick={() => setChartType('bar')}
                className={`flex-1 flex items-center justify-center p-2 rounded-lg transition-all ${
                  chartType === 'bar' ? 'bg-white shadow-sm text-green-600' : 'text-gray-600'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`flex-1 flex items-center justify-center p-2 rounded-lg transition-all ${
                  chartType === 'line' ? 'bg-white shadow-sm text-green-600' : 'text-gray-600'
                }`}
              >
                <LineChartIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`flex-1 flex items-center justify-center p-2 rounded-lg transition-all ${
                  chartType === 'area' ? 'bg-white shadow-sm text-green-600' : 'text-gray-600'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => setChartType('pie')}
                className={`flex-1 flex items-center justify-center p-2 rounded-lg transition-all ${
                  chartType === 'pie' ? 'bg-white shadow-sm text-green-600' : 'text-gray-600'
                }`}
              >
                <PieChartIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              className="p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-600 min-w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              className="p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Growth Stage Distribution</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Healthy Plants</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Stressed Plants</span>
                </div>
                {showUvOverlay && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>UV Exposure</span>
                  </div>
                )}
              </div>
            </div>

            <div className="h-80" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="healthy" name="Healthy Plants" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="stressed" name="Stressed Plants" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    {showUvOverlay && (
                      <Bar dataKey="uvExposure" name="UV Index" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    )}
                  </BarChart>
                ) : chartType === 'line' ? (
                  <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="healthy" name="Healthy Plants" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981' }} />
                    <Line type="monotone" dataKey="growthRate" name="Growth Rate %" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6' }} />
                    {showUvOverlay && (
                      <Line type="monotone" dataKey="uvExposure" name="UV Index" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#8B5CF6' }} />
                    )}
                  </LineChart>
                ) : chartType === 'area' ? (
                  <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area type="monotone" dataKey="healthy" name="Healthy Plants" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="stressed" name="Stressed Plants" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                    {showUvOverlay && (
                      <Area type="monotone" dataKey="uvExposure" name="UV Index" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                    )}
                  </AreaChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ stage, percent }) => `${stage}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="plants"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* UV Analysis Sidebar */}
        <div className="space-y-6">
          {/* UV Impact Summary */}
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Sun className="h-5 w-5 text-yellow-600" />
              UV Impact Analysis
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{uvData.averageUv}</div>
                  <div className="text-gray-600">Avg UV Index</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{uvData.maxUv}</div>
                  <div className="text-gray-600">Max UV</div>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Risk Level</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    uvData.riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                    uvData.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                    uvData.riskLevel === 'High' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {uvData.riskLevel}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Optimal Range: <span className="font-semibold">{uvData.optimalRange} UV</span>
                </div>
              </div>

              {/* UV Impact Distribution */}
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={uvImpactData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {uvImpactData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<UvImpactTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">UV Protection Recommendations</h3>
            <div className="space-y-3">
              {uvData.recommendations?.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Sun className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-yellow-800">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stage Details */}
          {selectedStage && (
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Stage Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{selectedStage.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Temperature:</span>
                  <span className="font-medium">{selectedStage.temperature}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Moisture:</span>
                  <span className="font-medium">{selectedStage.moisture}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">UV Impact:</span>
                  <span className={`font-medium ${
                    selectedStage.uvImpact === 'Low' ? 'text-green-600' :
                    selectedStage.uvImpact === 'Moderate' ? 'text-yellow-600' :
                    selectedStage.uvImpact === 'High' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {selectedStage.uvImpact}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 text-center">
          <div className="text-2xl font-bold text-green-600">{data.reduce((sum, stage) => sum + stage.healthy, 0).toLocaleString()}</div>
          <div className="text-sm text-gray-600 mt-1">Total Healthy Plants</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">{data[data.length - 1]?.growthRate}%</div>
          <div className="text-sm text-gray-600 mt-1">Current Growth Rate</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 text-center">
          <div className="text-2xl font-bold text-purple-600">{uvData.averageUv}</div>
          <div className="text-sm text-gray-600 mt-1">Average UV Index</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 text-center">
          <div className="text-2xl font-bold text-orange-600">{data.reduce((sum, stage) => sum + stage.stressed, 0).toLocaleString()}</div>
          <div className="text-sm text-gray-600 mt-1">Total Stressed Plants</div>
        </div>
      </div>
    </div>
  );
};

export default GrowthStageChart;