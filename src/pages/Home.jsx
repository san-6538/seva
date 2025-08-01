import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Heart, DollarSign, Shield, TrendingUp, Users, MapPin, MessageSquare } from 'lucide-react'
import { Button } from '../components/ui/Button'
import ComplaintCard from '../components/cards/ComplaintCard'
import DonationCard from '../components/cards/DonationCard'
import ChatbotWindow from '../components/chat/ChatbotWindow'
import MapComponent from '../components/maps/MapComponent'
import { sampleComplaints, sampleDonations } from '../data/sampleData'

const Home = () => {
  const [recentComplaints, setRecentComplaints] = useState([])
  const [urgentDonations, setUrgentDonations] = useState([])
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [stats, setStats] = useState({
    totalIssues: 0,
    resolvedIssues: 0,
    activeDonations: 0,
    totalUsers: 0
  })

  useEffect(() => {
    // Load recent data
    setRecentComplaints(sampleComplaints.slice(0, 3))
    setUrgentDonations(sampleDonations.filter(d => d.urgency === 'critical' || d.urgency === 'urgent').slice(0, 2))
    
    // Calculate stats
    setStats({
      totalIssues: sampleComplaints.length,
      resolvedIssues: sampleComplaints.filter(c => c.status === 'resolved').length,
      activeDonations: sampleDonations.length,
      totalUsers: 1250
    })
  }, [])

  const quickActions = [
    {
      title: 'Report Issue',
      description: 'Report civic problems in your area',
      icon: AlertTriangle,
      color: 'bg-red-500',
      path: '/submit-issue'
    },
    {
      title: 'Blood Request',
      description: 'Request or donate blood',
      icon: Heart,
      color: 'bg-red-600',
      path: '/blood-request'
    },
    {
      title: 'Start Fundraiser',
      description: 'Raise funds for medical emergencies',
      icon: DollarSign,
      color: 'bg-green-500',
      path: '/fundraiser'
    },
    {
      title: 'Emergency SOS',
      description: 'Get immediate help',
      icon: Shield,
      color: 'bg-orange-500',
      path: '/sos'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Seva
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Smart City Monitoring & Civic Engagement Platform
            </p>
            <p className="text-lg mb-10 text-blue-200 max-w-3xl mx-auto">
              Report issues, request help, contribute to your community. Together, we build better cities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/submit-issue">
                <Button size="lg" className="border-white text-black hover:bg-white hover:text-blue-600 w-full sm:w-auto">
                  Report an Issue
                </Button>
              </Link>
              <Link to="/blood-request">
                <Button size="lg" className="border-white text-black hover:bg-white hover:text-blue-600 w-full sm:w-auto">
                  Emergency Help
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalIssues}</div>
              <div className="text-gray-600 dark:text-gray-400">Issues Reported</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.resolvedIssues}</div>
              <div className="text-gray-600 dark:text-gray-400">Issues Resolved</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mx-auto mb-4">
                <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeDonations}</div>
              <div className="text-gray-600 dark:text-gray-400">Active Donations</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</div>
              <div className="text-gray-600 dark:text-gray-400">Community Members</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Choose an action to get started
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link key={index} to={action.path}>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 group">
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Live Issue Map
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              See reported issues and blood requests in your area
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <MapComponent 
              complaints={sampleComplaints}
              donations={sampleDonations}
            />
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Issues */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Recent Issues
                </h2>
                <Link to="/submit-issue">
                  <Button variant="outline">View All</Button>
                </Link>
              </div>
              <div className="space-y-4">
                {recentComplaints.map((complaint) => (
                  <ComplaintCard key={complaint.id} complaint={complaint} />
                ))}
              </div>
            </div>

            {/* Urgent Donations */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Urgent Blood Requests
                </h2>
                <Link to="/blood-request">
                  <Button variant="outline">View All</Button>
                </Link>
              </div>
              <div className="space-y-4">
                {urgentDonations.map((donation) => (
                  <DonationCard 
                    key={donation.id} 
                    donation={donation}
                    onContact={(phone) => window.open(`tel:${phone}`)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <ChatbotWindow 
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />

      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-4 left-4 rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg z-40"
        aria-label="Open medical chatbot"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    </div>
  )
}

export default Home
