import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Camera, MapPin, Upload, X, AlertCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select'
import { toast } from 'react-toastify'

const schema = yup.object({
  title: yup.string().required('Title is required').min(10, 'Title must be at least 10 characters'),
  description: yup.string().required('Description is required').min(20, 'Description must be at least 20 characters'),
  category: yup.string().required('Category is required'),
  priority: yup.string().required('Priority is required'),
  location: yup.string().required('Location is required'),
  contactInfo: yup.string().required('Contact information is required')
})

const SubmitIssue = () => {
  const [images, setImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    resolver: yupResolver(schema)
  })

  const watchedCategory = watch('category')

  const categories = [
    { value: 'garbage', label: 'Garbage/Waste Management' },
    { value: 'water', label: 'Water Supply/Drainage' },
    { value: 'electricity', label: 'Electricity/Power' },
    { value: 'roads', label: 'Roads/Transportation' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'other', label: 'Other' }
  ]

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ]

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCurrentLocation({ latitude, longitude })
          // You would typically reverse geocode here to get address
          setValue('location', `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`)
          toast.success('Location detected successfully')
        },
        (error) => {
          toast.error('Unable to get location. Please enter manually.')
        }
      )
    } else {
      toast.error('Geolocation is not supported by this browser.')
    }
  }

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files)
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed')
      return
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          file,
          preview: e.target.result
        }])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId))
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    try {
      // Here you would typically upload images first and get URLs
      const imageUrls = images.map(img => img.preview) // Mock URLs
      
      const complaintData = {
        ...data,
        images: imageUrls,
        coordinates: currentLocation ? [currentLocation.latitude, currentLocation.longitude] : null,
        reportedBy: 'Current User', // This would come from auth context
        status: 'pending',
        createdAt: new Date().toISOString()
      }

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Complaint submitted:', complaintData)
      toast.success('Issue reported successfully!')
      
      // Reset form
      reset()
      setImages([])
      setCurrentLocation(null)
      
    } catch (error) {
      toast.error('Failed to submit issue. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Report an Issue
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Help improve your community by reporting civic problems
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Issue Title *
              </label>
              <Input
  {...register('title')}
  placeholder="Brief description of the issue"
  className={`bg-gray-800 text-white placeholder:text-white placeholder:opacity-70 px-4 py-2 rounded-lg ${
    errors.title ? 'border-red-500 border-2' : 'border-gray-600 border'
  }`}
/>

              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <Select onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue className="placeholder:text-white text-white" placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority *
                </label>
                <Select onValueChange={(value) => setValue('priority', value)}>
                  <SelectTrigger className={errors.priority ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.priority && (
                  <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Detailed Description *
              </label>
              <Textarea
                {...register('description')}
                rows={4}
                placeholder="Provide detailed information about the issue"
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location *
              </label>
              <div className="flex space-x-2">
                <Input
                  {...register('location')}
                  placeholder="Enter the location of the issue"
                  className={`flex-1 ${errors.location ? 'border-red-500' : ''}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  className="flex items-center space-x-2"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Use Current</span>
                </Button>
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Information *
              </label>
              <Input
                {...register('contactInfo')}
                placeholder="Your phone number or email"
                className={errors.contactInfo ? 'border-red-500' : ''}
              />
              {errors.contactInfo && (
                <p className="mt-1 text-sm text-red-600">{errors.contactInfo.message}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Images (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <div className="text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="mb-4">
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Images
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Maximum 5 images, 5MB each
                  </p>
                </div>

                {/* Image Preview */}
                {images.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Uploaded Images ({images.length}/5)
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {images.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.preview}
                            alt="Preview"
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset()
                  setImages([])
                  setCurrentLocation(null)
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Issue'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SubmitIssue
