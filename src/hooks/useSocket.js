import { useEffect } from 'react'
import io from 'socket.io-client'
import { toast } from 'react-toastify'

export const useSocket = () => {
  useEffect(() => {
    // Initialize socket connection
    const socket = io(process.env.VITE_API_URL || 'http://localhost:5000')

    socket.on('connect', () => {
      console.log('Connected to server')
    })

    socket.on('newComplaint', (complaint) => {
      toast.info(`New issue reported: ${complaint.title}`)
    })

    socket.on('bloodRequestUpdate', (request) => {
      toast.error(`Urgent: Blood donation needed for ${request.patientName}`)
    })

    socket.on('issueStatusUpdate', (update) => {
      toast.success(`Issue #${update.id} status changed to ${update.status}`)
    })

    return () => {
      socket.disconnect()
    }
  }, [])
}
