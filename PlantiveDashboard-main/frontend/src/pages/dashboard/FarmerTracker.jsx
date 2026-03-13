import React, { useState, useEffect } from 'react'
import { getFarmers } from '../../services/api/farmers.api'
import { 
  Search, Filter, Download, Eye, User, MapPin, Calendar, 
  CheckCircle, XCircle, Clock, AlertCircle, TrendingUp, 
  BarChart3, Phone, Mail, ChevronDown, ChevronUp, 
  RefreshCw, ExternalLink, FileText, Image, Shield,
  MoreVertical, Edit, Send, MessageCircle
} from 'lucide-react'

const FarmerTracker = () => {
  const [farmers, setFarmers] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFarmer, setSelectedFarmer] = useState(null)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [expandedRows, setExpandedRows] = useState(new Set())

  useEffect(() => {
    const fetchRealFarmers = async () => {
      try {
        const res = await getFarmers();
        const data = res.data || (Array.isArray(res) ? res : []);
        
        const mappedData = data.map(f => {
          const totalPlots = f.plots?.length || 0;
          const avgHealthScore = totalPlots > 0 
            ? Math.round(f.plots.reduce((acc, p) => acc + (p.healthScore || 0), 0) / totalPlots)
            : 0;
            
          // Simple progress calculation: plots with non-unknown health status
          const progress = totalPlots > 0
            ? Math.round((f.plots.filter(p => p.healthStatus && p.healthStatus !== 'unknown').length / totalPlots) * 100)
            : 0;

          return {
            id: f._id,
            name: f.name || 'Unknown',
            farmerId: f.farmerId || f.pmfbyId || f._id.substring(0, 8),
            phone: f.contact?.phone || 'N/A',
            email: f.contact?.email || 'N/A',
            village: f.location?.village || f.location?.address || 'N/A',
            district: f.location?.district || 'N/A',
            state: f.location?.state || 'N/A',
            totalPlots: totalPlots,
            totalArea: typeof f.totalArea === 'number' ? `${f.totalArea} hectares` : (f.totalArea || '0 hectares'),
            joinedDate: f.createdAt ? new Date(f.createdAt).toISOString().split('T')[0] : 'N/A',
            lastSubmission: f.updatedAt ? new Date(f.updatedAt).toISOString().split('T')[0] : null,
            submissionStatus: progress === 100 ? 'completed' : (progress > 0 ? 'pending' : 'not_started'),
            submissionStage: progress === 100 ? 'Verified' : 'Inspection',
            imageQuality: avgHealthScore > 80 ? 'excellent' : (avgHealthScore > 50 ? 'good' : 'poor'),
            aiConfidence: avgHealthScore || 85,
            status: f.status || 'active',
            crops: Array.isArray(f.crops) ? f.crops : (f.plots?.map(p => p.cropType) || ['Unknown']),
            progress: progress,
            submissions: [],
            officerAssigned: f.metadata?.get('assignedOfficer') || 'Unassigned',
            nextDeadline: f.metadata?.get('nextDeadline') || null,
            notes: f.notes || ''
          };
        });
        
        setFarmers(mappedData);
        if (mappedData.length > 0) setSelectedFarmer(mappedData[0]);
      } catch (error) {
        console.error("Failed to load farmers", error);
      }
    };

    fetchRealFarmers();
  }, [])

  const filters = [
    { value: 'all', label: 'All Farmers', count: farmers.length },
    { value: 'active', label: 'Active', count: farmers.filter(f => f.status === 'active').length },
    { value: 'completed', label: 'Completed', count: farmers.filter(f => f.submissionStatus === 'completed').length },
    { value: 'delayed', label: 'Delayed', count: farmers.filter(f => f.submissionStatus === 'delayed').length },
    { value: 'not_started', label: 'Not Started', count: farmers.filter(f => f.submissionStatus === 'not_started').length }
  ]

  const filteredFarmers = farmers.filter(farmer => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' ? farmer.status === 'active' : farmer.submissionStatus === filter)
    const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.farmerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.crops.some(crop => crop.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const sortedFarmers = [...filteredFarmers].sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy) {
      case 'name':
        aValue = a.name
        bValue = b.name
        break
      case 'progress':
        aValue = a.progress
        bValue = b.progress
        break
      case 'lastSubmission':
        aValue = new Date(a.lastSubmission || 0)
        bValue = new Date(b.lastSubmission || 0)
        break
      case 'aiConfidence':
        aValue = a.aiConfidence
        bValue = b.aiConfidence
        break
      default:
        aValue = a.name
        bValue = b.name
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700',
      completed: 'bg-green-100 text-green-700',
      delayed: 'bg-red-100 text-red-700',
      not_started: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      pending: 'bg-yellow-100 text-yellow-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getStatusIcon = (status) => {
    const icons = {
      active: CheckCircle,
      inactive: XCircle,
      completed: CheckCircle,
      delayed: AlertCircle,
      not_started: Clock,
      approved: CheckCircle,
      rejected: XCircle,
      pending: Clock
    }
    const Icon = icons[status]
    return Icon ? <Icon className="h-4 w-4" /> : null
  }

  const getQualityColor = (quality) => {
    const colors = {
      excellent: 'text-green-600',
      good: 'text-blue-600',
      poor: 'text-red-600',
      none: 'text-gray-400'
    }
    return colors[quality] || 'text-gray-400'
  }

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    if (progress > 0) return 'bg-orange-500'
    return 'bg-gray-300'
  }

  const toggleRowExpand = (farmerId) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(farmerId)) {
      newExpanded.delete(farmerId)
    } else {
      newExpanded.add(farmerId)
    }
    setExpandedRows(newExpanded)
  }

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const ProgressBar = ({ progress }) => (
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor(progress)}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  )

  const SortableHeader = ({ column, children }) => (
    <button
      onClick={() => handleSort(column)}
      className="flex items-center gap-1 font-semibold text-gray-700 hover:text-green-600 transition-colors"
    >
      {children}
      <div className="flex flex-col">
        <ChevronUp className={`h-3 w-3 ${sortBy === column && sortOrder === 'asc' ? 'text-green-600' : 'text-gray-400'}`} />
        <ChevronDown className={`h-3 w-3 -mt-1 ${sortBy === column && sortOrder === 'desc' ? 'text-green-600' : 'text-gray-400'}`} />
      </div>
    </button>
  )

  const FarmerRow = ({ farmer }) => {
    const isExpanded = expandedRows.has(farmer.id)

    return (
      <>
        <tr 
          className={`border-b border-gray-100 hover:bg-green-50 transition-all duration-200 cursor-pointer ${
            isExpanded ? 'bg-green-50' : ''
          }`}
          onClick={() => toggleRowExpand(farmer.id)}
        >
          {/* Farmer Info */}
          <td className="px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">{farmer.name}</div>
                <div className="text-sm text-gray-500">{farmer.farmerId}</div>
              </div>
            </div>
          </td>

          {/* Contact & Location */}
          <td className="px-4 py-4">
            <div className="text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <Phone className="h-3 w-3" />
                {farmer.phone}
              </div>
              <div className="flex items-center gap-1 text-gray-600 mt-1">
                <MapPin className="h-3 w-3" />
                {farmer.village}
              </div>
            </div>
          </td>

          {/* Crops & Area */}
          <td className="px-4 py-4">
            <div className="text-sm">
              <div className="text-gray-900 font-medium">
                {farmer.crops.join(', ')}
              </div>
              <div className="text-gray-500">
                {farmer.totalPlots} plots • {farmer.totalArea}
              </div>
            </div>
          </td>

          {/* Submission Status */}
          <td className="px-4 py-4">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(farmer.submissionStatus)}`}>
                {getStatusIcon(farmer.submissionStatus)}
                <span className="ml-1 capitalize">{farmer.submissionStatus.replace('_', ' ')}</span>
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Stage: {farmer.submissionStage}
            </div>
          </td>

          {/* Progress */}
          <td className="px-4 py-4">
            <div className="space-y-2">
              <ProgressBar progress={farmer.progress} />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Progress</span>
                <span>{farmer.progress}%</span>
              </div>
            </div>
          </td>

          {/* AI Confidence */}
          <td className="px-4 py-4">
            <div className="text-center">
              <div className={`text-lg font-bold ${
                farmer.aiConfidence >= 80 ? 'text-green-600' :
                farmer.aiConfidence >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {farmer.aiConfidence}%
              </div>
              <div className="text-xs text-gray-500">Confidence</div>
            </div>
          </td>

          {/* Actions */}
          <td className="px-4 py-4">
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                <Eye className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Send className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </td>
        </tr>

        {/* Expanded Details */}
        {isExpanded && (
          <tr className="bg-green-25 border-b border-green-100">
            <td colSpan="7" className="px-4 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Submission Timeline */}
                <div className="lg:col-span-2">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    Submission Timeline
                  </h4>
                  <div className="space-y-3">
                    {farmer.submissions.map((submission, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          submission.status === 'approved' ? 'bg-green-100 text-green-600' :
                          submission.status === 'rejected' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {getStatusIcon(submission.status)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{submission.stage}</div>
                          <div className="text-sm text-gray-500">
                            {submission.date ? new Date(submission.date).toLocaleDateString() : 'Not submitted'}
                            {submission.images > 0 && ` • ${submission.images} images`}
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                          {submission.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions & Info */}
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                    <div className="space-y-2">
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        Send Reminder
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <FileText className="h-4 w-4" />
                        Generate Report
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        <Image className="h-4 w-4" />
                        View Images
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Officer Info</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Assigned Officer:</span>
                        <span className="font-medium text-blue-600">{farmer.officerAssigned}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next Deadline:</span>
                        <span className="font-medium text-orange-600">
                          {farmer.nextDeadline ? new Date(farmer.nextDeadline).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Image Quality:</span>
                        <span className={`font-medium ${getQualityColor(farmer.imageQuality)}`}>
                          {farmer.imageQuality}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {farmer.notes && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-yellow-800">Notes:</span>
                      <p className="text-sm text-yellow-700 mt-1">{farmer.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </td>
          </tr>
        )}
      </>
    )
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white/40 p-6 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-heading">Farmer Tracker</h1>
          <p className="text-gray-500 font-medium mt-1">Monitor and manage farmer image submissions and overall progress</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-brand-300 hover:text-brand-600 hover:shadow-sm hover:-translate-y-0.5 transition-all">
            <RefreshCw className="h-[18px] w-[18px] mr-2" />
            Refresh
          </button>
          <button className="flex items-center px-4 py-2.5 bg-brand-600/90 hover:bg-brand-600 text-white font-semibold rounded-xl shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30 hover:-translate-y-0.5 transition-all">
            <Download className="h-[18px] w-[18px] mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-3xl hover-lift text-center">
          <div className="text-4xl font-bold text-gray-800 font-heading">{farmers.length}</div>
          <div className="text-[13px] font-semibold tracking-wide text-gray-500 uppercase mt-2">Total Farmers</div>
        </div>
        <div className="glass-panel p-6 rounded-3xl hover-lift text-center bg-linear-to-br from-white to-brand-50/50">
          <div className="text-4xl font-bold text-brand-600 font-heading">
            {farmers.filter(f => f.submissionStatus === 'completed').length}
          </div>
          <div className="text-[13px] font-semibold tracking-wide text-gray-500 uppercase mt-2">Completed</div>
        </div>
        <div className="glass-panel p-6 rounded-3xl hover-lift text-center">
          <div className="text-4xl font-bold text-orange-500 font-heading">
            {farmers.filter(f => f.submissionStatus === 'delayed').length}
          </div>
          <div className="text-[13px] font-semibold tracking-wide text-gray-500 uppercase mt-2">Delayed</div>
        </div>
        <div className="glass-panel p-6 rounded-3xl hover-lift text-center">
          <div className="text-4xl font-bold text-blue-500 font-heading">
            {farmers.length > 0 ? Math.round(farmers.reduce((acc, f) => acc + f.progress, 0) / farmers.length) : 0}%
          </div>
          <div className="text-[13px] font-semibold tracking-wide text-gray-500 uppercase mt-2">Avg Progress</div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="glass-panel rounded-3xl p-6 shadow-sm border border-white/60">
        <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center">
          {/* Search */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
              <input
                type="text"
                placeholder="Search farmers by name, ID, village, or crop..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200/80 bg-white/70 rounded-xl focus:ring-2 focus:ring-brand-400 focus:border-brand-400 focus:bg-white transition-all text-[15px] font-medium placeholder-gray-400 outline-none"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2.5">
            {filters.map((filterItem) => (
              <button
                key={filterItem.value}
                onClick={() => setFilter(filterItem.value)}
                className={`flex items-center px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-300 border ${
                  filter === filterItem.value
                    ? 'bg-brand-100/80 text-brand-700 border-brand-300 shadow-sm'
                    : 'bg-white/60 text-gray-600 border-gray-200/80 hover:bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {getStatusIcon(filterItem.value)}
                <span className="ml-2.5">{filterItem.label}</span>
                <span className={`ml-2.5 px-2 py-0.5 rounded-md text-[11px] ${filter === filterItem.value ? 'bg-brand-200 text-brand-800' : 'bg-gray-100 text-gray-600'}`}>
                  {filterItem.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Farmers Table */}
      <div className="glass-panel rounded-3xl border border-white/60 overflow-hidden premium-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 border-b border-gray-200/80 backdrop-blur-sm">
              <tr>
                <th className="px-5 py-4 text-[13px] font-bold tracking-wide text-gray-600 uppercase border-r border-gray-100">
                  <SortableHeader column="name">
                    Farmer Details
                  </SortableHeader>
                </th>
                <th className="px-5 py-4 text-[13px] font-bold tracking-wide text-gray-600 uppercase border-r border-gray-100">Contact & Location</th>
                <th className="px-5 py-4 text-[13px] font-bold tracking-wide text-gray-600 uppercase border-r border-gray-100">Crops & Area</th>
                <th className="px-5 py-4 text-[13px] font-bold tracking-wide text-gray-600 uppercase border-r border-gray-100">Submission Status</th>
                <th className="px-5 py-4 text-[13px] font-bold tracking-wide text-gray-600 uppercase border-r border-gray-100">
                  <SortableHeader column="progress">
                    Progress
                  </SortableHeader>
                </th>
                <th className="px-5 py-4 text-[13px] font-bold tracking-wide text-gray-600 uppercase border-r border-gray-100">
                  <SortableHeader column="aiConfidence">
                    AI Confidence
                  </SortableHeader>
                </th>
                <th className="px-5 py-4 text-[13px] font-bold tracking-wide text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white/40">
              {sortedFarmers.map((farmer) => (
                <FarmerRow key={farmer.id} farmer={farmer} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {sortedFarmers.length === 0 && (
          <div className="p-12 text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No farmers found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'No farmers match the current filters'}
            </p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="glass-panel rounded-3xl p-5 border border-white/60 shadow-sm mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-center text-[14px] text-gray-600 gap-4">
          <div className="bg-white/50 px-4 py-2 rounded-xl">
            Showing <span className="font-bold text-gray-900 mx-1">{sortedFarmers.length}</span> of{' '}
            <span className="font-bold text-gray-900 mx-1">{farmers.length}</span> farmers
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2">Avg AI Confidence: 
               <span className="font-bold text-brand-700 bg-brand-100 px-2.5 py-1 rounded-lg">
                 {farmers.length > 0 ? Math.round(farmers.reduce((acc, f) => acc + f.aiConfidence, 0) / farmers.length) : 0}%
               </span>
            </span>
            <span className="w-px h-6 bg-gray-200"></span>
            <span className="flex items-center gap-2">Overall Progress: 
               <span className="font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-lg">
                 {farmers.length > 0 ? Math.round(farmers.reduce((acc, f) => acc + f.progress, 0) / farmers.length) : 0}%
               </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FarmerTracker