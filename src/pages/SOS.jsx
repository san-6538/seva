import { useState, useEffect } from 'react'
import { Shield, Phone, MapPin, Clock, AlertTriangle, Zap } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { toast } from 'react-toastify'

const SOS = () => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false)
  const [location, setLocation] = useState(null)
  const [emergencyType, setEmergencyType] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [emergencyContacts] = useState([
    { name: 'Police', number: '100', icon: Shield, color: 'bg-blue-600' },
    { name: 'Fire', number: '101', icon: Zap, color: 'bg-red-600' },
    { name: 'Ambulance', number: '102', icon: Phone, color: 'bg-green-600' },
    { name: 'Emergency', number: '108', icon: AlertTriangle, color: 'bg-orange-600' }
  ])

  const emergencyTypes = [
    'Medical Emergency',
    'Accident',
    'Crime/Violence',
    'Fire',
    'Natural Disaster',
    'Other'
  ]

  useEffect(() => {
    let interval = null
    if (isEmergencyActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (countdown === 0 && isEmergencyActive) {
      handleEmergencyTrigger()
    }
    return () => clearInterval(interval)
  }, [isEmergencyActive, countdown])

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            setLocation({ latitude, longitude })
            resolve({ latitude, longitude })
          },
          (error) => {
            reject(error)
          }
        )
      } else {
        reject(new Error('Geolocation is not supported'))
      }
    })
  }

  const handleSOSActivation = async () => {
    try {
      // Get current location
      await getCurrentLocation()
      toast.success('Location detected')
      
      // Start countdown
      setCountdown(10)
      setIsEmergencyActive(true)
      toast.warning('Emergency will be triggered in 10 seconds. Cancel if this was accidental.')
      
    } catch (error) {
      toast.error('Unable to get location. Emergency will still be triggered.')
      setCountdown(10)
      setIsEmergencyActive(true)
    }
  }

  const handleEmergencyTrigger = async () => {
    try {
      const emergencyData = {
        type: emergencyType || 'General Emergency',
        location: location ? {
          latitude: location.latitude,
          longitude: location.longitude,
          address: `Lat: ${location.latitude.toFixed(6)}, Lng: ${location.longitude.toFixed(6)}`
        } : 'Location unavailable',
        additionalInfo,
        timestamp: new Date().toISOString(),
        userId: 'current-user', // This would come from auth context
        status: 'active'
      }

      // In a real app, this would:
      // 1. Send emergency alert to authorities
      // 2. Notify emergency contacts
      // 3. Start live location sharing
      // 4. Begin audio/video recording if enabled
      
      console.log('Emergency triggered:', emergencyData)
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Emergency alert sent to authorities and emergency contacts!')
      toast.info('Live location sharing activated')
      
    } catch (error) {
      toast.error('Failed to send emergency alert. Please call manually.')
    }
  }

  const cancelEmergency = () => {
    setIsEmergencyActive(false)
    setCountdown(0)
    toast.info('Emergency cancelled')
  }

  const callEmergencyNumber = (number) => {
    window.open(`tel:${number}`)
  }

  const shareLocation = async () => {
    try {
      if (navigator.share && location) {
        await navigator.share({
          title: 'My Emergency Location',
          text: `I need help! My location: https://maps.google.com/?q=${location.latitude},${location.longitude}`,
        })
      } else if (location) {
        // Fallback: copy to clipboard
        const locationText = `Emergency Location: https://maps.google.com/?q=${location.latitude},${location.longitude}`
        navigator.clipboard.writeText(locationText)
        toast.success('Location copied to clipboard')
      } else {
        toast.error('Location not available')
      }
    } catch (error) {
      console.error('Error sharing location:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Emergency Status Banner */}
      {isEmergencyActive && (
        <div className="bg-red-600 text-white p-4 text-center">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-lg font-semibold mb-2">EMERGENCY ACTIVATED</h2>
            <p className="text-sm">
              {countdown > 0 
                ? `Emergency will be triggered in ${countdown} seconds`
                : 'Emergency alert sent to authorities'
              }
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 mr-3" />
              <h1 className="text-4xl font-bold">Emergency SOS</h1>
            </div>
            <p className="text-xl text-red-100 mb-6">
              Get immediate help in emergency situations
            </p>
            <p className="text-sm text-red-200">
              Press the SOS button to alert authorities and emergency contacts
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main SOS Button */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="mb-6">
              <button
                onClick={handleSOSActivation}
                disabled={isEmergencyActive}
                className={`w-40 h-40 rounded-full text-white text-xl font-bold shadow-lg transform transition-all duration-200 ${
                  isEmergencyActive 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95'
                }`}
              >
                {isEmergencyActive ? (
                  <div>
                    <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{countdown}</div>
                  </div>
                ) : (
                  <div>
                    <Shield className="h-12 w-12 mx-auto mb-2" />
                    <div>SOS</div>
                  </div>
                )}
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Emergency Help
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {isEmergencyActive 
                ? 'Emergency is being processed...' 
                : 'Press and hold the SOS button to trigger emergency alert'
              }
            </p>

            {isEmergencyActive && countdown > 0 && (
              <Button
                onClick={cancelEmergency}
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                Cancel Emergency
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emergency Information Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Emergency Information
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Provide details to help responders
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type of Emergency
                </label>
                <select
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select emergency type</option>
                  {emergencyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Information
                </label>
                <Textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Describe the emergency situation, number of people involved, injuries, etc."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Location
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={location ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : ''}
                    placeholder="Location will be detected automatically"
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    onClick={getCurrentLocation}
                    variant="outline"
                    className="flex items-center"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Detect
                  </Button>
                </div>
              </div>

              {location && (
                <Button
                  onClick={shareLocation}
                  variant="outline"
                  className="w-full"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Share Location
                </Button>
              )}
            </div>
          </div>

          {/* Quick Emergency Contacts */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Emergency Contacts
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Quick access to emergency services
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {emergencyContacts.map((contact) => {
                  const Icon = contact.icon
                  return (
                    <button
                      key={contact.number}
                      onClick={() => callEmergencyNumber(contact.number)}
                      className={`${contact.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity`}
                    >
                      <Icon className="h-8 w-8 mx-auto mb-2" />
                      <div className="text-sm font-medium">{contact.name}</div>
                      <div className="text-lg font-bold">{contact.number}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Tips */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mt-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Emergency Tips
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Before Emergency
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Keep emergency contacts readily available</li>
                  <li>• Know your exact location</li>
                  <li>• Have medical information accessible</li>
                  <li>• Keep phone charged</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  During Emergency
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Stay calm and speak clearly</li>
                  <li>• Provide your exact location</li>
                  <li>• Describe the emergency clearly</li>
                  <li>• Follow dispatcher instructions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mt-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-yellow-800 dark:text-yellow-200 font-medium mb-1">
                Important Disclaimer
              </p>
              <p className="text-yellow-700 dark:text-yellow-300">
                This SOS feature complements but does not replace traditional emergency services. 
                In life-threatening situations, call emergency services (911/108) directly. 
                Ensure your device has network connectivity for this feature to work properly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SOS
