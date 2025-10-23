# Wikipedia Chat Assistant with AI

> An intelligent chat interface that combines Wikipedia's knowledge with Claude AI to answer questions in natural language.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://wiki-cms-chat-production.up.railway.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🤖 **AI-Powered Responses** - Claude AI processes questions and generates natural, conversational answers
- 🔍 **Smart Keyword Extraction** - AI extracts optimal search terms from natural language queries
- 📚 **Wikipedia Integration** - Searches and retrieves up to 3 relevant Wikipedia articles
- 💬 **Streaming Responses** - Real-time text streaming for faster, more engaging interactions
- 📱 **Responsive Design** - Beautiful chat interface that works on all devices
- 🔗 **Source Citations** - Direct links to Wikipedia articles for fact-checking
- 🎯 **Auto-scroll** - Automatically scrolls to keep latest messages visible

## 🎥 Demo

Try it live: **[https://wiki-cms-chat-production.up.railway.app](https://wiki-cms-chat-production.up.railway.app)**

**Example Queries:**
- "Tell me about the Apollo 11 moon landing"
- "What is quantum computing?"
- "Who was Marie Curie and what did she discover?"

## 🏗️ Architecture

```
User Query
    ↓
Claude AI (Extract Keywords)
    ↓
Wikipedia API (Search Articles)
    ↓
Claude AI (Generate Response)
    ↓
Streaming Response to User
```

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **Vite 5.4.11** - Build tool & dev server
- **Tailwind CSS 3.4.1** - Styling
- **Lucide React** - Icons

### Backend
- **Node.js + Express 4.18.2** - Server
- **Anthropic Claude API** - AI processing
- **Wikipedia APIs** - Knowledge source

### Infrastructure
- **Railway** - Hosting & deployment
- **GitHub** - Version control

## 🚀 Quick Start

### Prerequisites
- Node.js 20.19.0+
- npm 10.1.0+
- Anthropic API key ([Get one here](https://console.anthropic.com/settings/keys))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/HumanFirstAi/wiki-cms-chat.git
cd wiki-cms-chat
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..
```

3. **Set up environment variables**
```bash
# Create .env file in server directory
echo "ANTHROPIC_API_KEY=your_api_key_here" > server/.env
```

4. **Run the application**

**Development Mode (Recommended):**
```bash
# Terminal 1 - Start backend
npm start

# Terminal 2 - Start frontend dev server
npm run dev

# Open http://localhost:5173
```

**Production Mode:**
```bash
# Build and run
npm run build
npm start

# Open http://localhost:3001
```

## 📁 Project Structure

```
wiki-cms-chat/
├── src/
│   ├── components/
│   │   └── WikiCMS.jsx          # Main chat component
│   ├── styles/
│   │   └── index.css            # Tailwind imports
│   ├── App.jsx                  # Root component
│   └── main.jsx                 # Entry point
├── server/
│   ├── index.js                 # Express server
│   ├── .env                     # API keys (gitignored)
│   └── package.json             # Server dependencies
├── dist/                        # Production build (generated)
├── index.html                   # HTML template
├── package.json                 # Root dependencies
├── vite.config.js               # Vite configuration
└── tailwind.config.js           # Tailwind configuration
```

## 🔧 Configuration

### Environment Variables

Create `server/.env`:
```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx...
PORT=3001  # Optional, defaults to 3001
```

### API Endpoints

- **POST** `/api/extract-keywords` - Extract search keywords using Claude
- **POST** `/api/chat/stream` - Stream AI responses (Server-Sent Events)
- **GET** `/health` - Health check endpoint

## 🌐 Deployment

### Deploy to Railway

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy on Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Add environment variable: `ANTHROPIC_API_KEY`
   - Railway auto-deploys!

3. **Access your app**
   - Railway provides a URL: `https://your-app.up.railway.app`

### Deploy to Other Platforms

The app works on any platform that supports Node.js:
- Vercel
- Heroku
- AWS
- Google Cloud
- DigitalOcean

## 💡 Usage Tips

### Search Best Practices

✅ **Good Queries:**
- Natural language: "Tell me about the Apollo 11 moon landing"
- Questions: "What is quantum computing?"
- Concepts: "Explain photosynthesis"

❌ **Less Effective:**
- Very generic: "science", "history"
- Multiple unrelated topics in one query

### Understanding Responses

1. **AI processes your question** to extract optimal search keywords
2. **Wikipedia is searched** for relevant articles
3. **Claude AI reads the articles** and generates a conversational response
4. **Sources are cited** so you can verify information

## 🎨 Customization

### Changing the Theme

Edit `src/components/WikiCMS.jsx`:

```javascript
// Change primary color from indigo to your choice
className="bg-indigo-600"  // Header
className="bg-indigo-600 text-white"  // User messages
```

### Adjusting AI Behavior

Edit `server/index.js`:

```javascript
// Change response style
content: `Your custom prompt here...`

// Adjust response length
max_tokens: 1500  // Increase for longer responses
```

## 🐛 Troubleshooting

### Common Issues

**Issue:** "Failed to fetch" or API errors  
**Solution:** Check that your `ANTHROPIC_API_KEY` is set correctly in `server/.env`

**Issue:** Port already in use  
**Solution:** 
```bash
lsof -ti:3001 | xargs kill -9
```

**Issue:** Build fails  
**Solution:**
```bash
rm -rf node_modules package-lock.json
rm -rf server/node_modules server/package-lock.json
npm install && cd server && npm install && cd ..
```

### Debug Mode

Enable detailed logging in `server/index.js`:
```javascript
console.log('Request:', req.body);
console.log('API Key loaded:', !!process.env.ANTHROPIC_API_KEY);
```

## 📊 Performance

- **Build size:** ~150KB (gzipped)
- **Response time:** 1-3 seconds average
- **API calls:** 2 per query (keyword extraction + chat response)
- **Cost:** ~$0.01 per query (Claude Sonnet 4.5)

## 🔒 Security

- ✅ API keys stored in environment variables
- ✅ No sensitive data in git history
- ✅ CORS properly configured
- ✅ HTTPS enforced (in production)
- ✅ Server-side API calls only

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Anthropic](https://www.anthropic.com/) for Claude AI
- [Wikipedia](https://www.wikipedia.org/) for the knowledge base
- [Railway](https://railway.app/) for hosting

## 📬 Contact

**Project Repository:** [https://github.com/HumanFirstAi/wiki-cms-chat](https://github.com/HumanFirstAi/wiki-cms-chat)

---

Made with ❤️ using Claude AI and Wikipedia

