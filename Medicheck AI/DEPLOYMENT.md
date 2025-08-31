# HealthMate Deployment Guide

## 🚀 Quick Start

### Prerequisites
1. **Ollama Installation**: Download from [ollama.ai](https://ollama.ai)
2. **Node.js 18+**: Required for Next.js

### Setup Steps

1. **Install Ollama and Model**:
```bash
# Install Ollama first, then:
ollama pull llama3.1:latest
ollama serve
```

2. **Start HealthMate**:
```bash
npm run dev
```

3. **Test Integration**:
   - Open `http://localhost:3000`
   - Navigate to `/chat`
   - Test with: "I have chest pain and difficulty breathing"
   - Should trigger HIGH urgency alert

## 🔧 Production Deployment

### Environment Setup
```bash
# Production build
npm run build
npm start

# Or deploy to Vercel/Netlify
```

### Ollama Production Setup
- Deploy Ollama on a server with GPU support
- Update API endpoint in `/api/chat/route.ts` from `localhost:11434` to your Ollama server URL
- Ensure firewall allows connections to Ollama port (11434)

## 🧪 Testing Checklist

### Core Features
- [ ] Chat interface loads properly
- [ ] Voice input works (microphone button)
- [ ] Language switching (English/Hindi/Marathi)
- [ ] Emergency symptom detection (red alerts)
- [ ] Chat history saves in sidebar
- [ ] PDF export functionality
- [ ] Doctor connect modal opens

### Ollama Integration
- [ ] Ollama service running (`ollama serve`)
- [ ] Model available (`ollama list` shows llama3.1:latest)
- [ ] API responses from `/api/chat` endpoint
- [ ] Multi-language responses working

### Emergency Testing
Test these phrases to verify urgency detection:
- **HIGH**: "chest pain", "difficulty breathing", "severe bleeding"
- **MEDIUM**: "fever", "persistent cough", "severe fatigue"
- **LOW**: "mild headache", "runny nose"

## 🔒 Security Notes

- Ollama runs locally for privacy
- No external API keys required
- Chat data stored in browser localStorage
- Medical disclaimers included in all responses

## 📱 Mobile Testing

- Test responsive design on mobile devices
- Verify voice input works on mobile browsers
- Check touch interactions for all buttons

## 🚨 Troubleshooting

### Common Issues

1. **"Cannot connect to AI service"**:
   - Ensure Ollama is running: `ollama serve`
   - Check if model is available: `ollama list`
   - Verify port 11434 is accessible

2. **Voice input not working**:
   - Check browser permissions for microphone
   - Test in Chrome/Edge (best Web Speech API support)

3. **PDF export fails**:
   - Ensure jsPDF is installed: `npm list jspdf`
   - Check browser popup blockers

4. **Timeline chart not showing**:
   - Ensure Recharts is installed: `npm list recharts`
   - Check for JavaScript errors in console

## 📊 Performance Optimization

- Ollama responses may take 2-10 seconds depending on hardware
- Consider implementing response streaming for better UX
- Add loading states and progress indicators
- Cache frequent responses for common symptoms

Your HealthMate application is production-ready! 🎉
