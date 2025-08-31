import { NextRequest, NextResponse } from 'next/server'

interface Reminder {
  id: string
  userId: string
  medicineName: string
  dosage: string
  frequency: string
  time: string
  startDate: string
  endDate?: string
  notes?: string
  isActive: boolean
  createdAt: string
}

// In-memory storage (in production, use a database)
let reminders: Reminder[] = [
  {
    id: '1',
    userId: 'user1',
    medicineName: 'Vitamin D',
    dosage: '1000 IU',
    frequency: 'Daily',
    time: '09:00',
    startDate: '2024-01-01',
    notes: 'Take with breakfast',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    userId: 'user1',
    medicineName: 'Blood Pressure Medication',
    dosage: '5mg',
    frequency: 'Twice daily',
    time: '08:00,20:00',
    startDate: '2024-01-01',
    notes: 'Take with water',
    isActive: true,
    createdAt: new Date().toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'user1' // Default user for demo

    const userReminders = reminders.filter(r => r.userId === userId && r.isActive)
    
    return NextResponse.json({
      reminders: userReminders,
      count: userReminders.length
    })
  } catch (error) {
    console.error('Get reminders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reminders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      medicineName, 
      dosage, 
      frequency, 
      time, 
      startDate, 
      endDate, 
      notes,
      userId = 'user1' // Default user for demo
    } = body

    if (!medicineName || !dosage || !frequency || !time || !startDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newReminder: Reminder = {
      id: Date.now().toString(),
      userId,
      medicineName,
      dosage,
      frequency,
      time,
      startDate,
      endDate,
      notes,
      isActive: true,
      createdAt: new Date().toISOString()
    }

    reminders.push(newReminder)

    return NextResponse.json({
      message: 'Reminder created successfully',
      reminder: newReminder
    }, { status: 201 })
  } catch (error) {
    console.error('Create reminder error:', error)
    return NextResponse.json(
      { error: 'Failed to create reminder' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId') || 'user1'

    if (!id) {
      return NextResponse.json(
        { error: 'Reminder ID is required' },
        { status: 400 }
      )
    }

    const reminderIndex = reminders.findIndex(r => r.id === id && r.userId === userId)
    
    if (reminderIndex === -1) {
      return NextResponse.json(
        { error: 'Reminder not found' },
        { status: 404 }
      )
    }

    // Soft delete - mark as inactive
    reminders[reminderIndex].isActive = false

    return NextResponse.json({
      message: 'Reminder deleted successfully'
    })
  } catch (error) {
    console.error('Delete reminder error:', error)
    return NextResponse.json(
      { error: 'Failed to delete reminder' },
      { status: 500 }
    )
  }
}
