import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  })
}

const issueIcon = createCustomIcon('#ef4444') // Red for issues
const donationIcon = createCustomIcon('#dc2626') // Dark red for blood donations

const MapComponent = ({ complaints = [], donations = [], center = [28.5355, 77.3910], zoom = 12 }) => {
  const mapRef = useRef()

  useEffect(() => {
    // Add custom CSS for markers
    const style = document.createElement('style')
    style.textContent = `
      .custom-div-icon {
        background: transparent;
        border: none;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className="h-96 w-full rounded-lg"
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Issue Markers */}
      {complaints.map((complaint) => (
        <Marker
          key={`complaint-${complaint.id}`}
          position={complaint.coordinates}
          icon={issueIcon}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-gray-900">{complaint.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{complaint.location}</p>
              <p className="text-xs text-gray-500 mt-1">
                Status: <span className={`font-medium ${
                  complaint.status === 'resolved' ? 'text-green-600' :
                  complaint.status === 'verified' ? 'text-blue-600' : 'text-yellow-600'
                }`}>
                  {complaint.status}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                Priority: <span className={`font-medium ${
                  complaint.priority === 'high' ? 'text-red-600' :
                  complaint.priority === 'medium' ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {complaint.priority}
                </span>
              </p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Donation Markers */}
      {donations.map((donation) => (
        <Marker
          key={`donation-${donation.id}`}
          position={donation.coordinates}
          icon={donationIcon}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-gray-900">Blood Needed: {donation.bloodType}</h3>
              <p className="text-sm text-gray-600 mt-1">{donation.hospital}</p>
              <p className="text-sm text-gray-600">{donation.location}</p>
              <p className="text-xs text-red-600 font-medium mt-1">
                Urgency: {donation.urgency}
              </p>
              <p className="text-xs text-gray-500">
                Patient: {donation.patientName}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default MapComponent
