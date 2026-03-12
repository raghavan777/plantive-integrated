import React, { useState, useEffect } from 'react';
import { getReports } from '../../services/api/reports.api';
import {
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  User,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Phone,
  Mail,
  Image as ImageIcon,
  BarChart3,
  RefreshCw,
  Printer,
  Share2
} from 'lucide-react';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [expandedReports, setExpandedReports] = useState(new Set());
  const [view, setView] = useState('list'); // 'list' or 'grid'

  useEffect(() => {
    const fetchRealReports = async () => {
      try {
        setLoading(true);
        const res = await getReports();
        const data = res.data || (Array.isArray(res) ? res : []);
        
        const mappedReports = data.map((r, idx) => ({
          id: r._id || `report-${idx}`,
          officer: {
            name: r.generatedBy?.name || r.author?.name || 'Assigned Officer',
            badgeNumber: r.generatedBy?.employeeId || 'OFF-' + (idx + 1).toString().padStart(3, '0'),
            phone: r.generatedBy?.phone || '+91 99999 99999',
            email: r.generatedBy?.email || 'officer@pmfby.gov.in'
          },
          farmer: {
            name: r.farmer?.name || r.target?.name || 'Unknown Farmer',
            farmerId: r.farmer?.farmerId || r.target?.id || 'Unknown ID',
            phone: r.farmer?.contact?.phone || '+91 XXXXX XXXXX',
            village: r.farmer?.location?.village || r.region || 'Unknown Village'
          },
          type: r.type || r.reportType || 'crop_health',
          title: r.title || r.reportName || 'Field Assessment Report',
          description: r.description || r.summary || r.content || 'No description provided for this report.',
          date: r.createdAt || r.dateGenerated || new Date().toISOString(),
          status: r.status || 'completed',
          priority: r.priority || 'medium',
          location: {
            latitude: r.location?.coordinates?.[1] || 18.5204,
            longitude: r.location?.coordinates?.[0] || 73.8567,
            address: r.location?.address || r.region || 'Unknown Location'
          },
          images: r.images || r.attachments || [],
          assessment: {
            damagePercentage: r.data?.statistics?.criticalIssues || 0,
            estimatedLoss: r.data?.summary?.estimatedLoss ? `₹${r.data.summary.estimatedLoss}` : 'N/A',
            affectedArea: r.data?.statistics?.totalArea ? `${r.data.statistics.totalArea} acres` : 'N/A',
            cropStage: r.data?.details?.cropStage || 'Unknown',
            recommendedAction: r.data?.details?.recommendedAction || 'No immediate action required'
          },
          mobileAppComplaints: Array.isArray(r.complaints) ? r.complaints : (Array.isArray(r.relatedSubmissions) ? r.relatedSubmissions : [])
        }));
        
        setReports(mappedReports);
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRealReports();
  }, []);

  const statusOptions = [
    { value: 'all', label: 'All Reports' },
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'completed', label: 'Completed' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'damage_assessment', label: 'Damage Assessment' },
    { value: 'pest_infestation', label: 'Pest Infestation' },
    { value: 'disease_outbreak', label: 'Disease Outbreak' },
    { value: 'crop_health', label: 'Crop Health' }
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    under_review: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-700'
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700'
  };

  const severityColors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700'
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleExpand = (reportId) => {
    const newExpanded = new Set(expandedReports);
    if (newExpanded.has(reportId)) {
      newExpanded.delete(reportId);
    } else {
      newExpanded.add(reportId);
    }
    setExpandedReports(newExpanded);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'under_review':
        return <Eye className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const exportReport = (report) => {
    // Simulate export functionality
    alert(`Exporting report: ${report.title}`);
  };

  const printReport = (report) => {
    // Simulate print functionality
    alert(`Printing report: ${report.title}`);
  };

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const ComplaintCard = ({ complaint }) => {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${severityColors[complaint.severity]}`}>
                {complaint.severity.toUpperCase()}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[complaint.status]}`}>
                {complaint.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <h4 className="font-semibold text-gray-900">Complaint: {complaint.id}</h4>
            <p className="text-sm text-gray-600">From: {complaint.farmerName}</p>
          </div>
          <span className="text-sm text-gray-500">
            {new Date(complaint.date).toLocaleDateString()}
          </span>
        </div>

        <p className="text-sm text-gray-700 mb-3">{complaint.description}</p>

        {complaint.images && complaint.images.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{complaint.images.length} images attached</span>
          </div>
        )}

        {complaint.officerComments && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Officer Comments</span>
            </div>
            <p className="text-sm text-blue-800">{complaint.officerComments}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className={`inline-flex items-center gap-1 ${complaint.followUpRequired ? 'text-orange-600' : 'text-green-600'}`}>
            {complaint.followUpRequired ? (
              <>
                <AlertTriangle className="h-4 w-4" />
                Follow-up Required
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Resolved
              </>
            )}
          </span>
          <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            <Eye className="h-4 w-4" />
            View Details
          </button>
        </div>
      </div>
    );
  };

  const ReportCard = ({ report }) => {
    const isExpanded = expandedReports.has(report.id);

    return (
      <div className="bg-white rounded-2xl border border-gray-200 hover:border-green-300 transition-all duration-300">
        {/* Report Header */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold">
                {report.officer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{report.title}</h3>
                <p className="text-sm text-gray-600">By {report.officer.name} • {report.farmer.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[report.status]}`}>
                {getStatusIcon(report.status)}
                <span className="ml-1 capitalize">{report.status.replace('_', ' ')}</span>
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${priorityColors[report.priority]}`}>
                {report.priority} priority
              </span>
            </div>
          </div>

          <p className="text-gray-700 mb-4">{report.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{report.location.address}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{new Date(report.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-4 w-4" />
              <span>{report.farmer.farmerId}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <ImageIcon className="h-4 w-4" />
              <span>{report.images.length} images</span>
            </div>
          </div>

          {/* Assessment Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Damage Assessment</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Damage:</span>
                <span className="ml-2 font-semibold text-red-600">{report.assessment.damagePercentage}%</span>
              </div>
              <div>
                <span className="text-gray-600">Estimated Loss:</span>
                <span className="ml-2 font-semibold text-orange-600">{report.assessment.estimatedLoss}</span>
              </div>
              <div>
                <span className="text-gray-600">Area:</span>
                <span className="ml-2 font-semibold text-blue-600">{report.assessment.affectedArea}</span>
              </div>
              <div>
                <span className="text-gray-600">Crop Stage:</span>
                <span className="ml-2 font-semibold text-green-600">{report.assessment.cropStage}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleExpand(report.id)}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {isExpanded ? 'Hide' : 'Show'} Complaints ({report.mobileAppComplaints.length})
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => exportReport(report)}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-green-600"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={() => printReport(report)}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-blue-600"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
              <button className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-purple-600">
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Complaints Section */}
        {isExpanded && (
          <div className="border-t border-gray-200 p-6 bg-green-50">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Mobile App Complaints ({report.mobileAppComplaints.length})
            </h4>
            <div className="space-y-3">
              {report.mobileAppComplaints.map((complaint, index) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Officer Reports & Complaints</h1>
            <p className="text-gray-600">View field officer reports and associated mobile app complaints</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refreshData}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:border-green-500 hover:text-green-600 transition-all"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by farmer name, officer name, or report title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setView(view === 'list' ? 'grid' : 'list')}
                className="flex items-center px-4 py-3 bg-white border border-gray-300 rounded-xl hover:border-green-500 transition-colors"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {view === 'list' ? 'Grid View' : 'List View'}
              </button>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`flex items-center px-4 py-2 rounded-xl transition-all ${
                  statusFilter === option.value
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{option.label}</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  statusFilter === option.value
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}>
                  {reports.filter(r => option.value === 'all' || r.status === option.value).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Reports Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{reports.length}</div>
              <div className="text-gray-600">Total Reports</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <div className="text-2xl font-bold text-yellow-600">
                {reports.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-gray-600">Pending</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">
                {reports.filter(r => r.status === 'approved').length}
              </div>
              <div className="text-gray-600">Approved</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-2xl font-bold text-orange-600">
                {reports.reduce((total, report) => total + report.mobileAppComplaints.length, 0)}
              </div>
              <div className="text-gray-600">Total Complaints</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;