import { NextRequest, NextResponse } from 'next/server'

interface Doctor {
  id: string
  name: string
  specialty: string
  rating: number
  address: string
  phone: string
  distance: string
  availability: string
  coordinates: {
    lat: number
    lng: number
  }
}

interface Hospital {
  id: string
  name: string
  type: string
  address: string
  phone: string
  emergency: boolean
  distance: string
  coordinates: {
    lat: number
    lng: number
  }
}

// Mock data (in production, integrate with Google Maps API and medical directories)
const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'General Practitioner',
    rating: 4.8,
    address: '123 Health Street, Medical District',
    phone: '+1-555-0101',
    distance: '0.5 km',
    availability: 'Available today',
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Internal Medicine',
    rating: 4.9,
    address: '456 Wellness Ave, Healthcare Plaza',
    phone: '+1-555-0102',
    distance: '1.2 km',
    availability: 'Next available: Tomorrow 2 PM',
    coordinates: { lat: 40.7589, lng: -73.9851 }
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Family Medicine',
    rating: 4.7,
    address: '789 Care Boulevard, Medical Center',
    phone: '+1-555-0103',
    distance: '2.1 km',
    availability: 'Available this week',
    coordinates: { lat: 40.7505, lng: -73.9934 }
  }
]

const mockHospitals: Hospital[] = [
  {
    id: '1',
    name: 'City General Hospital',
    type: 'General Hospital',
    address: '100 Hospital Drive, Downtown',
    phone: '+1-555-0201',
    emergency: true,
    distance: '1.8 km',
    coordinates: { lat: 40.7282, lng: -74.0776 }
  },
  {
    id: '2',
    name: 'Metropolitan Medical Center',
    type: 'Specialty Hospital',
    address: '200 Medical Plaza, Uptown',
    phone: '+1-555-0202',
    emergency: true,
    distance: '3.2 km',
    coordinates: { lat: 40.7831, lng: -73.9712 }
  },
  {
    id: '3',
    name: 'Community Health Clinic',
    type: 'Clinic',
    address: '300 Community Street, Suburbs',
    phone: '+1-555-0203',
    emergency: false,
    distance: '4.5 km',
    coordinates: { lat: 40.6892, lng: -74.0445 }
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location') || 'New York, NY'
    const type = searchParams.get('type') || 'all' // 'doctors', 'hospitals', 'all'
    const specialty = searchParams.get('specialty')
    const emergency = searchParams.get('emergency') === 'true'

    let results: any = {
      location,
      doctors: [],
      hospitals: [],
      timestamp: new Date().toISOString()
    }

    if (type === 'doctors' || type === 'all') {
      let filteredDoctors = [...mockDoctors]
      
      if (specialty) {
        filteredDoctors = filteredDoctors.filter(doctor => 
          doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
        )
      }

      results.doctors = filteredDoctors
    }

    if (type === 'hospitals' || type === 'all') {
      let filteredHospitals = [...mockHospitals]
      
      if (emergency) {
        filteredHospitals = filteredHospitals.filter(hospital => hospital.emergency)
      }

      results.hospitals = filteredHospitals
    }

    // In production, you would:
    // 1. Use Google Maps Places API to find real doctors/hospitals
    // 2. Integrate with medical directory APIs
    // 3. Check real-time availability
    // 4. Calculate actual distances based on user location

    return NextResponse.json(results)
  } catch (error) {
    console.error('Doctor finder error:', error)
    return NextResponse.json(
      { error: 'Failed to find healthcare providers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { doctorId, hospitalId, appointmentTime, patientInfo } = body

    // Mock appointment booking
    const appointmentId = Date.now().toString()
    
    const appointment = {
      id: appointmentId,
      doctorId,
      hospitalId,
      appointmentTime,
      patientInfo,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    // In production, you would:
    // 1. Integrate with healthcare provider booking systems
    // 2. Send confirmation emails/SMS
    // 3. Store appointment in database
    // 4. Handle payment processing if required

    return NextResponse.json({
      message: 'Appointment request submitted successfully',
      appointment,
      note: 'You will receive a confirmation call within 24 hours'
    }, { status: 201 })
  } catch (error) {
    console.error('Appointment booking error:', error)
    return NextResponse.json(
      { error: 'Failed to book appointment' },
      { status: 500 }
    )
  }
}
