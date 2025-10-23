import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageSquare, Book } from 'lucide-react';

export default function WikiCMS() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // API URL - empty string for production (same origin), localhost for development
  const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3001' : '';

  // Auto-scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Claude-powered keyword extraction
  const extractKeywordsWithClaude = async (query) => {
    try {
      const response = await fetch(`${API_URL}/api/extract-keywords`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      return data.keywords || query;
    } catch (error) {
      console.error('Keyword extraction error:', error);
      return query; // Fallback to original query
    }
  };

  const searchWikipedia = async (query) => {
    try {
      const searchResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=3&format=json&origin=*`
      );
      const searchData = await searchResponse.json();
      
      if (!searchData[1] || searchData[1].length === 0) {
        return null;
      }

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

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Use Claude to extract keywords
      console.log('Original query:', userMessage);
      const keywords = await extractKeywordsWithClaude(userMessage);
      console.log('Claude extracted keywords:', keywords);
      
      const articles = await searchWikipedia(keywords);
      
      if (!articles || articles.length === 0) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `I couldn't find Wikipedia articles about "${userMessage}".`
        }]);
        setLoading(false);
        return;
      }

      const assistantMessageIndex = messages.length + 1;
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '',
        sources: articles,
        articlesUsed: articles.length,
        streaming: true
      }]);

      const response = await fetch(`${API_URL}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage,
          articles: articles
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            
            if (data.text) {
              accumulatedText += data.text;
              setMessages(prev => prev.map((msg, idx) => 
                idx === assistantMessageIndex 
                  ? { ...msg, content: accumulatedText }
                  : msg
              ));
            }
            
            if (data.done) {
              setMessages(prev => prev.map((msg, idx) => 
                idx === assistantMessageIndex 
                  ? { ...msg, streaming: false }
                  : msg
              ));
            }

            if (data.error) {
              throw new Error(data.error);
            }
          }
        }
      }

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'error', 
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ height: '90vh' }}>
        
        <div className="bg-indigo-600 text-white p-6">
          <div className="flex items-center gap-3">
            <Book className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Wikipedia Chat with AI</h1>
              <p className="text-sm text-indigo-200">Powered by Claude & Wikipedia</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold mb-2">Welcome!</h2>
              <p className="text-sm mb-4">Ask me anything in natural language</p>
              <div className="space-y-2 text-sm text-left max-w-md mx-auto">
                <p className="bg-gray-50 p-3 rounded-lg">Tell me about the Apollo 11 moon landing</p>
                <p className="bg-gray-50 p-3 rounded-lg">What is quantum computing?</p>
                <p className="bg-gray-50 p-3 rounded-lg">Who was Marie Curie?</p>
              </div>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg p-4 ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : msg.role === 'error'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                  {msg.streaming && <span className="inline-block w-1 h-4 ml-1 bg-gray-700 animate-pulse"></span>}
                </p>
                {msg.sources && msg.sources.length > 0 && !msg.streaming && (
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <p className="text-xs font-bold mb-2">📚 Sources:</p>
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
                {msg.articlesUsed !== undefined && !msg.streaming && (
                  <p className="text-xs mt-2 opacity-70">
                    ✨ AI-powered answer using {msg.articlesUsed} Wikipedia article{msg.articlesUsed !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4 flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                <span className="text-sm text-gray-600">Searching Wikipedia...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 bg-gray-50 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask me anything..."
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
          <p className="text-xs text-gray-500 mt-2">
            Powered by Claude AI + Wikipedia
          </p>
        </div>

      </div>
    </div>
  );
}

