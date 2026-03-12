import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  Menu, X, Map, Image, Users, Shield, AlertTriangle, 
  FileText, History, Settings, LogOut, ChevronDown,
  BarChart3, CheckCircle2, GitCompare
} from 'lucide-react'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeModule, setActiveModule] = useState('overview')
  const navigate = useNavigate()
  const { user: authUser, logout } = useAuth()

  const user = {
    name: authUser?.name || 'Guest User',
    role: authUser?.designation || authUser?.role || 'User',
    district: authUser?.district || 'Unknown District',
    avatar: authUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  }

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: BarChart3 },
    { name: 'Map Monitor', href: '/dashboard/map', icon: Map },
    { name: 'Image Gallery', href: '/dashboard/images', icon: Image },
    { name: 'AI Analysis', href: '/dashboard/ai-analysis', icon: Shield },
    { name: 'Farmer Tracker', href: '/dashboard/farmers', icon: Users },
    { name: 'Officer Tracker', href: '/dashboard/officers', icon: Users },
    { name: 'Compare Images', href: '/dashboard/compare', icon: GitCompare },
    { name: 'Damage Alerts', href: '/dashboard/alerts', icon: AlertTriangle },
    { name: 'Approval Workflow', href: '/dashboard/approvals', icon: CheckCircle2 },
    { name: 'CCE Optimization', href: '/dashboard/cce', icon: Settings },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText },
    { name: 'History', href: '/dashboard/history', icon: History },
  ]


  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-brand-50 w-full overflow-hidden font-sans">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 flex z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 glass-panel flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/20 bg-linear-to-r from-brand-600 to-brand-500 text-white shadow-sm rounded-tr-3xl lg:rounded-tr-none">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold font-heading tracking-wide">PLANTIVE</h1>
              <p className="text-[11px] font-medium tracking-wider text-brand-100 uppercase mt-0.5">Agricultural Platform</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-white hover:bg-green-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User profile */}
        <div className="p-5 border-b border-gray-100/50">
          <div className="flex items-center space-x-4 bg-white/50 p-3 rounded-2xl border border-white/60 shadow-sm hover-lift cursor-pointer">
            <img
              className="h-11 w-11 rounded-full border-2 border-brand-200 shadow-sm object-cover"
              src={user.avatar}
              alt={user.name}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-gray-800 font-heading truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 font-medium truncate mb-0.5">
                {user.role}
              </p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-100 text-brand-700">
                {user.district}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setActiveModule(item.name.toLowerCase())}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-[14px] font-medium rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-linear-to-r from-brand-50 to-white text-brand-700 shadow-sm border border-brand-100/50' 
                    : 'text-gray-600 hover:bg-white/60 hover:text-brand-600 hover:shadow-sm'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className={`mr-3 p-1.5 rounded-lg transition-colors ${isActive ? 'bg-brand-100 text-brand-600' : 'bg-gray-50 text-gray-400 group-hover:bg-brand-50 group-hover:text-brand-500'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {item.name}
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-100/50 pb-6">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-[14px] font-medium text-gray-500 rounded-xl hover:bg-red-50/80 hover:text-red-600 hover:shadow-sm transition-all duration-300 group"
          >
            <div className="mr-3 p-1.5 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-red-100 group-hover:text-red-500 transition-colors">
              <LogOut className="h-4 w-4" />
            </div>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-100/40 rounded-full blur-[100px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-teal/5 rounded-full blur-[120px] -z-10 pointer-events-none -translate-x-1/2 translate-y-1/3"></div>

        {/* Top header */}
        <header className="glass-panel z-10 m-4 sm:m-6 lg:mx-8 lg:mt-6 rounded-2xl shadow-sm border border-white/60">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-brand-50 hover:text-brand-600 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              {/* Breadcrumb */}
              <div className="ml-2 lg:ml-0 flex items-center space-x-2.5 text-[15px]">
                <span className="font-bold font-heading tracking-wide text-gray-800">PLANTIVE</span>
                <ChevronDown className="h-3.5 w-3.5 transform -rotate-90 text-gray-400" />
                <span className="text-brand-600 font-semibold bg-brand-50 px-2.5 py-1 rounded-md">Dashboard</span>
              </div>
            </div>

            {/* Notifications & Quick Actions */}
            <div className="flex items-center space-x-5">
              <div className="hidden sm:flex items-center space-x-2 bg-green-50/80 px-3 py-1.5 rounded-full border border-green-100/50">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                </div>
                <span className="text-xs font-semibold text-brand-700 uppercase tracking-widest">Live Sync</span>
              </div>
              <button className="relative p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout