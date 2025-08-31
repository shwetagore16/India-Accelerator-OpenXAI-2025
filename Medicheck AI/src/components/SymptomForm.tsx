'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  X, 
  User, 
  Calendar, 
  Activity, 
  AlertCircle,
  Save
} from 'lucide-react'

interface SymptomFormProps {
  onClose: () => void
}

export default function SymptomForm({ onClose }: SymptomFormProps) {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    duration: '',
    severity: 5,
    conditions: [] as string[],
    medications: '',
    allergies: '',
    symptoms: '',
    additionalInfo: ''
  })

  const durations = [
    'Less than 1 hour',
    '1-6 hours',
    '6-24 hours',
    '1-3 days',
    '3-7 days',
    '1-2 weeks',
    'More than 2 weeks'
  ]

  const commonConditions = [
    'Diabetes',
    'Hypertension',
    'Asthma',
    'Heart Disease',
    'Allergies',
    'Arthritis',
    'Depression',
    'Anxiety'
  ]

  const handleConditionToggle = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your API
    console.log('Form submitted:', formData)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <Activity className="w-5 h-5 mr-2 text-primary" />
            Detailed Symptom Form
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Age
                </label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="Enter your age"
                  className="rounded-xl"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <div className="flex space-x-4">
                  {['Male', 'Female', 'Other'].map(gender => (
                    <label key={gender} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formData.gender === gender}
                        onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                        className="text-primary"
                      />
                      <span className="text-sm">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Symptom Duration */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                How long have you been experiencing these symptoms?
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select duration</option>
                {durations.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
            </div>

            {/* Severity Scale */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Severity (1 = Mild, 10 = Severe)
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.severity}
                  onChange={(e) => setFormData(prev => ({ ...prev, severity: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1 (Mild)</span>
                  <span className="font-semibold text-primary">{formData.severity}</span>
                  <span>10 (Severe)</span>
                </div>
              </div>
            </div>

            {/* Pre-existing Conditions */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                Pre-existing Medical Conditions
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {commonConditions.map(condition => (
                  <label key={condition} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.conditions.includes(condition)}
                      onChange={() => handleConditionToggle(condition)}
                      className="text-primary rounded"
                    />
                    <span className="text-sm">{condition}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Current Medications
              </label>
              <Input
                value={formData.medications}
                onChange={(e) => setFormData(prev => ({ ...prev, medications: e.target.value }))}
                placeholder="List any medications you're currently taking"
                className="rounded-xl"
              />
            </div>

            {/* Allergies */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Known Allergies
              </label>
              <Input
                value={formData.allergies}
                onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                placeholder="List any known allergies"
                className="rounded-xl"
              />
            </div>

            {/* Detailed Symptoms */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Detailed Symptom Description
              </label>
              <textarea
                value={formData.symptoms}
                onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                placeholder="Describe your symptoms in detail..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            {/* Additional Information */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Additional Information
              </label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                placeholder="Any other relevant information (recent travel, exposure, etc.)"
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl"
              >
                <Save className="w-4 h-4 mr-2" />
                Save & Analyze
              </Button>
            </div>
          </form>

          {/* Disclaimer */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-xs text-yellow-800">
              <AlertCircle className="inline w-3 h-3 mr-1" />
              <strong>Important:</strong> This information will be used to provide health guidance only. 
              This is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
