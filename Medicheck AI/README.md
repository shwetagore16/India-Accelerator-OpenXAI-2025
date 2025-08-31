# HealthMate - AI Symptom Checker

A comprehensive HealthTech application with AI-powered symptom analysis using Ollama (llama3.1:latest), built with Next.js, React, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **AI Symptom Checker**: Powered by Ollama llama3.1:latest for intelligent symptom analysis
- **Multi-language Support**: English, Hindi, and Marathi
- **Voice Input**: Web Speech API integration for hands-free interaction
- **Urgency Detection**: Automatic detection of emergency symptoms with visual alerts
- **Chat History**: Stores last 5 conversations with urgency levels
- **Multilingual Support**: English, Hindi, and Marathi language options
- **Medical Disclaimer**: Always shows appropriate medical disclaimers

### Unique Add-On Features
- **🧑‍⚕️ Doctor Finder**: Find nearby healthcare providers with Google Maps integration
- **💊 Medication Reminders**: Set and manage medicine reminders with notifications
- **📊 Symptom History**: Store past conversations and generate reports
- **🥗 Lifestyle Recommendations**: AI-generated health tips and wellness advice
- **🧘 Wellness Check**: Mental health check-ins with mood tracking
- **🔔 Critical Alerts**: Emergency warnings for serious symptoms

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend
- **Next.js API Routes** for serverless functions
- **RESTful APIs** for all functionality
- **In-memory storage** (ready for database integration)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd healthmate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── chat/          # Symptom analysis endpoint
│   │   ├── reminders/     # Medication reminders
│   │   ├── history/       # Chat history management
│   │   └── doctor-finder/ # Healthcare provider search
│   ├── chat/              # Chatbot page
│   ├── doctors/           # Doctor finder page
│   ├── reminders/         # Medication reminders page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── ChatWindow.tsx    # Main chat interface
│   ├── Sidebar.tsx       # Chat sidebar with actions
│   ├── SymptomForm.tsx   # Detailed symptom form
│   └── DoctorFinder.tsx  # Healthcare provider search
└── lib/
    └── utils.ts          # Utility functions
```

## 🎨 Design System

### Color Palette
- **Primary Teal**: `#2DD4BF` - Main brand color
- **Accent Red**: `#EF4444` - Emergency alerts
- **Soft Gray**: `#F3F4F6` - Background and muted elements

### Components
- Rounded corners (`rounded-2xl`) for modern look
- Subtle shadows and backdrop blur effects
- Smooth transitions with Framer Motion
- Mobile-responsive design throughout

## 🔌 API Endpoints

### Chat API
- **POST** `/api/chat` - Analyze symptoms and get AI responses
- Returns risk level, health tips, and follow-up questions

### Reminders API
- **GET** `/api/reminders` - Fetch user reminders
- **POST** `/api/reminders` - Create new reminder
- **DELETE** `/api/reminders` - Remove reminder

### History API
- **GET** `/api/history` - Get chat history
- **POST** `/api/history` - Save chat session

### Doctor Finder API
- **GET** `/api/doctor-finder` - Find nearby healthcare providers
- **POST** `/api/doctor-finder` - Book appointments

## 🚨 Important Medical Disclaimers

This application provides health information for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical concerns.

### Emergency Features
- High-risk symptoms trigger immediate emergency alerts
- Red banner warnings for critical conditions
- Emergency contact information displayed when needed

## 🔮 Future Enhancements

### Production Readiness
- **Database Integration**: MongoDB/PostgreSQL for data persistence
- **Authentication**: JWT-based user authentication
- **OpenAI Integration**: Real AI-powered symptom analysis
- **Google Maps API**: Live healthcare provider data
- **Push Notifications**: Real medication reminders
- **PDF Generation**: Downloadable health reports

### Advanced Features
- **Telemedicine Integration**: Video consultations
- **Wearable Device Sync**: Health data from fitness trackers
- **Insurance Integration**: Coverage verification
- **Prescription Management**: Digital prescriptions

## 🧪 Testing

The application includes:
- Responsive design testing across devices
- Accessibility features (ARIA labels, keyboard navigation)
- Error handling for API failures
- Loading states and user feedback

## 📱 Mobile Experience

- Fully responsive design
- Touch-friendly interface
- Optimized chat bubbles for mobile
- Swipe gestures for navigation

## 🌐 Deployment

Ready for deployment on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker containers**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by healthcare accessibility needs
- Designed for user safety and medical compliance

---

**⚠️ Medical Disclaimer**: This tool is for informational purposes only. Always consult healthcare professionals for medical advice, diagnosis, or treatment.
