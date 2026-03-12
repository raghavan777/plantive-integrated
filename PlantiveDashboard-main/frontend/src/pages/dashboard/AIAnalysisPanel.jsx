import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, AlertTriangle, CheckCircle, XCircle, Download, BarChart3 } from 'lucide-react'
import { getSubmissions } from '../../services/api/submissions.api'

const AIAnalysisPanel = () => {
  const [analysisData, setAnalysisData] = useState([])
  const [showGrowthChart, setShowGrowthChart] = useState(false)
  const navigate = useNavigate() // Add this hook

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getSubmissions();
        const data = res.data || (Array.isArray(res) ? res : []);
        
        const mappedAnalysis = data.map((sub, idx) => {
          const capFirst = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
          const gStage = capFirst(sub.plot?.cropDetails?.growthStage) || 'Vegetative';
          const createdDate = new Date(sub.createdAt);
          const daysInStage = Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24));
          const confidence = sub.aiResult?.confidenceScore || 85;
          const healthScore = sub.aiResult?.healthScore || 80;
          
          return {
            id: sub._id || `analysis-${idx}`,
            imageUrl: typeof sub.images?.[0] === 'string' ? sub.images[0] : (sub.images?.[0]?.url || 'https://images.unsplash.com/photo-1592913406800-4b80a8ed848f?w=150&h=150&fit=crop'),
            farmerName: sub.farmer?.name || 'Unknown Farmer',
            crop: capFirst(sub.plot?.cropType) || 'Unknown Crop',
            stage: gStage,
            confidence: confidence,
            healthScore: healthScore,
            stressDetected: sub.status === 'verified' ? 'None' : 'Potential Stress',
            anomalies: sub.aiResult?.pestDetected ? ['Pest Observed'] : [],
            timestamp: sub.createdAt || new Date().toISOString(),
            growthData: {
              currentStage: gStage,
              daysInStage: daysInStage,
              nextStage: 'Harvesting',
              estimatedDaysToNext: Math.max(0, 30 - daysInStage),
              growthRate: healthScore >= 80 ? 'Optimal' : 'Slow',
              uvExposure: 4,
              riskLevel: sub.status === 'verified' ? 'Low' : 'Moderate'
            }
          };
        });
        setAnalysisData(mappedAnalysis);
      } catch (err) {
        console.error('Failed to load analysis data:', err);
      }
    };
    loadData();
  }, [])

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getGrowthRateColor = (rate) => {
    switch (rate.toLowerCase()) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'optimal': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'slow': return 'text-yellow-600 bg-yellow-100'
      case 'poor': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const handleViewGrowthStage = (analysis) => {
    // Navigate to growth analysis page with analysis data
    navigate('/dashboard/growth-analysis', { 
      state: { 
        selectedAnalysis: analysis,
        allAnalysis: analysisData 
      } 
    })
  }

  const handleViewAllGrowthStages = () => {
    // Navigate to growth analysis page with all data
    navigate('/dashboard/growth-analysis', { 
      state: { 
        allAnalysis: analysisData 
      } 
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Analysis Panel</h1>
          <p className="text-gray-600">Real-time crop health analysis and growth monitoring</p>
        </div>
        <div className="flex gap-3">
          {/* View All Growth Stages Button - Opens new page */}
          <button 
            onClick={handleViewAllGrowthStages}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View Growth Analysis
          </button>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:border-green-500 hover:text-green-600 transition-all">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Analysis</p>
              <p className="text-2xl font-bold text-gray-900">{analysisData.length}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-xs text-green-600 font-medium">+100% this week</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Confidence</p>
              <p className="text-2xl font-bold text-gray-900">{analysisData.filter(a => a.confidence >= 80).length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-xs text-gray-600">{Math.round((analysisData.filter(a => a.confidence >= 80).length / (analysisData.length || 1)) * 100)}% of total</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Needs Review</p>
              <p className="text-2xl font-bold text-gray-900">{analysisData.filter(a => a.confidence < 80).length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="mt-2 text-xs text-yellow-600">Low confidence</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stress Detected</p>
              <p className="text-2xl font-bold text-gray-900">{analysisData.filter(a => a.stressDetected !== 'None').length}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <div className="mt-2 text-xs text-red-600">Requires attention</div>
        </div>
      </div>

      {/* Analysis Results */}
      <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-green-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent AI Analysis Results</h2>
        </div>
        
        <div className="divide-y divide-green-50">
          {analysisData.map((analysis) => (
            <div key={analysis.id} className="p-6 hover:bg-green-50 transition-colors">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Image */}
                <div className="shrink-0">
                  <div className="w-24 h-24 rounded-xl bg-gray-200 border border-green-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Crop Image</span>
                  </div>
                </div>

                {/* Analysis Details */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Farmer</p>
                    <p className="font-semibold text-gray-900">{analysis.farmerName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Stage: {analysis.growthData.currentStage}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600">Crop & Progress</p>
                    <p className="font-semibold text-gray-900">{analysis.crop}</p>
                    <p className={`text-xs mt-1 px-2 py-1 rounded-full ${getGrowthRateColor(analysis.growthData.growthRate)}`}>
                      {analysis.growthData.growthRate}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600">AI Confidence</p>
                    <p className={`font-semibold ${getConfidenceColor(analysis.confidence)}`}>
                      {analysis.confidence}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      UV: {analysis.growthData.uvExposure}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600">Health Score</p>
                    <p className={`font-semibold ${getHealthColor(analysis.healthScore)}`}>
                      {analysis.healthScore}/100
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Next: {analysis.growthData.nextStage} in {analysis.growthData.estimatedDaysToNext}d
                    </p>
                  </div>
                </div>
              </div>

              {/* Growth Progress */}
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-blue-700 font-medium">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Growth Progress: {analysis.growthData.currentStage}
                  </div>
                  <div className="text-sm text-blue-600">
                    {analysis.growthData.daysInStage} days in current stage
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-gray-600">Next Stage:</span>
                    <span className="ml-1 font-medium">{analysis.growthData.nextStage}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Est. Days:</span>
                    <span className="ml-1 font-medium">{analysis.growthData.estimatedDaysToNext}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Risk Level:</span>
                    <span className={`ml-1 font-medium ${
                      analysis.growthData.riskLevel === 'Low' ? 'text-green-600' :
                      analysis.growthData.riskLevel === 'Moderate' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {analysis.growthData.riskLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stress & Anomalies */}
              {analysis.stressDetected !== 'None' && (
                <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-center text-red-700 font-medium">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Stress Detected: {analysis.stressDetected}
                  </div>
                  {analysis.anomalies.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-red-600 font-medium">Anomalies:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {analysis.anomalies.map((anomaly, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-lg"
                          >
                            {anomaly}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 flex gap-3">
                <button 
                  onClick={() => handleViewGrowthStage(analysis)}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  View Growth Stage Analysis
                </button>
                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all">
                  Compare with History
                </button>
                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg hover:border-purple-500 hover:text-purple-600 transition-all">
                  Download Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Model Status */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Model Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="text-2xl font-bold text-green-600">98.2%</div>
            <div className="text-sm text-gray-600">Crop ID Accuracy</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">96.7%</div>
            <div className="text-sm text-gray-600">Stage Detection</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">94.3%</div>
            <div className="text-sm text-gray-600">Stress Detection</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">92.8%</div>
            <div className="text-sm text-gray-600">Growth Prediction</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIAnalysisPanel