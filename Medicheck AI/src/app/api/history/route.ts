import { NextRequest, NextResponse } from 'next/server'

interface ChatSession {
  id: string
  userId: string
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: string
  }>
  symptomForm?: any
  riskLevel: 'low' | 'medium' | 'high'
  summary: string
  createdAt: string
  updatedAt: string
}

// In-memory storage (in production, use a database)
let chatHistory: ChatSession[] = [
  {
    id: '1',
    userId: 'user1',
    messages: [
      {
        role: 'user',
        content: 'I have been having headaches for the past 3 days',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        role: 'assistant',
        content: 'I understand you\'ve been experiencing headaches. Can you describe the intensity and any triggers?',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    riskLevel: 'low',
    summary: 'Patient reported mild headaches lasting 3 days',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    userId: 'user1',
    messages: [
      {
        role: 'user',
        content: 'I have a fever and cough',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        role: 'assistant',
        content: 'Fever and cough can indicate various conditions. How high is your fever?',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    riskLevel: 'medium',
    summary: 'Patient reported fever and cough symptoms',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'user1'
    const sessionId = searchParams.get('sessionId')

    if (sessionId) {
      // Get specific session
      const session = chatHistory.find(s => s.id === sessionId && s.userId === userId)
      if (!session) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ session })
    }

    // Get all sessions for user
    const userSessions = chatHistory
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    return NextResponse.json({
      sessions: userSessions,
      count: userSessions.length
    })
  } catch (error) {
    console.error('Get history error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      messages, 
      symptomForm, 
      riskLevel, 
      summary,
      userId = 'user1',
      sessionId
    } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    if (sessionId) {
      // Update existing session
      const sessionIndex = chatHistory.findIndex(s => s.id === sessionId && s.userId === userId)
      if (sessionIndex === -1) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        )
      }

      chatHistory[sessionIndex] = {
        ...chatHistory[sessionIndex],
        messages,
        symptomForm,
        riskLevel: riskLevel || chatHistory[sessionIndex].riskLevel,
        summary: summary || chatHistory[sessionIndex].summary,
        updatedAt: new Date().toISOString()
      }

      return NextResponse.json({
        message: 'Session updated successfully',
        session: chatHistory[sessionIndex]
      })
    } else {
      // Create new session
      const newSession: ChatSession = {
        id: Date.now().toString(),
        userId,
        messages: messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp || new Date().toISOString()
        })),
        symptomForm,
        riskLevel: riskLevel || 'low',
        summary: summary || 'New symptom consultation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      chatHistory.push(newSession)

      return NextResponse.json({
        message: 'Session created successfully',
        session: newSession
      }, { status: 201 })
    }
  } catch (error) {
    console.error('Save history error:', error)
    return NextResponse.json(
      { error: 'Failed to save session' },
      { status: 500 }
    )
  }
}
