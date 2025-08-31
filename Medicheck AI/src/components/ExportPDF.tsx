'use client'

import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
import jsPDF from 'jspdf'

interface ExportPDFProps {
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>
  className?: string
}

export default function ExportPDF({ messages, className }: ExportPDFProps) {
  const exportToPDF = () => {
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(20)
    doc.text('HealthMate - Symptom Chat Report', 20, 30)
    
    doc.setFontSize(12)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45)
    
    // Disclaimer
    doc.setFontSize(10)
    doc.setTextColor(255, 0, 0)
    doc.text('DISCLAIMER: This is not medical advice. Always consult a healthcare professional.', 20, 60)
    
    doc.setTextColor(0, 0, 0)
    
    let yPosition = 80
    
    messages.forEach((message, index) => {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 30
      }
      
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text(message.role === 'user' ? 'You:' : 'HealthMate AI:', 20, yPosition)
      
      doc.setFont(undefined, 'normal')
      doc.setFontSize(10)
      
      // Split long text into multiple lines
      const splitText = doc.splitTextToSize(message.content, 170)
      doc.text(splitText, 20, yPosition + 10)
      
      yPosition += splitText.length * 5 + 15
      
      // Add timestamp
      doc.setFontSize(8)
      doc.setTextColor(128, 128, 128)
      doc.text(message.timestamp.toLocaleString(), 20, yPosition)
      doc.setTextColor(0, 0, 0)
      
      yPosition += 15
    })
    
    doc.save(`healthmate-chat-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  return (
    <Button 
      onClick={exportToPDF}
      variant="outline" 
      className={`w-full justify-start rounded-xl ${className}`}
    >
      <FileText className="w-4 h-4 mr-2" />
      Export Chat PDF
    </Button>
  )
}
