'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  MessageCircle, 
  Calendar, 
  MapPin, 
  FileText, 
  Heart, 
  Shield, 
  Stethoscope,
  Brain
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const features = [
    {
      icon: MessageCircle,
      title: 'AI Symptom Checker',
      description: 'Get instant AI-powered analysis of your symptoms with personalized health insights.',
      color: 'text-blue-500'
    },
    {
      icon: Calendar,
      title: 'Medication Reminders',
      description: 'Never miss a dose with smart reminders and medication tracking.',
      color: 'text-green-500'
    },
    {
      icon: MapPin,
      title: 'Doctor Finder',
      description: 'Find nearby healthcare providers and book appointments instantly.',
      color: 'text-purple-500'
    },
    {
      icon: FileText,
      title: 'Health Reports',
      description: 'Generate comprehensive PDF reports of your health journey and symptoms.',
      color: 'text-orange-500'
    },
    {
      icon: Brain,
      title: 'Wellness Check',
      description: 'Monitor your mental health with quick stress and mood assessments.',
      color: 'text-pink-500'
    },
    {
      icon: Shield,
      title: 'Emergency Alerts',
      description: 'Get immediate alerts for critical symptoms that need urgent attention.',
      color: 'text-red-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gray-900">HealthMate</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/chat" className="text-gray-600 hover:text-primary transition-colors">
              Symptom Checker
            </Link>
            <Link href="/reminders" className="text-gray-600 hover:text-primary transition-colors">
              Reminders
            </Link>
            <Link href="/doctors" className="text-gray-600 hover:text-primary transition-colors">
              Find Doctors
            </Link>
            <Button variant="outline">Sign In</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              HealthMate – Your{' '}
              <span className="text-primary">AI Health Companion</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Get instant symptom analysis, medication reminders, and personalized health insights 
              powered by advanced AI. Your health journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat">
                <Button size="lg" className="text-lg px-8 py-3 rounded-2xl">
                  <Stethoscope className="mr-2 h-5 w-5" />
                  Start Symptom Check
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 rounded-2xl">
                Learn More
              </Button>
            </div>
          </div>

          {/* Health Disclaimer */}
          <div className="mt-12 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
            <p className="text-sm text-yellow-800">
              <Shield className="inline h-4 w-4 mr-1" />
              <strong>Medical Disclaimer:</strong> This tool provides health information for educational purposes only. 
              Always consult with healthcare professionals for medical advice.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Health Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to monitor, track, and improve your health in one intelligent platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={feature.title}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-2xl bg-gray-50 w-fit">
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center bg-gradient-to-r from-primary to-teal-400 rounded-3xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Take Control of Your Health?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who trust HealthMate for their health monitoring needs.
          </p>
          <Link href="/chat">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3 rounded-2xl">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">HealthMate</span>
          </div>
          <p>&copy; 2024 HealthMate. All rights reserved.</p>
          <p className="text-sm mt-2">
            Built with ❤️ for better health outcomes
          </p>
        </div>
      </footer>
    </div>
  )
}
