'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ExportPDF from './ExportPDF'
import DoctorConnectModal from './DoctorConnectModal'
import SymptomTimeline from './SymptomTimeline'
import { 
  History, 
  Calendar, 
  FileText, 
  Languages, 
  Shield, 
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface SidebarProps {
  riskLevel: 'low' | 'medium' | 'high'
  messages?: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>
}

export default function Sidebar({ riskLevel, messages = [] }: SidebarProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [symptomHistory, setSymptomHistory] = useState<any[]>([])
  const [showDoctorModal, setShowDoctorModal] = useState(false)

  useEffect(() => {
    // Load symptom history from localStorage
    const history = JSON.parse(localStorage.getItem('symptomHistory') || '[]')
    setSymptomHistory(history)
  }, [])

  const healthTips = [
    {
      title: "Stay Hydrated",
      content: "Drink at least 8 glasses of water daily to maintain optimal health and help your body function properly.",
      icon: "💧"
    },
    {
      title: "Regular Exercise",
      content: "Aim for 30 minutes of moderate exercise daily to boost immunity and improve overall well-being.",
      icon: "🏃‍♂️"
    },
    {
      title: "Quality Sleep",
      content: "Get 7-9 hours of quality sleep each night to support your immune system and mental health.",
      icon: "😴"
    },
    {
      title: "Balanced Diet",
      content: "Include fruits, vegetables, and whole grains in your diet for essential nutrients and vitamins.",
      icon: "🥗"
    },
    {
      title: "Stress Management",
      content: "Practice meditation, deep breathing, or yoga to manage stress and improve mental well-being.",
      icon: "🧘‍♀️"
    }
  ]

  const getRiskConfig = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: CheckCircle,
          title: 'Low Risk',
          message: 'Your symptoms appear to be mild. Monitor your condition and rest well.'
        }
      case 'medium':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: AlertCircle,
          title: 'Medium Risk',
          message: 'Consider consulting a healthcare provider if symptoms persist or worsen.'
        }
      case 'high':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: AlertTriangle,
          title: 'High Risk',
          message: 'Seek immediate medical attention. Your symptoms may require urgent care.'
        }
    }
  }

  const riskConfig = getRiskConfig(riskLevel)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % healthTips.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [healthTips.length])

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % healthTips.length)
  }

  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + healthTips.length) % healthTips.length)
  }

  return (
    <div className="space-y-6">
      {/* Symptom History */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <History className="w-5 h-5 mr-2 text-primary" />
              Recent Chats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {symptomHistory.length > 0 ? (
              symptomHistory.map((chat, index) => (
                <div key={chat.id} className="p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">
                      {new Date(chat.timestamp).toLocaleDateString()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      chat.urgency === 'high' ? 'bg-red-100 text-red-600' :
                      chat.urgency === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {chat.urgency}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 truncate">
                    {chat.userMessage}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No chat history yet
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ExportPDF messages={messages} />
            <Button 
              variant="outline" 
              className="w-full justify-start rounded-xl"
              onClick={() => setShowDoctorModal(true)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Connect Doctor
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Risk Indicator */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className={`${riskConfig.bgColor} ${riskConfig.borderColor} border-2 shadow-lg`}>
          <CardHeader>
            <CardTitle className={`text-lg flex items-center ${riskConfig.color}`}>
              <riskConfig.icon className="w-5 h-5 mr-2" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className={`text-xl font-semibold ${riskConfig.color}`}>
                {riskConfig.title}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {riskConfig.message}
              </p>
              
              {/* Risk Level Indicator */}
              <div className="flex space-x-1">
                {['low', 'medium', 'high'].map((level, index) => (
                  <div
                    key={level}
                    className={`h-2 flex-1 rounded-full ${
                      index === 0 ? 'bg-green-300' :
                      index === 1 ? 'bg-yellow-300' : 'bg-red-300'
                    } ${
                      (level === 'low' && riskLevel === 'low') ||
                      (level === 'medium' && (riskLevel === 'medium' || riskLevel === 'high')) ||
                      (level === 'high' && riskLevel === 'high')
                        ? 'opacity-100' : 'opacity-30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Health Tips Carousel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-blue-50 to-teal-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-primary">
              <Lightbulb className="w-5 h-5 mr-2" />
              Health Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <motion.div
                key={currentTipIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-3"
              >
                <div className="text-3xl">{healthTips[currentTipIndex].icon}</div>
                <h3 className="font-semibold text-gray-900">
                  {healthTips[currentTipIndex].title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {healthTips[currentTipIndex].content}
                </p>
              </motion.div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevTip}
                  className="h-8 w-8 rounded-full"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex space-x-1">
                  {healthTips.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentTipIndex ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextTip}
                  className="h-8 w-8 rounded-full"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Emergency Contact */}
      {riskLevel === 'high' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-red-500 text-white border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <AlertTriangle className="w-8 h-8 mx-auto" />
                <h3 className="font-bold">Emergency Contact</h3>
                <p className="text-sm opacity-90">
                  If this is a medical emergency, call your local emergency number immediately.
                </p>
                <Button variant="secondary" className="w-full">
                  Call Emergency Services
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Symptom Timeline */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <SymptomTimeline />
      </motion.div>

      {/* Doctor Connect Modal */}
      <DoctorConnectModal 
        isOpen={showDoctorModal} 
        onClose={() => setShowDoctorModal(false)} 
      />
    </div>
  )
}
