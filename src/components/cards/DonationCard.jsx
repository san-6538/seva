import { useState } from 'react'
import { Heart, MapPin, Clock, Phone, User } from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

const DonationCard = ({ donation, onContact }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const getUrgencyColor = (urgency) => {
    switch (urgency.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 animate-pulse'
      case 'urgent':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'normal':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getBloodTypeColor = (bloodType) => {
    return 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300 border border-red-200 dark:border-red-800'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
              <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {donation.patientName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Blood Donation Required
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge className={getUrgencyColor(donation.urgency)}>
              {donation.urgency}
            </Badge>
            <Badge className={getBloodTypeColor(donation.bloodType)}>
              {donation.bloodType}
            </Badge>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            <span>{donation.hospital}</span>
            <span className="text-gray-400">•</span>
            <span>{donation.location}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Required by: {new Date(donation.requiredBy).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <User className="h-4 w-4" />
            <span>Contact: {donation.contactPerson}</span>
          </div>
        </div>

        {donation.unitsNeeded && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Units needed: {donation.unitsNeeded}
            </p>
            {donation.unitsCollected && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Collected: {donation.unitsCollected} / {donation.unitsNeeded}
              </p>
            )}
          </div>
        )}

        <div className="border-t pt-4">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {isExpanded 
              ? donation.description 
              : `${donation.description.substring(0, 100)}...`
            }
          </p>

          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-700"
            >
              {isExpanded ? 'Show Less' : 'Read More'}
            </Button>

            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onContact(donation.contactPhone)}
                className="flex items-center space-x-1"
              >
                <Phone className="h-4 w-4" />
                <span>Call</span>
              </Button>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                I Can Donate
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonationCard
