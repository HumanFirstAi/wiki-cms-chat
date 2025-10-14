# Wikipedia Chat Assistant

A real-time chat interface that searches Wikipedia and displays article summaries with source citations.

## Features

- 🔍 Real-time Wikipedia search
- 💬 Chat-style interface
- 📚 Multiple article results
- 🔗 Direct source citations
- 📱 Responsive design

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 3
- Wikipedia API

## Setup

Install dependencies and run:

    npm install
    npm run dev

Build for production:

    npm run build

## Usage

1. Open http://localhost:5173
2. Type a topic or question (e.g., "Apollo 11")
3. Press Enter or click Send
4. View Wikipedia article summaries with source links

## Search Tips

Use topic names or keywords rather than full questions:
- ✅ Good: "Apollo 11", "Marie Curie", "Quantum computing"
- ❌ Avoid: "When was Apollo 11 launched?"

## License

MIT

=================

# Wikipedia Chat Assistant - Product Documentation

## Executive Summary

**Project Name:** Wikipedia Chat Assistant  
**Version:** 1.0  
**Date:** October 14, 2025  
**Status:** Production Ready  
**Purpose:** A real-time chat interface that searches Wikipedia and displays article summaries with source citations.

---

## Table of Contents

1. [Product Overview](#product-overview)
2. [Technical Architecture](#technical-architecture)
3. [Setup Guide](#setup-guide)
4. [Code Walkthrough](#code-walkthrough)
5. [API Integration](#api-integration)
6. [User Guide](#user-guide)
7. [Troubleshooting](#troubleshooting)
8. [Future Enhancements](#future-enhancements)

---

## 1. Product Overview

### 1.1 What It Does

Wikipedia Chat Assistant is a conversational interface that allows users to search Wikipedia using natural language queries. Instead of navigating Wikipedia's website, users simply type questions or topics into a chat interface and receive formatted article summaries with direct links to sources.

### 1.2 Key Features

- **Real-time Wikipedia Search**: Searches Wikipedia API based on user queries
- **Multiple Article Results**: Fetches up to 3 relevant articles per search
- **Article Summaries**: Displays concise extracts from Wikipedia articles
- **Source Citations**: Provides clickable links to full Wikipedia articles
- **Chat Interface**: Familiar messaging UI with user/assistant message bubbles
- **Loading States**: Visual feedback during searches
- **Error Handling**: Graceful error messages when searches fail
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### 1.3 Use Cases

- **Quick Research**: Get fast answers without leaving a single interface
- **Educational Tool**: Learn about topics with cited sources
- **Content Discovery**: Explore related topics through Wikipedia's network
- **Research Assistant**: Gather information for papers or projects

---

## 2. Technical Architecture

### 2.1 Technology Stack

**Frontend Framework:**
- React 18.3.1 - Component-based UI library
- React Hooks (useState) - State management

**Build Tools:**
- Vite 5.4.11 - Fast development server and build tool
- @vitejs/plugin-react 4.3.4 - React support for Vite

**Styling:**
- Tailwind CSS 3.4.1 - Utility-first CSS framework
- PostCSS 8.4.35 - CSS processing
- Autoprefixer 10.4.18 - Cross-browser CSS compatibility

**Icons:**
- Lucide React 0.344.0 - Icon library

**External APIs:**
- Wikipedia OpenSearch API - Search functionality
- Wikipedia REST API v1 - Article summaries

### 2.2 System Architecture

```
┌─────────────────────────────────────────┐
│           Browser (Client)              │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   React Application (Vite)        │ │
│  │                                   │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │   WikiCMS Component         │ │ │
│  │  │   - Search State            │ │ │
│  │  │   - Message History         │ │ │
│  │  │   - Wikipedia API Calls     │ │ │
│  │  └─────────────────────────────┘ │ │
│  │                                   │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │   Tailwind CSS Styling      │ │ │
│  │  └─────────────────────────────┘ │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
              │
              │ HTTPS Requests
              ▼
┌─────────────────────────────────────────┐
│       Wikipedia APIs (External)         │
│                                         │
│  1. OpenSearch API                      │
│     - Returns matching article titles   │
│                                         │
│  2. REST API v1                         │
│     - Returns article summaries         │
└─────────────────────────────────────────┘
```

### 2.3 Data Flow

1. **User Input** → User types query in text input
2. **Submit Handler** → React captures input and calls searchWikipedia()
3. **OpenSearch API Call** → Fetches matching article titles
4. **Loop Through Results** → For each title (max 3):
   - Call REST API to get article summary
   - Store article data (title, extract, URL)
5. **State Update** → Add formatted response to messages array
6. **UI Render** → React displays new message with sources

---

## 3. Setup Guide

### 3.1 Prerequisites

Before starting, ensure you have:
- **Node.js**: Version 20.19.0 or higher
- **npm**: Version 10.1.0 or higher (comes with Node.js)
- **Terminal/Command Line**: Basic command line knowledge
- **Text Editor**: VS Code, Sublime, or any code editor

Optional:
- **nvm** (Node Version Manager) for managing Node versions

### 3.2 Step-by-Step Installation

#### Step 1: Create Project Directory

```bash
# Create and enter project directory
mkdir wiki-cms-chat
cd wiki-cms-chat
```

#### Step 2: Initialize Node Project

```bash
# Initialize npm
npm init -y
```

This creates a `package.json` file.

#### Step 3: Install Dependencies

```bash
# Install React and React DOM
npm install react@^18.3.1 react-dom@^18.3.1 lucide-react@^0.344.0

# Install development dependencies
npm install -D vite@^5.4.11 @vitejs/plugin-react@^4.3.4 tailwindcss@^3.4.1 postcss@^8.4.35 autoprefixer@^10.4.18
```

#### Step 4: Update package.json

Add `"type": "module"` and scripts:

```json
{
  "name": "wiki-cms-chat",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.344.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^5.4.11",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.35",
    "autoprefixer": "^10.4.18"
  }
}
```

#### Step 5: Create Configuration Files

**vite.config.js:**
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

**tailwind.config.js:**
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**postcss.config.js:**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

#### Step 6: Create Project Structure

```bash
# Create directories
mkdir -p src/components src/styles

# Create files
touch index.html
touch src/main.jsx
touch src/App.jsx
touch src/components/WikiCMS.jsx
touch src/styles/index.css
```

#### Step 7: Create index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Wikipedia Chat Assistant</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

#### Step 8: Create src/styles/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Step 9: Create src/main.jsx

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### Step 10: Create src/App.jsx

```javascript
import React from 'react';
import WikiCMS from './components/WikiCMS';

function App() {
  return <WikiCMS />;
}

export default App;
```

#### Step 11: Create src/components/WikiCMS.jsx

See Section 4 for the complete component code.

#### Step 12: Run the Application

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

### 3.3 Project Structure

```
wiki-cms-chat/
├── node_modules/          # Dependencies (auto-generated)
├── src/
│   ├── components/
│   │   └── WikiCMS.jsx    # Main chat component
│   ├── styles/
│   │   └── index.css      # Tailwind imports
│   ├── App.jsx            # Root component
│   └── main.jsx           # Entry point
├── index.html             # HTML template
├── package.json           # Project metadata & dependencies
├── package-lock.json      # Locked dependency versions
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── postcss.config.js      # PostCSS configuration
```

---

## 4. Code Walkthrough

### 4.1 Component Overview

The entire application is built around a single React component: `WikiCMS`. This component manages:
- User input state
- Message history
- Loading states
- Wikipedia API interactions

### 4.2 Complete WikiCMS.jsx Code

```javascript
import React, { useState } from 'react';
import { Send, Loader2, MessageSquare, Book } from 'lucide-react';

export default function WikiCMS() {
  // State management
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Wikipedia search function
  const searchWikipedia = async (query) => {
    try {
      // Step 1: Search for matching articles
      const searchResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=3&format=json&origin=*`
      );
      const searchData = await searchResponse.json();
      
      // Check if results exist
      if (!searchData[1] || searchData[1].length === 0) {
        return null;
      }

      // Step 2: Fetch summaries for each article
      const articles = [];
      for (let i = 0; i < Math.min(3, searchData[1].length); i++) {
        const title = searchData[1][i];
        const summaryResponse = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
        );
        const summaryData = await summaryResponse.json();
        
        articles.push({
          title: summaryData.title,
          extract: summaryData.extract,
          url: summaryData.content_urls?.desktop?.page
        });
      }
      
      return articles;
    } catch (error) {
      console.error('Wikipedia search error:', error);
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const articles = await searchWikipedia(userMessage);
      
      // Handle no results
      if (!articles || articles.length === 0) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `I couldn't find Wikipedia articles about "${userMessage}".`
        }]);
        setLoading(false);
        return;
      }

      // Format response
      let response = 'Here is what I found on Wikipedia:\n\n';
      articles.forEach((article) => {
        response += `${article.title}\n${article.extract}\n\n`;
      });

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response,
        sources: articles
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'error', 
        content: 'Error: ' + error.message
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Render UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ height: '90vh' }}>
        
        {/* Header */}
        <div className="bg-indigo-600 text-white p-6">
          <div className="flex items-center gap-3">
            <Book className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Wikipedia Chat</h1>
              <p className="text-sm text-indigo-200">Search Wikipedia</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Welcome State */}
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold mb-2">Welcome!</h2>
              <p className="text-sm">Ask me anything</p>
            </div>
          )}
          
          {/* Message List */}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-4/5 rounded-lg p-4 ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : msg.role === 'error'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                {/* Source Links */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <p className="text-xs font-bold mb-2">Sources:</p>
                    {msg.sources.map((source, i) => (
                      <a
                        key={i}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs text-blue-600 hover:underline mb-1"
                      >
                        {source.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Loading State */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4 flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                <span className="text-sm text-gray-600">Searching...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-gray-50 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask a question"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
```

### 4.3 Code Breakdown by Section

#### State Management
```javascript
const [messages, setMessages] = useState([]);  // Chat history
const [input, setInput] = useState('');        // Current user input
const [loading, setLoading] = useState(false); // Loading state
```

**Purpose:** React hooks manage component state. When state changes, React re-renders the component.

#### searchWikipedia Function
```javascript
const searchWikipedia = async (query) => {
  // 1. Call OpenSearch API
  // 2. Loop through results
  // 3. Call REST API for each result
  // 4. Return array of articles
}
```

**Purpose:** Handles all Wikipedia API interactions. Returns null if no results found.

#### handleSubmit Function
```javascript
const handleSubmit = async () => {
  // 1. Validate input
  // 2. Add user message to chat
  // 3. Call searchWikipedia
  // 4. Format and display results
  // 5. Handle errors
}
```

**Purpose:** Orchestrates the search flow from user input to displaying results.

#### UI Rendering
- **Header:** Branding and title
- **Messages Area:** Scrollable chat history
- **Input Area:** Text input and send button

---

## 5. API Integration

### 5.1 Wikipedia OpenSearch API

**Purpose:** Search for article titles matching a query

**Endpoint:**
```
https://en.wikipedia.org/w/api.php
```

**Parameters:**
- `action=opensearch` - API action type
- `search={query}` - Search term
- `limit=3` - Max results
- `format=json` - Response format
- `origin=*` - CORS support

**Example Request:**
```javascript
fetch('https://en.wikipedia.org/w/api.php?action=opensearch&search=Apollo%2011&limit=3&format=json&origin=*')
```

**Response Structure:**
```json
[
  "Apollo 11",                        // Original query
  ["Apollo 11", "Apollo 11 in..."],  // Article titles
  ["", ""],                           // Descriptions (unused)
  ["https://...", "https://..."]     // URLs (unused)
]
```

### 5.2 Wikipedia REST API v1

**Purpose:** Get article summary/extract

**Endpoint:**
```
https://en.wikipedia.org/api/rest_v1/page/summary/{title}
```

**Example Request:**
```javascript
fetch('https://en.wikipedia.org/api/rest_v1/page/summary/Apollo_11')
```

**Response Structure:**
```json
{
  "title": "Apollo 11",
  "extract": "Apollo 11 was the first spaceflight...",
  "content_urls": {
    "desktop": {
      "page": "https://en.wikipedia.org/wiki/Apollo_11"
    }
  },
  "thumbnail": {
    "source": "https://..."
  }
}
```

### 5.3 API Flow Diagram

```
User Query: "Apollo 11"
     │
     ▼
┌─────────────────────┐
│  OpenSearch API     │
│  Returns: Titles    │
└─────────────────────┘
     │
     ▼
["Apollo 11", "Apollo 11 in popular culture", ...]
     │
     ▼
For each title (max 3):
  ┌─────────────────────┐
  │   REST API v1       │
  │   Returns: Summary  │
  └─────────────────────┘
     │
     ▼
[
  {title, extract, url},
  {title, extract, url},
  {title, extract, url}
]
     │
     ▼
Display in chat
```

---

## 6. User Guide

### 6.1 How to Use

1. **Open the Application**
   - Navigate to `http://localhost:5173` in your browser

2. **Enter a Query**
   - Type a topic or question in the input field
   - Examples: "Apollo 11", "Quantum Physics", "Marie Curie"

3. **Submit**
   - Press Enter or click the Send button
   - Wait for results (1-3 seconds)

4. **View Results**
   - Read article summaries in the chat
   - Click source links to read full articles

5. **Continue Searching**
   - Ask follow-up questions
   - Explore related topics

### 6.2 Search Tips

**✅ Good Queries:**
- Topic names: "Apollo 11"
- Proper nouns: "Marie Curie"
- Concepts: "Quantum computing"
- Events: "Moon landing"
- Single or few keywords

**❌ Avoid:**
- Full questions: "When was the Apollo 11 moon landing?"
- Use instead: "Apollo 11"
- Very generic terms: "science", "history"
- Misspellings (Wikipedia search is exact)

### 6.3 Understanding Results

Each response includes:
- **Article Title**: Name of the Wikipedia article
- **Extract**: First few paragraphs of the article
- **Source Link**: Direct link to full Wikipedia article

Multiple articles may be returned for broader topics.

---

## 7. Troubleshooting

### 7.1 Common Issues

#### Issue: "npm: command not found"
**Solution:** Install Node.js from nodejs.org

#### Issue: Port 5173 already in use
**Solution:**
```bash
# Kill the process using the port
lsof -ti:5173 | xargs kill -9

# Or change the port in vite.config.js
export default defineConfig({
  plugins: [react()],
  server: { port: 3000 }
});
```

#### Issue: "Cannot find module 'react'"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Issue: No search results
**Cause:** Query too specific or misspelled
**Solution:** Try simpler, more general terms

#### Issue: CORS errors
**Cause:** Wikipedia API requires origin parameter
**Solution:** Ensure `origin=*` is in API URLs

### 7.2 Debug Mode

Add console logging to track issues:

```javascript
const searchWikipedia = async (query) => {
  console.log('Searching for:', query);
  try {
    const searchResponse = await fetch(/*...*/);
    const searchData = await searchResponse.json();
    console.log('Search results:', searchData);
    // ... rest of code
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### 7.3 Browser Console

Open Developer Tools (F12) to:
- View console logs
- Inspect network requests
- Debug React components

---

## 8. Future Enhancements

### 8.1 Planned Features

**Phase 2:**
- ✨ Claude AI integration for natural language responses
- 💾 Local storage for message history
- 🎨 Dark mode toggle
- 📱 Mobile app (React Native)
- 🔍 Advanced search filters

**Phase 3:**
- 👤 User accounts
- 💬 Conversation threads
- 📊 Usage analytics
- 🌍 Multi-language support
- 🔖 Bookmarking articles

### 8.2 Technical Improvements

- TypeScript migration
- Unit tests (Jest)
- E2E tests (Playwright)
- Performance optimization
- Accessibility (WCAG compliance)
- SEO optimization

### 8.3 Claude AI Integration (Backend Required)

To add AI-powered responses, you need:

1. **Backend Server**
   - Node.js + Express
   - Handles Anthropic API authentication
   - Proxies requests securely

2. **API Flow**
   ```
   Frontend → Backend → Anthropic Claude API → Backend → Frontend
   ```

3. **Security**
   - Store API keys in environment variables
   - Never expose keys in frontend code
   - Use HTTPS for all requests

**Example Backend (server.js):**
```javascript
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

app.post('/api/chat', async (req, res) => {
  const { message, wikiArticles } = req.body;
  
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [{
      role: 'user',
      content: `${wikiArticles}\n\nQuestion: ${message}`
    }]
  });
  
  res.json(response);
});

app.listen(3001);
```

---

## Appendix

### A. Dependencies Reference

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.3.1 | UI library |
| react-dom | 18.3.1 | React renderer |
| lucide-react | 0.344.0 | Icons |
| vite | 5.4.11 | Build tool |
| @vitejs/plugin-react | 4.3.4 | React plugin |
| tailwindcss | 3.4.1 | CSS framework |
| postcss | 8.4.35 | CSS processor |
| autoprefixer | 10.4.18 | CSS prefixing |

### B. File Size Reference

- **Production Build:** ~150KB (gzipped)
- **node_modules:** ~200MB
- **Source Code:** ~15KB

### C. Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

### D. Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview build

# Maintenance
npm outdated            # Check for updates
npm update              # Update dependencies
npm audit               # Security audit
npm audit fix           # Fix vulnerabilities

# Clean install
rm -rf node_modules package-lock.json
npm install
```

### E. Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Wikipedia API](https://www.mediawiki.org/wiki/API:Main_page)
- [Lucide Icons](https://lucide.dev)

---

## Document Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Oct 14, 2025 | Initial release |

---

**Document Authors:** Development Team  
**Last Updated:** October 14, 2025  
**Status:** Complete ✅
