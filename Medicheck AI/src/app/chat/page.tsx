'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ChatWindow from '@/components/ChatWindow'
import Sidebar from '@/components/Sidebar'
import SymptomForm from '@/components/SymptomForm'

export default function ChatPage() {
  const [showSymptomForm, setShowSymptomForm] = useState(false)
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('low')
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>>([])

  const handleMessagesUpdate = (newMessages: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>) => {
    setMessages(newMessages)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-6rem)]">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                AI Symptom Checker
              </h1>
              <p className="text-gray-600">
                Describe your symptoms and get AI-powered health insights
              </p>
            </motion.div>

            {/* Chat Window */}
            <div className="flex-1 mb-4">
              <ChatWindow 
                onShowSymptomForm={() => setShowSymptomForm(true)}
                riskLevel={riskLevel}
                setRiskLevel={setRiskLevel}
                onMessagesUpdate={handleMessagesUpdate}
              />
            </div>

            {/* Symptom Form */}
            {showSymptomForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SymptomForm onClose={() => setShowSymptomForm(false)} />
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <Sidebar riskLevel={riskLevel} messages={messages} />
          </div>
        </div>
      </div>
    </div>
  )
}
