// src/pages/Fundraiser.jsx
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// Sample fundraiser data
const sampleFundraisers = [
  {
    id: 1,
    title: "Help Sarah Fight Leukemia",
    description: "Sarah is a 12-year-old girl who was recently diagnosed with acute lymphoblastic leukemia. She needs immediate treatment including chemotherapy and potentially a bone marrow transplant. The family is struggling with medical expenses and needs community support.",
    targetAmount: 500000,
    raisedAmount: 125000,
    urgency: "critical",
    hospital: "Apollo Hospital",
    organizer: "Sarah's Family",
    endDate: "2025-03-15T23:59:59",
    createdAt: "2025-01-20T10:00:00Z"
  },
  {
    id: 2,
    title: "Emergency Heart Surgery for Ravi",
    description: "Ravi, a 45-year-old father of two, needs urgent heart bypass surgery. The family has exhausted their savings and is reaching out to the community for help. Every contribution counts towards saving his life.",
    targetAmount: 300000,
    raisedAmount: 45000,
    urgency: "urgent",
    hospital: "Fortis Hospital",
    organizer: "Ravi's Friends",
    endDate: "2025-02-28T23:59:59",
    createdAt: "2025-01-18T14:30:00Z"
  },
  {
    id: 3,
    title: "Support Maria's Cancer Treatment",
    description: "Maria is battling breast cancer and needs funds for her ongoing chemotherapy sessions. As a single mother, she's finding it difficult to manage the treatment costs while taking care of her two young children.",
    targetAmount: 200000,
    raisedAmount: 200000, // Completed campaign
    urgency: "normal",
    hospital: "City Hospital",
    organizer: "Maria's Community",
    endDate: "2025-04-10T23:59:59",
    createdAt: "2025-01-15T09:00:00Z"
  }
]

// Schema validation
const schema = yup.object({
  title: yup.string().required('Title is required').min(10, 'Title must be at least 10 characters'),
  description: yup.string().required('Description is required').min(50, 'Description must be at least 50 characters'),
  targetAmount: yup.number()
    .transform((value, originalValue) => originalValue === '' ? undefined : Number(originalValue))
    .positive('Amount must be positive')
    .required('Target amount is required'),
  organizer: yup.string().required('Organizer name is required'),
  hospital: yup.string().required('Hospital name is required'),
})

// Custom hook to detect mobile viewport
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 600 : false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isMobile
}

const Fundraiser = () => {
  const isMobile = useIsMobile()

  const [fundraisers, setFundraisers] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema)
  })

  // Load sample data when component mounts
  useEffect(() => {
    setFundraisers(sampleFundraisers)
  }, [])

  const onSubmit = async (data) => {
    console.log('Form submitted with data:', data)
    setIsSubmitting(true)
    
    try {
      // Create new fundraiser
      const newFundraiser = {
        id: Date.now(),
        ...data,
        raisedAmount: 0,
        urgency: 'normal', // Default urgency
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        createdAt: new Date().toISOString()
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Add to the list
      setFundraisers(prev => [newFundraiser, ...prev])
      
      alert('Fundraiser created successfully!')
      
      reset()
      setShowCreateForm(false)
      
    } catch (error) {
      console.error('Submit error:', error)
      alert('Failed to create fundraiser. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDonate = (fundraiser) => {
    if (fundraiser.raisedAmount >= fundraiser.targetAmount) {
      alert(`This campaign has already reached its goal! ₹${fundraiser.targetAmount.toLocaleString()} has been raised.`)
    } else {
      alert(`Donation feature for "${fundraiser.title}" - Payment gateway would be integrated here. Still need ₹${(fundraiser.targetAmount - fundraiser.raisedAmount).toLocaleString()} more.`)
    }
  }

  const urgencyColors = {
    critical: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
    urgent: { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
    normal: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' }
  }

  // Responsive styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '20px',
      maxWidth: 1200,
      margin: '0 auto',
    },
    header: {
      backgroundColor: '#16a34a',
      color: 'white',
      padding: '48px 20px',
      textAlign: 'center',
    },
    headerButton: {
      backgroundColor: 'white',
      color: '#16a34a',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: 'pointer',
      fontWeight: '600',
      maxWidth: isMobile ? '100%' : 200,
      width: '100%',
      marginTop: isMobile ? 12 : 0,
    },
    formContainer: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 24,
      marginBottom: 32,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      width: '100%',
      boxSizing: 'border-box',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      width: '100%',
    },
    inputFullWidth: {
      width: '100%',
      padding: '8px 12px',
      borderRadius: 6,
      fontSize: 16,
      border: '1px solid #d1d5db',
      boxSizing: 'border-box',
    },
    buttonsContainer: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: 12,
      marginTop: 16,
      width: '100%',
    },
    button: {
      flex: 1,
      width: '100%',
      padding: '12px 24px',
      border: 'none',
      borderRadius: 6,
      fontSize: 16,
      fontWeight: 500,
      cursor: 'pointer',
    },
    fundraiserGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: 24,
    },
    fundraiserCard: {
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      padding: 20,
    },
    donateButton: (isCompleted) => ({
      width: '100%',
      backgroundColor: isCompleted ? '#059669' : '#16a34a',
      color: 'white',
      padding: '10px 16px',
      border: 'none',
      borderRadius: 6,
      fontSize: 14,
      cursor: 'pointer',
      fontWeight: 500,
      opacity: isCompleted ? 0.9 : 1,
    }),
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Medical Fundraisers</h1>
        <p style={{ fontSize: '1.2rem', margin: '16px 0' }}>
          Help families raise funds for medical emergencies and treatments
        </p>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={styles.headerButton}
        >
          {showCreateForm ? 'Hide' : 'Start'} Fundraiser
        </button>
      </div>

      <div style={{ padding: '32px 16px' }}>
        {/* Create Form */}
        {showCreateForm && (
          <div style={styles.formContainer}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px' }}>Start New Fundraiser</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
              {/* Title */}
              <div>
                <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>Campaign Title *</label>
                <input
                  {...register('title')}
                  placeholder="e.g., Help John Fight Cancer"
                  style={{
                    ...styles.inputFullWidth,
                    border: errors.title ? '2px solid #ef4444' : '1px solid #d1d5db'
                  }}
                />
                {errors.title && <p style={{ color: '#ef4444', fontSize: 14, marginTop: 4 }}>{errors.title.message}</p>}
              </div>

              {/* Target Amount */}
              <div>
                <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>Target Amount (₹) *</label>
                <input
                  {...register('targetAmount')}
                  type="number"
                  placeholder="500000"
                  style={{
                    ...styles.inputFullWidth,
                    border: errors.targetAmount ? '2px solid #ef4444' : '1px solid #d1d5db'
                  }}
                />
                {errors.targetAmount && <p style={{ color: '#ef4444', fontSize: 14, marginTop: 4 }}>{errors.targetAmount.message}</p>}
              </div>

              {/* Hospital */}
              <div>
                <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>Hospital/Medical Center *</label>
                <input
                  {...register('hospital')}
                  placeholder="Hospital name"
                  style={{
                    ...styles.inputFullWidth,
                    border: errors.hospital ? '2px solid #ef4444' : '1px solid #d1d5db'
                  }}
                />
                {errors.hospital && <p style={{ color: '#ef4444', fontSize: 14, marginTop: 4 }}>{errors.hospital.message}</p>}
              </div>

              {/* Organizer */}
              <div>
                <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>Organizer Name *</label>
                <input
                  {...register('organizer')}
                  placeholder="Your name or organization"
                  style={{
                    ...styles.inputFullWidth,
                    border: errors.organizer ? '2px solid #ef4444' : '1px solid #d1d5db'
                  }}
                />
                {errors.organizer && <p style={{ color: '#ef4444', fontSize: 14, marginTop: 4 }}>{errors.organizer.message}</p>}
              </div>

              {/* Description */}
              <div>
                <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>Description *</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="Describe the medical situation and why funds are needed (minimum 50 characters)"
                  style={{
                    ...styles.inputFullWidth,
                    border: errors.description ? '2px solid #ef4444' : '1px solid #d1d5db',
                    resize: 'vertical',
                  }}
                />
                {errors.description && <p style={{ color: '#ef4444', fontSize: 14, marginTop: 4 }}>{errors.description.message}</p>}
              </div>

              {/* Submit Buttons */}
              <div style={styles.buttonsContainer}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    ...styles.button,
                    backgroundColor: isSubmitting ? '#9ca3af' : '#16a34a',
                    color: 'white',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting ? 'Creating...' : 'Create Fundraiser'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  disabled={isSubmitting}
                  style={{
                    ...styles.button,
                    backgroundColor: '#6b7280',
                    color: 'white',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Fundraiser Cards */}
        <div style={{ backgroundColor: 'white', borderRadius: 8, padding: 24, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 24 }}>
            Active Fundraisers ({fundraisers.length})
          </h2>

          <div style={styles.fundraiserGrid}>
            {fundraisers.map((fundraiser) => {
              const progressPercentage = (fundraiser.raisedAmount / fundraiser.targetAmount) * 100
              const daysLeft = Math.ceil((new Date(fundraiser.endDate) - new Date()) / (1000 * 60 * 60 * 24))
              const isCompleted = fundraiser.raisedAmount >= fundraiser.targetAmount
              
              return (
                <div key={fundraiser.id} style={styles.fundraiserCard}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16, flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', margin: 0, flex: 1, marginRight: 12 }}>
                      {fundraiser.title}
                    </h3>
                    <span style={{ 
                      backgroundColor: urgencyColors[fundraiser.urgency].bg, 
                      color: urgencyColors[fundraiser.urgency].text, 
                      border: `1px solid ${urgencyColors[fundraiser.urgency].border}`, 
                      padding: '4px 8px', 
                      borderRadius: 4, 
                      fontSize: 12, 
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      marginTop: isMobile ? 8 : 0,
                      minWidth: 80,
                      textAlign: 'center'
                    }}>
                      {fundraiser.urgency}
                    </span>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: 14, color: '#374151', marginBottom: 16, lineHeight: 1.5 }}>
                    {fundraiser.description.length > 150
                      ? fundraiser.description.substring(0, 150) + '...'
                      : fundraiser.description
                    }
                  </p>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>
                        ₹{fundraiser.raisedAmount.toLocaleString()} raised
                      </span>
                      <span style={{ fontSize: 12, color: '#6b7280' }}>
                        ₹{fundraiser.targetAmount.toLocaleString()} goal
                      </span>
                    </div>
                    <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: 4, height: 8 }}>
                      <div
                        style={{
                          width: `${Math.min(progressPercentage, 100)}%`,
                          backgroundColor: isCompleted ? '#059669' : '#16a34a',
                          height: 8,
                          borderRadius: 4,
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontSize: 12, color: '#6b7280' }}>
                      <span>{progressPercentage.toFixed(1)}% funded</span>
                      <span>{isCompleted ? '🎉 Goal Reached!' : `${daysLeft > 0 ? `${daysLeft} days left` : 'Time expired'}`}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ fontSize: 14, color: '#374151', marginBottom: 16, lineHeight: 1.5 }}>
                    <p style={{ margin: '4px 0' }}><strong>Organizer:</strong> {fundraiser.organizer}</p>
                    <p style={{ margin: '4px 0' }}><strong>Hospital:</strong> {fundraiser.hospital}</p>
                  </div>

                  {/* Donate Button */}
                  <button
                    onClick={() => handleDonate(fundraiser)}
                    style={styles.donateButton(isCompleted)}
                  >
                    {isCompleted ? '✓ Goal Reached - Campaign Ended' : 'Contribute Now'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Fundraiser
