'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { 
  Send, 
  Mic, 
  MicOff,
  Bot, 
  User, 
  AlertTriangle,
  Heart,
  Languages
} from 'lucide-react'

// Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
  onend: () => void
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent {
  error: string
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition
  new(): SpeechRecognition
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  riskLevel?: 'low' | 'medium' | 'high'
}

interface ChatWindowProps {
  onShowSymptomForm: () => void
  riskLevel: 'low' | 'medium' | 'high'
  setRiskLevel: (level: 'low' | 'medium' | 'high') => void
  onMessagesUpdate?: (messages: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>) => void
}

export default function ChatWindow({ onShowSymptomForm, riskLevel, setRiskLevel, onMessagesUpdate }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI health assistant. I can help you understand your symptoms and provide health guidance. Please describe what you\'re experiencing, and I\'ll ask follow-up questions to better understand your condition.',
      timestamp: new Date(),
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [language, setLanguage] = useState('English')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const quickReplies = [
    'Fever', 'Headache', 'Cough', 'Sore throat', 'Nausea', 'Fatigue'
  ]

  const languages = ['English', 'Hindi', 'Marathi']

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = language === 'Hindi' ? 'hi-IN' : language === 'Marathi' ? 'mr-IN' : 'en-US'
        
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          setInputValue(transcript)
          setIsListening(false)
        }
        
        recognitionRef.current.onerror = () => {
          setIsListening(false)
        }
        
        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }
  }, [language])

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return
    
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      // Call Ollama API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          language: language.toLowerCase()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      
      // Update risk level based on API response
      setRiskLevel(data.urgency)

      // Save chat to history
      const chatHistory = {
        id: Date.now().toString(),
        timestamp: new Date(),
        userMessage: content.trim(),
        aiResponse: data.reply,
        urgency: data.urgency,
        suggestions: data.suggestions
      }
      
      // Store in localStorage for history sidebar
      const existingHistory = JSON.parse(localStorage.getItem('symptomHistory') || '[]')
      const updatedHistory = [chatHistory, ...existingHistory].slice(0, 5) // Keep last 5
      localStorage.setItem('symptomHistory', JSON.stringify(updatedHistory))

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `${data.reply}\n\n**Suggestions:**\n${data.suggestions.map((s: string) => `• ${s}`).join('\n')}\n\n*This is not medical advice. Always consult a doctor.*`,
        timestamp: new Date(),
        riskLevel: data.urgency
      }

      setMessages(prev => {
        const newMessages = [...prev, assistantMessage]
        // Update parent component with messages for PDF export
        onMessagesUpdate?.(newMessages.map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp
        })))
        return newMessages
      })
    } catch (error) {
      console.error('Error calling AI:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or consult a healthcare professional.',
        timestamp: new Date(),
        riskLevel: 'low'
      }
      setMessages(prev => {
        const newMessages = [...prev, errorMessage]
        onMessagesUpdate?.(newMessages.map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp
        })))
        return newMessages
      })
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply)
  }

  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center space-x-2 p-4"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
        <Bot className="w-4 h-4 text-primary" />
      </div>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </motion.div>
  )

  return (
    <Card className="flex flex-col h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/5 to-teal-50 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <Heart className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">HealthMate AI</h3>
            <p className="text-sm text-gray-600">Your AI Health Assistant</p>
          </div>
        </div>
        
        {/* Language Selector */}
        <div className="flex items-center space-x-2">
          <Languages className="w-4 h-4 text-gray-500" />
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm border rounded-md px-2 py-1 bg-white"
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Emergency Alert */}
      {riskLevel === 'high' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-red-50 border-l-4 border-red-500 p-4 m-4 rounded-lg"
        >
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <div>
              <p className="text-red-800 font-semibold">⚠️ Urgent: Seek Immediate Medical Attention</p>
              <p className="text-red-700 text-sm">Your symptoms may require emergency care. Call emergency services or visit the nearest hospital.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  message.role === 'user' 
                    ? 'bg-blue-500' 
                    : 'bg-primary/10'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 pb-2">
        <div className="flex flex-wrap gap-2">
          {quickReplies.map((reply) => (
            <Button
              key={reply}
              variant="outline"
              size="sm"
              onClick={() => handleQuickReply(reply)}
              className="text-xs rounded-full"
            >
              {reply}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-gray-50/50 rounded-b-2xl">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
              placeholder="Describe your symptoms..."
              className="pr-12 rounded-2xl border-gray-200 focus:border-primary"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleVoiceInput}
              className={`absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 ${
                isListening ? 'bg-red-100 text-red-500' : 'text-gray-400'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>
          <Button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim()}
            className="rounded-2xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <Button
            variant="link"
            size="sm"
            onClick={onShowSymptomForm}
            className="text-xs text-primary"
          >
            Fill detailed symptom form
          </Button>
          <p className="text-xs text-gray-500">
            Press Enter to send
          </p>
        </div>
      </div>
    </Card>
  )
}
