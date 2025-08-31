'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  MapPin, 
  Phone, 
  Star, 
  Clock, 
  Navigation,
  Hospital,
  Stethoscope,
  AlertCircle
} from 'lucide-react'

interface Doctor {
  id: string
  name: string
  specialty: string
  rating: number
  address: string
  phone: string
  distance: string
  availability: string
}

interface HospitalData {
  id: string
  name: string
  type: string
  address: string
  phone: string
  emergency: boolean
  distance: string
}

export default function DoctorFinder() {
  const [searchLocation, setSearchLocation] = useState('')
  const [searchType, setSearchType] = useState('all')
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [hospitals, setHospitals] = useState<HospitalData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!searchLocation.trim()) return

    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        location: searchLocation,
        type: searchType
      })

      const response = await fetch(`/api/doctor-finder?${params}`)
      const data = await response.json()

      if (response.ok) {
        setDoctors(data.doctors || [])
        setHospitals(data.hospitals || [])
        setHasSearched(true)
      } else {
        console.error('Search failed:', data.error)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookAppointment = async (doctorId: string) => {
    try {
      const response = await fetch('/api/doctor-finder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctorId,
          appointmentTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          patientInfo: {
            name: 'Patient',
            phone: '+1-555-0000'
          }
        })
      })

      const data = await response.json()
      if (response.ok) {
        alert('Appointment request submitted! You will receive a confirmation call within 24 hours.')
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('Failed to book appointment. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Healthcare Providers
          </h1>
          <p className="text-xl text-gray-600">
            Locate nearby doctors and hospitals for your healthcare needs
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2 text-primary" />
                Search Healthcare Providers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="Enter city, zip code, or address"
                    className="rounded-xl"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Providers</option>
                  <option value="doctors">Doctors Only</option>
                  <option value="hospitals">Hospitals Only</option>
                </select>
                <Button
                  onClick={handleSearch}
                  disabled={isLoading || !searchLocation.trim()}
                  className="rounded-xl px-8"
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-0">
              <div className="h-64 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-gray-600">Interactive Map</p>
                  <p className="text-sm text-gray-500">Google Maps integration would appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        {hasSearched && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Doctors */}
            {doctors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Stethoscope className="w-6 h-6 mr-2 text-primary" />
                  Doctors ({doctors.length})
                </h2>
                <div className="space-y-4">
                  {doctors.map((doctor) => (
                    <Card key={doctor.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                            <p className="text-primary font-medium">{doctor.specialty}</p>
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="text-sm font-medium">{doctor.rating}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            {doctor.address} • {doctor.distance}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            {doctor.phone}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            {doctor.availability}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleBookAppointment(doctor.id)}
                            className="flex-1 rounded-xl"
                          >
                            Book Appointment
                          </Button>
                          <Button variant="outline" className="rounded-xl">
                            <Navigation className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Hospitals */}
            {hospitals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Hospital className="w-6 h-6 mr-2 text-primary" />
                  Hospitals & Clinics ({hospitals.length})
                </h2>
                <div className="space-y-4">
                  {hospitals.map((hospital) => (
                    <Card key={hospital.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{hospital.name}</h3>
                            <p className="text-primary font-medium">{hospital.type}</p>
                          </div>
                          {hospital.emergency && (
                            <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-full">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              <span className="text-xs font-medium">Emergency</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            {hospital.address} • {hospital.distance}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            {hospital.phone}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button className="flex-1 rounded-xl">
                            View Details
                          </Button>
                          <Button variant="outline" className="rounded-xl">
                            <Navigation className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* No Results */}
        {hasSearched && doctors.length === 0 && hospitals.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">Try searching with a different location or criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
