// src/pages/AdminDashboard.jsx
import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  BarChart3,
  AlertTriangle,
  Heart,
  DollarSign,
  CheckCircle,
  Clock,
  TrendingUp,
  Filter,
  Search,
  Download,
  Loader2
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/Select'
import DonationCard from '../../components/cards/DonationCard'
import { sampleComplaints, sampleDonations, sampleFundraisers } from '../../data/sampleData'
import { toast } from 'react-toastify'

// Reusable StatCard
const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {change !== undefined && (
          <p className={`text-sm flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`h-3 w-3 mr-1 ${change < 0 ? 'rotate-180' : ''}`} />
            {change >= 0 ? '+' : ''}{change}% from last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color} shadow`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
)

// Loading Spinner
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[300px]">
    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
    <span className="text-gray-600 dark:text-gray-400">Loading data...</span>
  </div>
)

// Error State
const ErrorState = ({ error, onRetry }) => (
  <div className="flex items-center justify-center min-h-[300px]">
    <div className="text-center">
      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {error}
      </h3>
      <Button onClick={onRetry} variant="outline">
        Try Again
      </Button>
    </div>
  </div>
)

// Empty State
const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="text-center py-12">
    <Icon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
)

// Overview Tab
const OverviewTab = ({ stats, complaints, donations }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Issues"
        value={stats.totalIssues}
        change={12}
        icon={AlertTriangle}
        color="bg-orange-500"
      />
      <StatCard
        title="Pending Issues"
        value={stats.pendingIssues}
        change={-5}
        icon={Clock}
        color="bg-yellow-500"
      />
      <StatCard
        title="Resolved Issues"
        value={stats.resolvedIssues}
        change={18}
        icon={CheckCircle}
        color="bg-green-500"
      />
      <StatCard
        title="Active Blood Requests"
        value={stats.activeBloodRequests}
        change={8}
        icon={Heart}
        color="bg-red-500"
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Complaints</h3>
        </div>
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {complaints.slice(0, 5).map(c => (
            <div
              key={c.id}
              className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                {c.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">📍 {c.location}</p>
              <div className="flex items-center justify-between mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  c.status === 'resolved'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : c.status === 'verified'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                }`}>
                  {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  c.priority === 'critical'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    : c.priority === 'high'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    : c.priority === 'medium'
                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                }`}>
                  {c.priority.charAt(0).toUpperCase() + c.priority.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Urgent Blood Requests</h3>
        </div>
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {donations.filter(d => d.urgency === 'critical').slice(0, 5).map(d => (
            <div
              key={d.id}
              className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">{d.patientName}</h4>
                <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full text-xs font-medium">
                  {d.bloodType}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">🏥 {d.hospital}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">{d.unitsNeeded} units needed</span>
                <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full text-xs font-medium animate-pulse">
                  {d.urgency.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

// Main Dashboard
const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([])
  const [donations, setDonations] = useState([])
  const [fundraisers, setFundraisers] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [statusFilter, setStatusFilter] = useState('all') // Changed from ''
  const [priorityFilter, setPriorityFilter] = useState('all') // Changed from ''
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Simulate data load
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      await new Promise(r => setTimeout(r, 1000)) // simulate API delay
      setComplaints(sampleComplaints || [])
      setDonations(sampleDonations || [])
      setFundraisers(sampleFundraisers || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load data')
      toast.error('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Stats
  const stats = useMemo(() => ({
    totalIssues: complaints.length,
    pendingIssues: complaints.filter(c => c.status === 'pending').length,
    resolvedIssues: complaints.filter(c => c.status === 'resolved').length,
    activeBloodRequests: donations.filter(d => new Date(d.requiredBy) > new Date()).length,
    activeFundraisers: fundraisers.filter(f => new Date(f.endDate) > new Date()).length,
    totalUsers: 1250
  }), [complaints, donations, fundraisers])

  // Filtered complaints
  const filteredComplaints = useMemo(() => {
    let filtered = complaints
    if (searchTerm) {
      const s = searchTerm.toLowerCase()
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(s) ||
        c.location.toLowerCase().includes(s) ||
        c.reportedBy.toLowerCase().includes(s)
      )
    }
    // Updated filtering logic to handle 'all' value
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter)
    }
    if (priorityFilter && priorityFilter !== 'all') {
      filtered = filtered.filter(c => c.priority === priorityFilter)
    }
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [complaints, searchTerm, statusFilter, priorityFilter])

  // Update status
  const handleStatusChange = useCallback(async (id, newStatus) => {
    try {
      setComplaints(prev =>
        prev.map(c => c.id === id ? { ...c, status: newStatus, updatedAt: new Date().toISOString() } : c)
      )
      toast.success(`Status updated to ${newStatus}`)
    } catch {
      toast.error('Failed to update status')
    }
  }, [])

  const exportData = useCallback(type => {
    toast.info(`Exporting ${type}…`)
  }, [])

  const clearFilters = useCallback(() => {
    setSearchTerm('')
    setStatusFilter('all') // Changed from ''
    setPriorityFilter('all') // Changed from ''
  }, [])

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3, count: null },
    { id: 'complaints', name: 'Complaints', icon: AlertTriangle, count: complaints.length },
    { id: 'blood-requests', name: 'Blood Requests', icon: Heart, count: donations.length },
    { id: 'fundraisers', name: 'Fundraisers', icon: DollarSign, count: fundraisers.length },
  ]

  // Hardcode admin flag
  const isAdmin = true

  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <ErrorState error={error} onRetry={loadData} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage complaints, blood requests, and fundraisers</p>
            </div>
            <div className="flex items-center space-x-4">
              {isLoading && (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Loading…</span>
                </div>
              )}
              <Button onClick={() => exportData('all')} variant="outline" disabled={isLoading}>
                <Download className="h-4 w-4 mr-2" /> Export Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" role="tablist">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
                {tab.count != null && (
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Overview */}
            {activeTab === 'overview' && (
              <div role="tabpanel">
                <OverviewTab stats={stats} complaints={complaints} donations={donations} />
              </div>
            )}

            {/* Complaints */}
            {activeTab === 'complaints' && (
              <div role="tabpanel" className="space-y-6">
                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search complaints..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="pl-10 w-80"
                        />
                      </div>
                      <Filter className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex items-center space-x-4">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="verified">Verified</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="w-32"><SelectValue placeholder="Priority" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priority</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all') && (
                        <Button onClick={clearFilters} variant="outline" size="sm">
                          Clear
                        </Button>
                      )}
                      <Button onClick={() => exportData('complaints')} variant="outline">
                        <Download className="h-4 w-4 mr-2" /> Export
                      </Button>
                    </div>
                  </div>
                </div>

                {/* List */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Complaints ({filteredComplaints.length})
                  </h2>
                  {filteredComplaints.length === 0 ? (
                    <EmptyState
                      icon={AlertTriangle}
                      title="No complaints found"
                      description="Try adjusting your search criteria."
                    />
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {filteredComplaints.map(c => (
                        <div key={c.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-2 flex-1 mr-4">
                              {c.title}
                            </h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              c.priority === 'critical'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                : c.priority === 'high'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                : c.priority === 'medium'
                                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            }`}>
                              {c.priority.charAt(0).toUpperCase() + c.priority.slice(1)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            📍 {c.location}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              c.status === 'resolved'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : c.status === 'verified'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            }`}>
                              {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                            </span>
                            
                            {isAdmin && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(
                                    c.id,
                                    c.status === 'resolved' ? 'pending' : 'resolved'
                                  )
                                }
                                className={c.status === 'resolved' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}
                              >
                                {c.status === 'resolved' ? 'Reopen' : 'Resolve'}
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Blood Requests */}
            {activeTab === 'blood-requests' && (
              <div role="tabpanel" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Blood Donation Requests ({donations.length})
                  </h2>
                  <Button onClick={() => exportData('blood-requests')} variant="outline">
                    <Download className="h-4 w-4 mr-2" /> Export
                  </Button>
                </div>
                {donations.length === 0 ? (
                  <EmptyState
                    icon={Heart}
                    title="No blood requests"
                    description="Requests will appear here."
                  />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {donations.map(d => (
                      <DonationCard
                        key={d.id}
                        donation={d}
                        onContact={phone => window.open(`tel:${phone}`)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Fundraisers */}
            {activeTab === 'fundraisers' && (
              <div role="tabpanel" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Active Fundraisers ({fundraisers.length})
                  </h2>
                  <Button onClick={() => exportData('fundraisers')} variant="outline">
                    <Download className="h-4 w-4 mr-2" /> Export
                  </Button>
                </div>
                {fundraisers.length === 0 ? (
                  <EmptyState
                    icon={DollarSign}
                    title="No fundraisers"
                    description="Campaigns will appear here."
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fundraisers.map(f => {
                      const pct = (f.raisedAmount / f.targetAmount) * 100
                      const daysLeft = Math.ceil((new Date(f.endDate) - new Date()) / (1000 * 60 * 60 * 24))
                      const done = f.raisedAmount >= f.targetAmount
                      return (
                        <div key={f.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                          {f.images && f.images[0] && (
                            <img src={f.images[0]} alt={f.title} className="w-full h-48 object-cover rounded-t-lg"/>
                          )}
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                                {f.title}
                              </h3>
                              {done && (
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-xs font-medium">
                                  Completed
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                              by {f.organizer}
                            </p>
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium">
                                  ₹{f.raisedAmount.toLocaleString()} raised
                                </span>
                                <span className="text-gray-500">
                                  ₹{f.targetAmount.toLocaleString()} goal
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    done ? 'bg-green-500' : 'bg-blue-500'
                                  }`}
                                  style={{ width: `${Math.min(pct, 100)}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>{pct.toFixed(1)}% funded</span>
                                <span>
                                  {done
                                    ? '🎉 Goal reached!'
                                    : daysLeft > 0
                                    ? `${daysLeft} days left`
                                    : 'Expired'}
                                </span>
                              </div>
                            </div>
                            {f.urgency && (
                              <div className="mt-4">
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                  f.urgency === 'critical'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                    : f.urgency === 'urgent'
                                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                }`}>
                                  {f.urgency.charAt(0).toUpperCase() + f.urgency.slice(1)} Priority
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
