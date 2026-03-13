import React, { useState, useEffect } from 'react'
import { getPlots } from '../../services/api/plots.api'
import { Search, Filter, Download, AlertTriangle, MapPin, ExternalLink } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Fix for default Leaflet icon issues in React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const getHealthColor = (health) => {
  switch (health) {
    case 'Good': return '#10b981';
    case 'Moderate': return '#f59e0b';
    case 'Damage': return '#ef4444';
    default: return '#6b7280';
  }
};

const MapMonitor = () => {
  const [plots, setPlots] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchRealPlots = async () => {
      try {
        const res = await getPlots();
        const data = res.data || (Array.isArray(res) ? res : []);
        
        const mappedPlots = data.map((plot, idx) => ({
          id: plot._id || `plot-${idx}`,
          position: plot.location?.coordinates || [73.8567, 18.5204],
          farmerName: plot.farmer?.name || 'Unknown Farmer',
          crop: plot.cropType || 'Unknown Crop',
          stage: plot.status || 'Active',
          health: plot.status === 'verified' ? 'Good' : 'Moderate',
          damage: plot.status === 'rejected' ? 'Damage' : 'None',
          lastImage: plot.updatedAt ? new Date(plot.updatedAt).toISOString().split('T')[0] : 'N/A',
          officerVisited: plot.status === 'verified'
        }));
        
        setPlots(mappedPlots);
      } catch (err) {
        console.error("Failed to load plots", err);
      }
    };
    
    fetchRealPlots();
  }, [])

  const filters = [
    { value: 'all', label: 'All Plots', color: 'gray' },
    { value: 'damage', label: 'Damage Reported', color: 'red' },
    { value: 'no-image', label: 'No Image Submitted', color: 'yellow' },
    { value: 'pending-visit', label: 'Pending Officer Visit', color: 'orange' }
  ]

  const filteredPlots = plots.filter(plot => {
    if (filter === 'damage') return plot.damage !== 'None'
    if (filter === 'no-image') return !plot.lastImage
    if (filter === 'pending-visit') return !plot.officerVisited
    return true
  })

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/40 p-6 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-heading">Map-Based Monitoring</h1>
          <p className="text-gray-500 font-medium mt-1">Real-time agricultural plot visualization and tracking</p>
        </div>
        <button className="flex items-center px-4 py-2.5 bg-brand-600/90 hover:bg-brand-600 text-white font-semibold rounded-xl shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30 hover:-translate-y-0.5 transition-all">
          <Download className="h-[18px] w-[18px] mr-2" />
          Export Data
        </button>
      </div>

      {/* Controls */}
      <div className="glass-panel rounded-3xl p-6 shadow-sm border border-white/60">
        <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center">
          {/* Search */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
              <input
                type="text"
                placeholder="Search by farmer name, plot ID, village..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200/80 bg-white/70 rounded-xl focus:ring-2 focus:ring-brand-400 focus:border-brand-400 focus:bg-white transition-all text-[15px] font-medium placeholder-gray-400 outline-none"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2.5">
            {filters.map((filterItem) => (
              <button
                key={filterItem.value}
                onClick={() => setFilter(filterItem.value)}
                className={`px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-300 border ${
                  filter === filterItem.value
                    ? `bg-${filterItem.color}-100/80 text-${filterItem.color}-700 border-${filterItem.color}-300 shadow-sm`
                    : 'bg-white/60 text-gray-600 border-gray-200/80 hover:bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {filterItem.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-3xl hover-lift text-center bg-linear-to-br from-white to-gray-50/50">
          <div className="text-4xl font-bold text-gray-800 font-heading">{plots.length}</div>
          <div className="text-[13px] font-semibold tracking-wide text-gray-500 uppercase mt-2">Total Plots</div>
        </div>
        <div className="glass-panel p-6 rounded-3xl hover-lift text-center bg-linear-to-br from-white to-brand-50/50">
          <div className="text-4xl font-bold text-brand-600 font-heading">{plots.filter(p => p.lastImage !== 'N/A').length}</div>
          <div className="text-[13px] font-semibold tracking-wide text-gray-500 uppercase mt-2">Images Submitted</div>
        </div>
        <div className="glass-panel p-6 rounded-3xl hover-lift text-center">
          <div className="text-4xl font-bold text-orange-500 font-heading">{plots.filter(p => !p.officerVisited).length}</div>
          <div className="text-[13px] font-semibold tracking-wide text-gray-500 uppercase mt-2">Pending Visits</div>
        </div>
        <div className="glass-panel p-6 rounded-3xl hover-lift text-center bg-linear-to-br from-white to-red-50/50">
          <div className="text-4xl font-bold text-red-500 font-heading">{plots.filter(p => p.damage !== 'None').length}</div>
          <div className="text-[13px] font-semibold tracking-wide text-gray-500 uppercase mt-2">Damage Alerts</div>
        </div>
      </div>

      {/* Map Visualization */}
      <div className="glass-panel rounded-3xl overflow-hidden premium-shadow p-1.5 min-h-[500px]">
        <div className="h-[500px] w-full relative rounded-2xl overflow-hidden mb-4">
          <MapContainer 
            center={[20.5937, 78.9629]} 
            zoom={5} 
            className="h-full w-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredPlots.map((plot) => (
              <Marker 
                key={plot.id} 
                position={[
                  plot.position?.[1] || 20.5937, 
                  plot.position?.[0] || 78.9629
                ]}
              >
                <Popup>
                  <div className="p-1 min-w-[150px]">
                    <h4 className="font-bold text-gray-900 border-b pb-1 mb-2">{plot.farmerName}</h4>
                    <div className="space-y-1 text-sm">
                      <p className="flex justify-between"><span>Crop:</span> <span className="font-semibold">{plot.crop}</span></p>
                      <p className="flex justify-between"><span>Status:</span> <span className="font-semibold">{plot.stage}</span></p>
                      <p className="flex justify-between">
                        <span>Health:</span> 
                        <span style={{ color: getHealthColor(plot.health) }} className="font-bold">{plot.health}</span>
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        
        <div className="px-6 py-4 flex flex-wrap gap-6 justify-center border-t border-gray-100 bg-white/40">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-tighter">Good Health</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-tighter">Moderate Status</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-tighter">Damage Reported</span>
          </div>
        </div>
      </div>

      {/* Plots List */}
      <div className="glass-panel rounded-3xl border border-white/60 overflow-hidden premium-shadow">
        <div className="px-7 py-5 border-b border-gray-100/80 bg-white/40">
          <h2 className="text-xl font-bold text-gray-900 font-heading">Plots Overview <span className="text-brand-600 bg-brand-100/50 px-2 py-0.5 rounded-lg ml-2">{filteredPlots.length}</span></h2>
        </div>
        <div className="divide-y divide-gray-100/80 bg-white/30">
          {filteredPlots.map((plot) => (
            <div key={plot.id} className="p-6 hover:bg-white/60 transition-colors">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-[16px] text-gray-900 font-heading">{plot.farmerName}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                      plot.health === 'Good' ? 'bg-emerald-100 text-emerald-700' :
                      plot.health === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {plot.health}
                    </span>
                    {plot.damage !== 'None' && (
                      <span className="flex items-center px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-[11px] font-bold tracking-wide uppercase">
                        <AlertTriangle className="h-[14px] w-[14px] mr-1" />
                        {plot.damage}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[14px] text-gray-600">
                    <div className="bg-white/50 px-3 py-2 rounded-xl border border-gray-100">
                      <strong className="block text-[11px] text-gray-400 uppercase tracking-wide mb-1">Crop</strong> 
                      <span className="font-semibold text-gray-800">{plot.crop}</span>
                    </div>
                    <div className="bg-white/50 px-3 py-2 rounded-xl border border-gray-100">
                      <strong className="block text-[11px] text-gray-400 uppercase tracking-wide mb-1">Stage</strong> 
                      <span className="font-semibold text-gray-800">{plot.stage}</span>
                    </div>
                    <div className="bg-white/50 px-3 py-2 rounded-xl border border-gray-100">
                      <strong className="block text-[11px] text-gray-400 uppercase tracking-wide mb-1">Last Image</strong> 
                      <span className="font-semibold text-gray-800">{plot.lastImage}</span>
                    </div>
                    <div className="bg-white/50 px-3 py-2 rounded-xl border border-gray-100">
                      <strong className="block text-[11px] text-gray-400 uppercase tracking-wide mb-1">Officer Visit</strong> 
                      <span className={`font-semibold ${plot.officerVisited ? 'text-brand-600' : 'text-orange-500'}`}>
                        {plot.officerVisited ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="px-5 py-2.5 bg-white border border-gray-200 text-brand-600 font-semibold rounded-xl hover:bg-brand-50 hover:border-brand-200 transition-colors shadow-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MapMonitor