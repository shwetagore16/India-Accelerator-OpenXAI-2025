'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  X, 
  Phone, 
  Video, 
  Calendar, 
  MapPin, 
  Star,
  Clock
} from 'lucide-react'

interface DoctorConnectModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DoctorConnectModal({ isOpen, onClose }: DoctorConnectModalProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)

  const doctors = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'General Medicine',
      rating: 4.8,
      experience: '15 years',
      nextAvailable: 'Today 2:30 PM',
      location: '2.5 km away',
      consultationFee: '$50'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Internal Medicine',
      rating: 4.9,
      experience: '12 years',
      nextAvailable: 'Tomorrow 10:00 AM',
      location: '3.2 km away',
      consultationFee: '$60'
    },
    {
      id: '3',
      name: 'Dr. Priya Sharma',
      specialty: 'Family Medicine',
      rating: 4.7,
      experience: '18 years',
      nextAvailable: 'Today 4:00 PM',
      location: '1.8 km away',
      consultationFee: '$45'
    }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Connect with a Doctor</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search by specialty or location</label>
            <Input placeholder="e.g., Cardiologist, Downtown clinic..." />
          </div>

          {/* Doctor List */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Available Doctors</h3>
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedDoctor === doctor.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedDoctor(doctor.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{doctor.rating}</span>
                      <span className="text-sm text-gray-500 ml-2">• {doctor.experience}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{doctor.consultationFee}</p>
                    <p className="text-xs text-gray-500">consultation</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {doctor.nextAvailable}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {doctor.location}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Consultation Options */}
          {selectedDoctor && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-gray-900">Choose Consultation Type</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                  <Phone className="w-6 h-6 mb-2 text-primary" />
                  <span className="text-sm">Phone Call</span>
                  <span className="text-xs text-gray-500">15 min</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                  <Video className="w-6 h-6 mb-2 text-primary" />
                  <span className="text-sm">Video Call</span>
                  <span className="text-xs text-gray-500">30 min</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
                  <Calendar className="w-6 h-6 mb-2 text-primary" />
                  <span className="text-sm">In-Person</span>
                  <span className="text-xs text-gray-500">45 min</span>
                </Button>
              </div>
              
              <Button className="w-full" size="lg">
                Book Appointment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
