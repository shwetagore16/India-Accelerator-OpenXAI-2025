import { NextRequest, NextResponse } from 'next/server'

interface ChatRequest {
  message: string
  language: string
}

interface ChatResponse {
  reply: string
  urgency: 'low' | 'medium' | 'high'
  suggestions: string[]
}

// Emergency symptoms that require immediate attention
const emergencySymptoms = [
  'chest pain', 'difficulty breathing', 'severe pain', 'blood vomiting', 'unconscious',
  'heart attack', 'stroke', 'severe headache', 'high fever above 104', 'seizure',
  'severe bleeding', 'choking', 'severe burns', 'poisoning', 'severe allergic reaction'
]

// Medium urgency symptoms
const mediumUrgencySymptoms = [
  'fever', 'persistent cough', 'severe fatigue', 'dizziness', 'nausea',
  'vomiting', 'abdominal pain', 'shortness of breath', 'persistent headache',
  'unusual rash', 'severe diarrhea', 'dehydration'
]

// Language templates
const languageTemplates = {
  english: {
    systemPrompt: `You are a healthcare guidance assistant. The user will describe symptoms. 
Respond with:
- Possible common conditions
- Urgency level (low, medium, high)
- 2-3 actionable next steps
- Short, clear language
Always include a disclaimer: "Consult a licensed doctor for accurate diagnosis."`,
    disclaimer: "Consult a licensed doctor for accurate diagnosis."
  },
  hindi: {
    systemPrompt: `आप एक स्वास्थ्य मार्गदर्शन सहायक हैं। उपयोगकर्ता लक्षणों का वर्णन करेगा।
जवाब दें:
- संभावित सामान्य स्थितियां
- तात्कालिकता स्तर (कम, मध्यम, उच्च)
- 2-3 कार्यात्मक अगले कदम
- छोटी, स्पष्ट भाषा
हमेशा एक अस्वीकरण शामिल करें: "सटीक निदान के लिए लाइसेंस प्राप्त डॉक्टर से सलाह लें।"`,
    disclaimer: "सटीक निदान के लिए लाइसेंस प्राप्त डॉक्टर से सलाह लें।"
  },
  marathi: {
    systemPrompt: `तुम्ही आरोग्य मार्गदर्शन सहाय्यक आहात। वापरकर्ता लक्षणांचे वर्णन करेल।
उत्तर द्या:
- संभाव्य सामान्य परिस्थिती
- तातडीची पातळी (कमी, मध्यम, उच्च)
- 2-3 कार्यक्षम पुढील पावले
- लहान, स्पष्ट भाषा
नेहमी अस्वीकरण समाविष्ट करा: "अचूक निदानासाठी परवानाधारक डॉक्टरांचा सल्ला घ्या।"`,
    disclaimer: "अचूक निदानासाठी परवानाधारक डॉक्टरांचा सल्ला घ्या।"
  }
}

async function callOllama(prompt: string, language: string): Promise<string> {
  try {
    const template = languageTemplates[language as keyof typeof languageTemplates] || languageTemplates.english
    
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.1:latest',
        prompt: `${template.systemPrompt}\n\nSymptoms: ${prompt}`,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`)
    }

    const data = await response.json()
    return data.response || 'I apologize, but I cannot provide a response at this time. Please consult a healthcare professional.'
  } catch (error) {
    console.error('Ollama API error:', error)
    // Fallback response
    return 'I apologize, but I cannot connect to the AI service at this time. Please consult a healthcare professional for your symptoms.'
  }
}

function detectUrgency(message: string): 'low' | 'medium' | 'high' {
  const lowerMessage = message.toLowerCase()
  
  if (emergencySymptoms.some(symptom => lowerMessage.includes(symptom))) {
    return 'high'
  }
  
  if (mediumUrgencySymptoms.some(symptom => lowerMessage.includes(symptom))) {
    return 'medium'
  }
  
  return 'low'
}

function generateSuggestions(urgency: string, language: string): string[] {
  const suggestions = {
    english: {
      high: [
        "Seek immediate medical attention",
        "Call emergency services if symptoms worsen",
        "Do not delay treatment"
      ],
      medium: [
        "Monitor symptoms closely",
        "Stay hydrated and rest",
        "Consult doctor if symptoms persist"
      ],
      low: [
        "Get plenty of rest",
        "Stay hydrated",
        "Monitor your condition"
      ]
    },
    hindi: {
      high: [
        "तुरंत चिकित्सा सहायता लें",
        "लक्षण बिगड़ने पर आपातकालीन सेवा कॉल करें",
        "इलाज में देरी न करें"
      ],
      medium: [
        "लक्षणों पर बारीकी से नज़र रखें",
        "हाइड्रेटेड रहें और आराम करें",
        "लक्षण बने रहने पर डॉक्टर से सलाह लें"
      ],
      low: [
        "भरपूर आराम करें",
        "हाइड्रेटेड रहें",
        "अपनी स्थिति पर नज़र रखें"
      ]
    },
    marathi: {
      high: [
        "तातडीने वैद्यकीय मदत घ्या",
        "लक्षणे वाढल्यास आपत्कालीन सेवा कॉल करा",
        "उपचारात विलंब करू नका"
      ],
      medium: [
        "लक्षणांवर बारकाईने लक्ष ठेवा",
        "हायड्रेटेड राहा आणि विश्रांती घ्या",
        "लक्षणे कायम राहिल्यास डॉक्टरांचा सल्ला घ्या"
      ],
      low: [
        "भरपूर विश्रांती घ्या",
        "हायड्रेटेड राहा",
        "तुमच्या स्थितीवर लक्ष ठेवा"
      ]
    }
  }

  const langSuggestions = suggestions[language as keyof typeof suggestions] || suggestions.english
  return langSuggestions[urgency as keyof typeof langSuggestions] || langSuggestions.low
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, language } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      )
    }

    // Detect urgency level
    const urgency = detectUrgency(message)
    
    // Generate suggestions based on urgency and language
    const suggestions = generateSuggestions(urgency, language)
    
    // Call Ollama for AI response
    const aiReply = await callOllama(message, language)
    
    const response: ChatResponse = {
      reply: aiReply,
      urgency,
      suggestions
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
