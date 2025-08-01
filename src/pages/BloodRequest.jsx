// src/pages/BloodRequest.jsx
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// Sample data
const sampleDonations = [
  {
    id: 1,
    patientName: "John Doe",
    bloodType: "A+",
    urgency: "critical",
    hospital: "City General Hospital",
    location: "New York, NY",
    contactPerson: "Dr. Smith",
    contactPhone: "+1234567890",
    unitsNeeded: 2,
    unitsCollected: 0,
    requiredBy: "2025-01-30T10:00:00",
    description: "Patient requires urgent blood transfusion for surgery. Critical condition requires immediate attention.",
    coordinates: [40.7128, -74.0060],
    createdAt: "2025-01-25T08:00:00Z"
  },
  {
    id: 2,
    patientName: "Jane Smith",
    bloodType: "O-",
    urgency: "urgent",
    hospital: "Metropolitan Medical Center",
    location: "Los Angeles, CA",
    contactPerson: "Dr. Johnson",
    contactPhone: "+1987654321",
    unitsNeeded: 3,
    unitsCollected: 1,
    requiredBy: "2025-02-01T14:00:00",
    description: "Emergency case requiring immediate blood donation for accident victim in ICU.",
    coordinates: [34.0522, -118.2437],
    createdAt: "2025-01-24T12:00:00Z"
  },
  {
    id: 3,
    patientName: "Mike Wilson",
    bloodType: "B+",
    urgency: "normal",
    hospital: "General Hospital",
    location: "Chicago, IL",
    contactPerson: "Dr. Brown",
    contactPhone: "+1122334455",
    unitsNeeded: 1,
    unitsCollected: 0,
    requiredBy: "2025-02-05T09:00:00",
    description: "Scheduled surgery requiring blood transfusion. Patient is stable and surgery is planned.",
    coordinates: [41.8781, -87.6298],
    createdAt: "2025-01-23T15:00:00Z"
  }
]

// Yup schema
const schema = yup.object({
  patientName: yup
    .string()
    .required('Patient name is required')
    .min(2, 'Name must be at least 2 characters'),
  bloodType: yup
    .string()
    .required('Blood type is required'),
  hospital: yup
    .string()
    .required('Hospital name is required'),
  urgency: yup
    .string()
    .required('Urgency level is required'),
  unitsNeeded: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : Number(originalValue);
    })
    .positive('Must be a positive number')
    .integer('Must be a whole number')
    .required('Units needed is required'),
  contactPhone: yup
    .string()
    .required('Phone number is required')
    .min(10, 'Phone number must be at least 10 digits'),
  contactPerson: yup
    .string()
    .required('Contact person is required'),
  location: yup
    .string()
    .required('Location is required'),
  description: yup
    .string()
    .required('Description is required')
    .min(20, 'Description must be at least 20 characters'),
})

const BloodRequest = () => {
  const [donations, setDonations] = useState([])
  const [filteredDonations, setFilteredDonations] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [bloodTypeFilter, setBloodTypeFilter] = useState('')
  const [urgencyFilter, setUrgencyFilter] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema)
  })

  // Initialize sample data
  useEffect(() => {
    setDonations(sampleDonations)
    setFilteredDonations(sampleDonations)
  }, [])

  // Filter donations based on search and filters
  useEffect(() => {
    let filtered = donations

    if (searchTerm) {
      filtered = filtered.filter(donation =>
        donation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (bloodTypeFilter) {
      filtered = filtered.filter(donation => donation.bloodType === bloodTypeFilter)
    }

    if (urgencyFilter) {
      filtered = filtered.filter(donation => donation.urgency === urgencyFilter)
    }

    // Sort by urgency (critical first)
    filtered.sort((a, b) => {
      const urgencyOrder = { critical: 3, urgent: 2, normal: 1 }
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency]
    })

    setFilteredDonations(filtered)
  }, [donations, searchTerm, bloodTypeFilter, urgencyFilter])

  const onSubmit = async (data) => {
    console.log('Form submitted with data:', data)
    setIsSubmitting(true)
    
    try {
      // Create new request
      const newRequest = {
        id: Date.now(),
        ...data,
        coordinates: [28.5355 + Math.random() * 0.1, 77.3910 + Math.random() * 0.1], // Mock coordinates
        unitsCollected: 0,
        createdAt: new Date().toISOString(),
        requiredBy: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setDonations(prev => [newRequest, ...prev])
      
      alert('Blood request created successfully!')
      
      reset()
      setShowCreateForm(false)
      
    } catch (error) {
      console.error('Submit error:', error)
      alert('Failed to create blood request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContact = (phone) => {
    window.open(`tel:${phone}`)
  }

  const urgencyLevels = [
    { value: 'critical', label: 'Critical' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'normal', label: 'Normal' }
  ]

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  const urgencyColors = {
    critical: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
    urgent: { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
    normal: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' }
  }

  console.log('BloodRequest component rendered with', filteredDonations.length, 'donations')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '20px' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#dc2626', color: 'white', padding: '48px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Blood Donation</h1>
        <p style={{ fontSize: '1.2rem', margin: '16px 0' }}>
          Save lives by donating blood or requesting help for those in need
        </p>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            backgroundColor: 'white',
            color: '#dc2626',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          {showCreateForm ? 'Hide' : 'Create'} Blood Request
        </button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Create Request Form */}
        {showCreateForm && (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', marginBottom: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px' }}>Create Blood Request</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {/* Patient Name */}
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Patient Name *</label>
                <input {...register('patientName')} placeholder="Full name of patient" style={{ width: '100%', padding: '8px 12px', border: errors.patientName ? '2px solid #ef4444' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' }} />
                {errors.patientName && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.patientName.message}</p>}
              </div>

              {/* Blood Type */}
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Blood Type *</label>
                <select {...register('bloodType')} style={{ width: '100%', padding: '8px 12px', border: errors.bloodType ? '2px solid #ef4444' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' }}>
                  <option value="">Select blood type</option>
                  {bloodTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
                {errors.bloodType && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.bloodType.message}</p>}
              </div>

              {/* Hospital */}
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Hospital *</label>
                <input {...register('hospital')} placeholder="Hospital name" style={{ width: '100%', padding: '8px 12px', border: errors.hospital ? '2px solid #ef4444' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' }} />
                {errors.hospital && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.hospital.message}</p>}
              </div>

              {/* Urgency */}
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Urgency Level *</label>
                <select {...register('urgency')} style={{ width: '100%', padding: '8px 12px', border: errors.urgency ? '2px solid #ef4444' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' }}>
                  <option value="">Select urgency</option>
                  {urgencyLevels.map((level) => <option key={level.value} value={level.value}>{level.label}</option>)}
                </select>
                {errors.urgency && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.urgency.message}</p>}
              </div>

              {/* Units Needed */}
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Units Needed *</label>
                <input {...register('unitsNeeded')} type="number" min="1" placeholder="Number of units" style={{ width: '100%', padding: '8px 12px', border: errors.unitsNeeded ? '2px solid #ef4444' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' }} />
                {errors.unitsNeeded && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.unitsNeeded.message}</p>}
              </div>

              {/* Contact Person */}
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Contact Person *</label>
                <input {...register('contactPerson')} placeholder="Contact person name" style={{ width: '100%', padding: '8px 12px', border: errors.contactPerson ? '2px solid #ef4444' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' }} />
                {errors.contactPerson && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.contactPerson.message}</p>}
              </div>

              {/* Contact Phone */}
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Contact Phone *</label>
                <input {...register('contactPhone')} placeholder="+91 XXXXX XXXXX" style={{ width: '100%', padding: '8px 12px', border: errors.contactPhone ? '2px solid #ef4444' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' }} />
                {errors.contactPhone && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.contactPhone.message}</p>}
              </div>

              {/* Location */}
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Location *</label>
                <input {...register('location')} placeholder="Hospital address or location" style={{ width: '100%', padding: '8px 12px', border: errors.location ? '2px solid #ef4444' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' }} />
                {errors.location && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.location.message}</p>}
              </div>

              {/* Description - Full width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>Description *</label>
                <textarea {...register('description')} rows={3} placeholder="Additional details about the patient's condition and urgency (minimum 20 characters)" style={{ width: '100%', padding: '8px 12px', border: errors.description ? '2px solid #ef4444' : '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px', resize: 'vertical' }} />
                {errors.description && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>{errors.description.message}</p>}
              </div>

              {/* Submit Buttons */}
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" disabled={isSubmitting} style={{ backgroundColor: isSubmitting ? '#9ca3af' : '#dc2626', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: '500' }}>
                  {isSubmitting ? 'Creating...' : 'Create Request'}
                </button>
                <button type="button" onClick={() => setShowCreateForm(false)} disabled={isSubmitting} style={{ backgroundColor: '#6b7280', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', marginBottom: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <input
              placeholder="Search by patient, hospital, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: '1', minWidth: '300px', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' }}
            />
            
            <select value={bloodTypeFilter} onChange={(e) => setBloodTypeFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' }}>
              <option value="">All Blood Types</option>
              {bloodTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>

            <select value={urgencyFilter} onChange={(e) => setUrgencyFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' }}>
              <option value="">All Urgency Levels</option>
              {urgencyLevels.map((level) => <option key={level.value} value={level.value}>{level.label}</option>)}
            </select>
          </div>
        </div>

        {/* Blood Requests */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>
            Blood Requests ({filteredDonations.length})
          </h2>

          {filteredDonations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>No blood requests found</h3>
              <p style={{ color: '#6b7280' }}>Try adjusting your search criteria or create a new request.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
              {filteredDonations.map((donation) => (
                <div key={donation.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', margin: 0 }}>{donation.patientName}</h3>
                    <span style={{ 
                      backgroundColor: urgencyColors[donation.urgency].bg, 
                      color: urgencyColors[donation.urgency].text, 
                      border: `1px solid ${urgencyColors[donation.urgency].border}`, 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '12px', 
                      fontWeight: '500',
                      textTransform: 'uppercase'
                    }}>
                      {donation.urgency}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '14px', color: '#374151', marginBottom: '16px', lineHeight: '1.5' }}>
                    <p style={{ margin: '4px 0' }}><strong>Blood Type:</strong> {donation.bloodType}</p>
                    <p style={{ margin: '4px 0' }}><strong>Hospital:</strong> {donation.hospital}</p>
                    <p style={{ margin: '4px 0' }}><strong>Location:</strong> {donation.location}</p>
                    <p style={{ margin: '4px 0' }}><strong>Units Needed:</strong> {donation.unitsNeeded}</p>
                    <p style={{ margin: '4px 0' }}><strong>Required By:</strong> {new Date(donation.requiredBy).toLocaleDateString()}</p>
                    <p style={{ margin: '8px 0 0 0' }}><strong>Description:</strong> {donation.description}</p>
                  </div>
                  
                  <button
                    onClick={() => handleContact(donation.contactPhone)}
                    style={{
                      width: '100%',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      padding: '10px 16px',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Contact: {donation.contactPerson} ({donation.contactPhone})
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BloodRequest
