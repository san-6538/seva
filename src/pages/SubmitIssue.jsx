import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
    control,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    resolver: yupResolver(schema)
  })

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
          setValue('location', `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`)
          toast.success('Location detected successfully')
        },
        () => {
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
      const imageUrls = images.map(img => img.preview)

      const complaintData = {
        ...data,
        images: imageUrls,
        coordinates: currentLocation ? [currentLocation.latitude, currentLocation.longitude] : null,
        reportedBy: 'Current User',
        status: 'pending',
        createdAt: new Date().toISOString()
      }

      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('Complaint submitted:', complaintData)
      toast.success('Issue reported successfully!')

      reset()
      setImages([])
      setCurrentLocation(null)
    } catch {
      toast.error('Failed to submit issue. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="px-6 py-8 border-b border-gray-200 flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="p-2 bg-red-100 rounded-full flex-shrink-0">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Report an Issue</h1>
            <p className="text-gray-600 max-w-md">Help improve your community by reporting civic problems</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Issue Title *</label>
            <Input
              {...register('title')}
              placeholder="Brief description of the issue"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || ''} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 ${
                        errors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <SelectValue
                        placeholder="Select category"
                        className="text-gray-900 placeholder:text-gray-500"
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {categories.map(({ value, label }) => (
                        <SelectItem key={value} value={value} className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-900 select-none">
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || ''} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 ${
                        errors.priority ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <SelectValue
                        placeholder="Select priority"
                        className="text-gray-900 placeholder:text-gray-500"
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {priorities.map(({ value, label }) => (
                        <SelectItem key={value} value={value} className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-900 select-none">
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.priority && <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description *</label>
            <Textarea
              {...register('description')}
              rows={4}
              placeholder="Provide detailed information about the issue"
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                {...register('location')}
                placeholder="Enter the location of the issue"
                className={`flex-1 ${errors.location ? 'border-red-500' : ''}`}
              />
              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                className="flex items-center justify-center space-x-2 min-w-[140px]"
              >
                <MapPin className="h-4 w-4" />
                <span>Use Current</span>
              </Button>
            </div>
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
          </div>

          {/* Contact Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Information *</label>
            <Input
              {...register('contactInfo')}
              placeholder="Your phone number or email"
              className={errors.contactInfo ? 'border-red-500' : ''}
            />
            {errors.contactInfo && <p className="mt-1 text-sm text-red-600">{errors.contactInfo.message}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Images (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="mb-4">
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 select-none"
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
                <p className="text-sm text-gray-600">Maximum 5 images, 5MB each</p>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Uploaded Images ({images.length}/5)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative group rounded-lg overflow-hidden">
                        <img
                          src={image.preview}
                          alt="Preview"
                          className="w-full h-20 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
                          aria-label="Remove image"
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

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                setImages([])
                setCurrentLocation(null)
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Issue'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SubmitIssue
