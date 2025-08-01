import { useState } from 'react'
import { MapPin, Clock, User, Camera } from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

const ComplaintCard = ({ complaint, isAdmin = false, onStatusChange }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'verified':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'medium':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {complaint.title}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{complaint.reportedBy}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{complaint.location}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge className={getStatusColor(complaint.status)}>
              {complaint.status}
            </Badge>
            <Badge className={getPriorityColor(complaint.priority)}>
              {complaint.priority} Priority
            </Badge>
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
          {isExpanded ? complaint.description : `${complaint.description.substring(0, 150)}...`}
        </p>

        {complaint.images && complaint.images.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Camera className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                {complaint.images.length} image(s) attached
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 max-w-md">
              {complaint.images.slice(0, 3).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Issue ${index + 1}`}
                  className="h-16 w-full object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-700"
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </Button>

          {isAdmin && (
            <div className="flex space-x-2">
              {complaint.status === 'pending' && (
                <Button
                  size="sm"
                  onClick={() => onStatusChange(complaint.id, 'verified')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Verify
                </Button>
              )}
              {complaint.status === 'verified' && (
                <Button
                  size="sm"
                  onClick={() => onStatusChange(complaint.id, 'resolved')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Mark Resolved
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ComplaintCard
