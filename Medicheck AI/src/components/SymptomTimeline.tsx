'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Calendar } from 'lucide-react'

interface SymptomData {
  date: string
  urgency: number
  symptoms: string
}

export default function SymptomTimeline() {
  const [timelineData, setTimelineData] = useState<SymptomData[]>([])

  useEffect(() => {
    // Load symptom history and convert to timeline data
    const history = JSON.parse(localStorage.getItem('symptomHistory') || '[]')
    
    const chartData = history.map((chat: any) => ({
      date: new Date(chat.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      urgency: chat.urgency === 'high' ? 3 : chat.urgency === 'medium' ? 2 : 1,
      symptoms: chat.userMessage.slice(0, 30) + '...'
    })).reverse() // Show chronological order

    setTimelineData(chartData)
  }, [])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-gray-600">{data.symptoms}</p>
          <p className={`text-sm font-medium ${
            data.urgency === 3 ? 'text-red-600' :
            data.urgency === 2 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            Urgency: {data.urgency === 3 ? 'High' : data.urgency === 2 ? 'Medium' : 'Low'}
          </p>
        </div>
      )
    }
    return null
  }

  if (timelineData.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            Symptom Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No symptom data yet</p>
            <p className="text-sm">Start a chat to see your timeline</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-primary" />
          Symptom Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                domain={[0, 3]}
                ticks={[1, 2, 3]}
                tickFormatter={(value: number) => 
                  value === 3 ? 'High' : value === 2 ? 'Medium' : 'Low'
                }
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="urgency" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-xs text-gray-500 text-center">
          Track your symptom patterns over time
        </div>
      </CardContent>
    </Card>
  )
}
