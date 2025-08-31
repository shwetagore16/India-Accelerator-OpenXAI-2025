'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Plus, 
  Calendar, 
  Clock, 
  Pill, 
  Edit, 
  Trash2,
  Bell,
  CheckCircle
} from 'lucide-react'

interface Reminder {
  id: string
  medicineName: string
  dosage: string
  frequency: string
  time: string
  startDate: string
  endDate?: string
  notes?: string
  isActive: boolean
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    medicineName: '',
    dosage: '',
    frequency: 'Daily',
    time: '',
    startDate: '',
    endDate: '',
    notes: ''
  })

  useEffect(() => {
    fetchReminders()
  }, [])

  const fetchReminders = async () => {
    try {
      const response = await fetch('/api/reminders')
      const data = await response.json()
      if (response.ok) {
        setReminders(data.reminders)
      }
    } catch (error) {
      console.error('Failed to fetch reminders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchReminders()
        setShowForm(false)
        setFormData({
          medicineName: '',
          dosage: '',
          frequency: 'Daily',
          time: '',
          startDate: '',
          endDate: '',
          notes: ''
        })
      }
    } catch (error) {
      console.error('Failed to create reminder:', error)
    }
  }

  const deleteReminder = async (id: string) => {
    try {
      const response = await fetch(`/api/reminders?id=${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        await fetchReminders()
      }
    } catch (error) {
      console.error('Failed to delete reminder:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Medication Reminders
          </h1>
          <p className="text-xl text-gray-600">
            Never miss a dose with smart medication tracking
          </p>
        </motion.div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Reminders</h2>
          <Button
            onClick={() => setShowForm(true)}
            className="rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Reminder
          </Button>
        </div>

        {/* Add Reminder Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Add New Reminder</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Medicine name"
                      value={formData.medicineName}
                      onChange={(e) => setFormData(prev => ({ ...prev, medicineName: e.target.value }))}
                      required
                    />
                    <Input
                      placeholder="Dosage (e.g., 5mg)"
                      value={formData.dosage}
                      onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                      className="p-2 border rounded-xl"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="Three times daily">Three times daily</option>
                      <option value="Weekly">Weekly</option>
                    </select>
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      required
                    />
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      required
                    />
                  </div>
                  <Input
                    placeholder="Notes (optional)"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" className="rounded-xl">Save Reminder</Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="rounded-xl">
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Reminders List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Loading reminders...</div>
          ) : reminders.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="text-center py-12">
                <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reminders Yet</h3>
                <p className="text-gray-600 mb-4">Add your first medication reminder to get started</p>
                <Button onClick={() => setShowForm(true)} className="rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Reminder
                </Button>
              </CardContent>
            </Card>
          ) : (
            reminders.map((reminder) => (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Pill className="w-5 h-5 text-primary mr-2" />
                          <h3 className="text-xl font-semibold text-gray-900">{reminder.medicineName}</h3>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <span className="font-medium">Dosage:</span>
                            <span className="ml-2">{reminder.dosage}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{reminder.frequency}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{reminder.time}</span>
                          </div>
                          {reminder.notes && (
                            <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                              <span className="text-xs text-gray-500">Notes: </span>
                              <span className="text-sm">{reminder.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" className="rounded-full">
                          <Bell className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full text-red-600 hover:text-red-700"
                          onClick={() => deleteReminder(reminder.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
