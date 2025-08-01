export const sampleComplaints = [
  {
    id: 1,
    title: "Garbage overflow near Central Park",
    description: "Large amounts of garbage have been accumulating near the Central Park entrance for over a week. The smell is becoming unbearable and attracting stray animals. Multiple bins are overflowing and need immediate attention.",
    location: "Central Park Entrance, Sector 15",
    coordinates: [28.5355, 77.3910],
    reportedBy: "Rahul Sharma",
    contactInfo: "+91 9876543210",
    status: "pending",
    priority: "high",
    category: "garbage",
    images: [
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400",
      "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400"
    ],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    title: "Water pipe leak on MG Road",
    description: "Major water pipe has burst on MG Road causing significant water logging and traffic disruption. The leak has been ongoing since yesterday morning and is affecting nearby shops and residences.",
    location: "MG Road, near Metro Station",
    coordinates: [28.5421, 77.3931],
    reportedBy: "Priya Patel",
    contactInfo: "+91 9876543211",
    status: "verified",
    priority: "critical",
    category: "water",
    images: [
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400"
    ],
    createdAt: "2024-01-14T08:15:00Z",
    updatedAt: "2024-01-15T09:20:00Z"
  },
  {
    id: 3,
    title: "Broken streetlight creating safety hazard",
    description: "The streetlight at the corner of residential block B has been non-functional for over two weeks. This is creating a safety concern for residents, especially women and elderly people walking in the evening.",
    location: "Block B, Residential Area",
    coordinates: [28.5389, 77.3889],
    reportedBy: "Amit Kumar",
    contactInfo: "+91 9876543212",
    status: "resolved",
    priority: "medium",
    category: "infrastructure",
    images: [],
    createdAt: "2024-01-10T19:45:00Z",
    updatedAt: "2024-01-14T14:30:00Z"
  }
]

export const sampleDonations = [
  {
    id: 1,
    patientName: "Ravi Mehta",
    bloodType: "O-",
    urgency: "critical",
    hospital: "AIIMS Delhi",
    location: "Ansari Nagar, New Delhi",
    coordinates: [28.5672, 77.2100],
    contactPerson: "Dr. Sarah Johnson",
    contactPhone: "+91 9876543220",
    unitsNeeded: 4,
    unitsCollected: 1,
    requiredBy: "2024-01-16T12:00:00Z",
    description: "Patient requires urgent O- blood for emergency surgery following a car accident. Any help would be greatly appreciated by the family.",
    createdAt: "2024-01-15T14:20:00Z"
  },
  {
    id: 2,
    patientName: "Anita Singh",
    bloodType: "A+",
    urgency: "urgent",
    hospital: "Fortis Hospital",
    location: "Sector 62, Noida",
    coordinates: [28.6139, 77.3678],
    contactPerson: "Suresh Singh",
    contactPhone: "+91 9876543221",
    unitsNeeded: 2,
    unitsCollected: 0,
    requiredBy: "2024-01-17T10:00:00Z",
    description: "My mother needs A+ blood for her cancer treatment. We are looking for voluntary donors who can help during this difficult time.",
    createdAt: "2024-01-15T11:45:00Z"
  },
  {
    id: 3,
    patientName: "Child Patient",
    bloodType: "B+",
    urgency: "normal",
    hospital: "Max Hospital",
    location: "Saket, New Delhi",
    coordinates: [28.5244, 77.2066],
    contactPerson: "Dr. Rajesh Kumar",
    contactPhone: "+91 9876543222",
    unitsNeeded: 1,
    unitsCollected: 0,
    requiredBy: "2024-01-20T15:00:00Z",
    description: "Young patient requires B+ blood for scheduled surgery. The family is requesting community support for this medical procedure.",
    createdAt: "2024-01-15T09:30:00Z"
  }
]

export const sampleFundraisers = [
  {
    id: 1,
    title: "Help Rajesh Fight Cancer",
    description: "Rajesh, a 45-year-old auto driver, has been diagnosed with stage 3 cancer. He needs urgent financial support for his treatment including chemotherapy and surgery.",
    targetAmount: 500000,
    raisedAmount: 125000,
    organizer: "Meera Rajesh",
    contactInfo: "+91 9876543230",
    category: "medical",
    urgency: "critical",
    hospital: "Tata Memorial Hospital",
    location: "Mumbai, Maharashtra",
    images: ["https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400"],
    endDate: "2024-02-15T23:59:59Z",
    createdAt: "2024-01-10T12:00:00Z"
  },
  {
    id: 2,
    title: "Save Little Arya's Life",
    description: "3-year-old Arya needs a heart surgery that costs 8 lakhs. Her family cannot afford the expensive treatment. Please help save this innocent life.",
    targetAmount: 800000,
    raisedAmount: 245000,
    organizer: "Children's Welfare Society",
    contactInfo: "+91 9876543231",
    category: "medical",
    urgency: "critical",
    hospital: "Fortis Escorts Heart Institute",
    location: "New Delhi",
    images: ["https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400"],
    endDate: "2024-01-30T23:59:59Z",
    createdAt: "2024-01-12T15:30:00Z"
  }
]
