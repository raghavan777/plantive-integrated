import React, { useState, useEffect } from 'react';
import { getFarmers } from '../../services/api/farmers.api';
import { getSubmissions } from '../../services/api/submissions.api';
import { getPlots } from '../../services/api/plots.api';
import { getUsers } from '../../services/api/users.api';
import { getDashboardStats } from '../../services/api/officials.api';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Image,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  MapPin,
  Calendar,
  RefreshCw,
  Download,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const Overview = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemStatus, setSystemStatus] = useState({});
  const [regionalCoverage, setRegionalCoverage] = useState([]);
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsRes = await getDashboardStats();
      const dashboardData = statsRes.data;

      setStats({
        totalFarmers: dashboardData.totalFarmers,
        farmersChange: 5, // Keep static for now or track trend
        imagesAnalyzed: dashboardData.imagesAnalyzed,
        imagesChange: 8,
        activeOfficers: dashboardData.activeOfficers,
        officersChange: 0,
        damageCases: dashboardData.damageCases,
        damageChange: -2,
        pendingApprovals: dashboardData.pendingApprovals,
        completedVisits: dashboardData.completedVisits,
        aiAccuracy: dashboardData.aiAccuracy,
        coverageArea: dashboardData.totalArea
      });

      setRecentActivity(dashboardData.recentActivity.length > 0 ? dashboardData.recentActivity : [
        { id: 'empty', title: 'No recent activity', description: 'Data will appear here once farmers submit reports.', status: 'operational', icon: 'ℹ️', time: '' }
      ]);

      setSystemStatus(dashboardData.systemStatus);
      setRegionalCoverage(dashboardData.regionalCoverage || []);

    } catch (error) {
      console.error("Error fetching overview data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refreshData = () => {
    fetchDashboardData();
  };

  const exportReport = () => {
    // Simulate export functionality
    alert('Exporting dashboard report...');
  };

  const StatCard = ({ title, value, change, icon, color, suffix = '', gradientClass = '' }) => {
    const isPositive = change >= 0;
    
    return (
      <div className={`glass-panel p-6 rounded-3xl hover-lift relative overflow-hidden ${gradientClass}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
            <p className={`text-4xl font-bold font-heading mt-2 text-gray-800`}>
              {value}{suffix}
            </p>
            <div className={`flex items-center mt-3 text-[13px] font-bold px-2.5 py-1 rounded-full w-max ${
              isPositive ? 'bg-brand-100 text-brand-700' : 'bg-red-100 text-red-700'
            }`}>
              {isPositive ? 
                <ArrowUpRight className="h-4 w-4 mr-0.5 stroke-[3]" /> : 
                <ArrowDownRight className="h-4 w-4 mr-0.5 stroke-[3]" />
              }
              {Math.abs(change)}% {isPositive ? 'increase' : 'decrease'}
            </div>
          </div>
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm ${color.replace('text-', 'bg-').replace('-600', '-100')} ${color}`}>
            <span className="text-[28px]">{icon}</span>
          </div>
        </div>
      </div>
    );
  };

  const StatusIndicator = ({ status }) => {
    const config = {
      operational: { color: 'text-green-600', bg: 'bg-green-100', label: 'Operational' },
      active: { color: 'text-green-600', bg: 'bg-green-100', label: 'Active' },
      healthy: { color: 'text-green-600', bg: 'bg-green-100', label: 'Healthy' },
      pending: { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
      warning: { color: 'text-orange-600', bg: 'bg-orange-100', label: 'Warning' },
      error: { color: 'text-red-600', bg: 'bg-red-100', label: 'Error' }
    };

    const { color, bg, label } = config[status] || config.pending;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bg} ${color}`}>
        <div className={`w-2 h-2 rounded-full ${color} mr-1`}></div>
        {label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/40 p-6 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-heading">Dashboard Overview</h1>
          <p className="text-gray-500 font-medium mt-1">Welcome back to PMFBY CROPIC Platform</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={refreshData}
            className="flex items-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-brand-300 hover:text-brand-600 hover:shadow-sm hover:-translate-y-0.5 transition-all"
          >
            <RefreshCw className="h-[18px] w-[18px] mr-2" />
            Refresh
          </button>
          <button 
            onClick={exportReport}
            className="flex items-center px-4 py-2.5 bg-brand-600/90 hover:bg-brand-600 text-white font-semibold rounded-xl shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30 hover:-translate-y-0.5 transition-all"
          >
            <Download className="h-[18px] w-[18px] mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Farmers"
          value={stats.totalFarmers}
          change={stats.farmersChange}
          icon="👨‍🌾"
          color="text-green-600"
        />
        <StatCard
          title="Images Analyzed"
          value={stats.imagesAnalyzed}
          change={stats.imagesChange}
          icon="📸"
          color="text-blue-600"
        />
        <StatCard
          title="Active Officers"
          value={stats.activeOfficers}
          change={stats.officersChange}
          icon="👮"
          color="text-purple-600"
        />
        <StatCard
          title="Damage Cases"
          value={stats.damageCases}
          change={stats.damageChange}
          icon="⚠️"
          color="text-red-600"
        />
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-3xl hover-lift">
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-500 font-heading">{stats.pendingApprovals}</div>
            <div className="text-sm font-semibold text-gray-500 tracking-wide uppercase mt-2">Pending Approvals</div>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-3xl hover-lift bg-gradient-to-br from-white to-brand-50/50">
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-600 font-heading">{stats.completedVisits}</div>
            <div className="text-sm font-semibold text-gray-500 tracking-wide uppercase mt-2">Completed Visits</div>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-3xl hover-lift">
          <div className="text-center">
            <div className="text-4xl font-bold text-accent-teal font-heading">{stats.aiAccuracy}%</div>
            <div className="text-sm font-semibold text-gray-500 tracking-wide uppercase mt-2">AI Accuracy</div>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-3xl hover-lift">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-500 font-heading">{stats.coverageArea}%</div>
            <div className="text-sm font-semibold text-gray-500 tracking-wide uppercase mt-2">Coverage Area</div>
          </div>
        </div>
      </div>

      {/* Quick Actions and Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="glass-panel p-7 rounded-3xl h-full flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 font-heading mb-6 flex items-center gap-3">
            <div className="p-2 bg-brand-100 text-brand-600 rounded-xl">
              <Clock className="h-5 w-5" />
            </div>
            Quick Actions
          </h3>
          <div className="space-y-3.5 flex-1">
            <button className="w-full text-left p-4 rounded-2xl border border-gray-100/80 bg-white/40 hover:bg-white/80 hover:border-brand-200 hover:shadow-[0_4px_20px_-4px_rgba(57,150,60,0.15)] hover:-translate-y-0.5 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-[15px] text-gray-800 font-heading">View Pending Approvals</div>
                  <div className="text-[13px] font-medium text-gray-500 mt-0.5">{stats.pendingApprovals} approvals waiting</div>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-50 transition-colors">
                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-brand-600 stroke-[3]" />
              </div>
            </button>
            
            <button className="w-full text-left p-4 rounded-2xl border border-gray-100/80 bg-white/40 hover:bg-white/80 hover:border-brand-200 hover:shadow-[0_4px_20px_-4px_rgba(57,150,60,0.15)] hover:-translate-y-0.5 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gradient-to-br from-red-50 to-red-100/50 border border-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <div className="font-bold text-[15px] text-gray-800 font-heading">Check Damage Alerts</div>
                  <div className="text-[13px] font-medium text-gray-500 mt-0.5">{stats.damageCases} active cases</div>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-50 transition-colors">
                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-brand-600 stroke-[3]" />
              </div>
            </button>
            <button className="w-full text-left p-4 rounded-2xl border border-gray-100/80 bg-white/40 hover:bg-white/80 hover:border-brand-200 hover:shadow-[0_4px_20px_-4px_rgba(57,150,60,0.15)] hover:-translate-y-0.5 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="font-bold text-[15px] text-gray-800 font-heading">Generate Reports</div>
                  <div className="text-[13px] font-medium text-gray-500 mt-0.5">Real-time analytics</div>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-50 transition-colors">
                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-brand-600 stroke-[3]" />
              </div>
            </button>
            <button className="w-full text-left p-4 rounded-2xl border border-gray-100/80 bg-white/40 hover:bg-white/80 hover:border-brand-200 hover:shadow-[0_4px_20px_-4px_rgba(57,150,60,0.15)] hover:-translate-y-0.5 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="font-bold text-[15px] text-gray-800 font-heading">Monitor Field Officers</div>
                  <div className="text-[13px] font-medium text-gray-500 mt-0.5">{stats.activeOfficers} officers active</div>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-50 transition-colors">
                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-brand-600 stroke-[3]" />
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-panel p-7 rounded-3xl h-full flex flex-col lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-800 font-heading mb-6 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Calendar className="h-5 w-5" />
            </div>
            Recent Activity
          </h3>
          <div className="space-y-3 px-1">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-3.5 rounded-2xl hover:bg-white/60 hover:shadow-sm border border-transparent hover:border-brand-100/50 transition-all cursor-pointer group">
                <div className="text-[22px] p-2.5 rounded-xl bg-gray-50 group-hover:bg-brand-50 transition-colors shadow-sm">{activity.icon}</div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="font-bold text-[14px] text-gray-800 font-heading">{activity.title}</div>
                  <div className="text-[13px] text-gray-500 mt-0.5">{activity.description}</div>
                  <div className="text-[11px] font-semibold tracking-wide text-gray-400 mt-1.5 uppercase">{activity.time}</div>
                </div>
                <div className="pt-1">
                  <StatusIndicator status={activity.status} />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 text-center text-[14px] text-brand-600 hover:text-brand-700 font-bold py-3 rounded-xl hover:bg-brand-50/50 transition-colors flex items-center justify-center gap-2 group">
            View All Activity <ArrowUpRight className="h-4 w-4 text-brand-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform stroke-3" />
          </button>
        </div>

        {/* System Status */}
        <div className="glass-panel p-7 rounded-3xl h-full flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 font-heading mb-6 flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Shield className="h-5 w-5" />
            </div>
            System Status
          </h3>
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between p-4 bg-white/40 border border-gray-100/80 rounded-2xl hover:border-brand-200 transition-colors">
              <div>
                <div className="font-bold text-[14px] text-gray-800 font-heading">AI Analysis</div>
                <div className="text-[12px] font-medium text-gray-500 mt-0.5">Latency: {systemStatus.aiAnalysis?.latency}</div>
              </div>
              <StatusIndicator status={systemStatus.aiAnalysis?.status} />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/40 border border-gray-100/80 rounded-2xl hover:border-brand-200 transition-colors">
              <div>
                <div className="font-bold text-[14px] text-gray-800 font-heading">Image Processing</div>
                <div className="text-[12px] font-medium text-gray-500 mt-0.5">Queue: {systemStatus.imageProcessing?.queue} items</div>
              </div>
              <StatusIndicator status={systemStatus.imageProcessing?.status} />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/40 border border-gray-100/80 rounded-2xl hover:border-brand-200 transition-colors">
              <div>
                <div className="font-bold text-[14px] text-gray-800 font-heading">Data Sync</div>
                <div className="text-[12px] font-medium text-gray-500 mt-0.5">Last: {systemStatus.dataSync?.lastSync}</div>
              </div>
              <StatusIndicator status={systemStatus.dataSync?.status} />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/40 border border-gray-100/80 rounded-2xl hover:border-brand-200 transition-colors">
              <div>
                <div className="font-bold text-[14px] text-gray-800 font-heading">API Health</div>
                <div className="text-[12px] font-medium text-gray-500 mt-0.5">Uptime: {systemStatus.apiHealth?.uptime}</div>
              </div>
              <StatusIndicator status={systemStatus.apiHealth?.status} />
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-brand-50 rounded-2xl border border-emerald-100/50 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-brand-400/10 rounded-full blur-xl"></div>
            <div className="flex items-center gap-3 text-emerald-800 relative z-10">
              <div className="p-1.5 bg-emerald-100 rounded-full text-emerald-600">
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="text-[14px] font-bold font-heading tracking-wide">All systems operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-7 hover-lift h-full flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 font-heading mb-6 flex items-center gap-3">
             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <TrendingUp className="h-5 w-5" />
            </div>
            Performance Trends
          </h3>
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/50 transition-colors">
              <span className="text-[14px] font-semibold text-gray-600">Image Processing Speed</span>
              <span className="font-bold text-[14px] text-brand-600 bg-brand-50 px-3 py-1 rounded-full">+15% faster</span>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/50 transition-colors bg-white/40">
              <span className="text-[14px] font-semibold text-gray-600">Claim Approval Time</span>
              <span className="font-bold text-[14px] text-brand-600 bg-brand-50 px-3 py-1 rounded-full">-40% reduction</span>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/50 transition-colors">
              <span className="text-[14px] font-semibold text-gray-600">Farmer Satisfaction</span>
              <span className="font-bold text-[14px] text-brand-600 bg-brand-50 px-3 py-1 rounded-full">92% positive</span>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/50 transition-colors bg-white/40">
              <span className="text-[14px] font-semibold text-gray-600">AI Accuracy Rate</span>
              <span className="font-bold text-[14px] text-brand-600 bg-brand-50 px-3 py-1 rounded-full">94.7% accurate</span>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-7 hover-lift h-full flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 font-heading mb-6 flex items-center gap-3">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <MapPin className="h-5 w-5" />
            </div>
            Regional Coverage
          </h3>
          <div className="space-y-4 flex-1">
            {regionalCoverage.length > 0 ? (
              regionalCoverage.map((region, idx) => (
                <div key={idx} className={`flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/50 transition-colors ${idx % 2 === 1 ? 'bg-white/40' : ''}`}>
                  <span className="text-[14px] font-semibold text-gray-600">{region.name}</span>
                  <div className="flex items-center gap-3">
                     <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 rounded-full" style={{width: `${region.percentage}%`}}></div>
                     </div>
                     <span className="font-bold text-[14px] text-blue-600 tabular-nums">{region.percentage}%</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 italic">
                No regional data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;