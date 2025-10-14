import React, { useState } from 'react';
import { Send, Loader2, MessageSquare, Book } from 'lucide-react';

export default function WikiCMS() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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
      const articles = await searchWikipedia(userMessage);
      
      if (!articles || articles.length === 0) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `I couldn't find Wikipedia articles about "${userMessage}".`
        }]);
        setLoading(false);
        return;
      }

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
              <h1 className="text-2xl font-bold">Wikipedia Chat</h1>
              <p className="text-sm text-indigo-200">Search Wikipedia</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold mb-2">Welcome!</h2>
              <p className="text-sm">Ask me anything</p>
            </div>
          )}
          
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
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4 flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                <span className="text-sm text-gray-600">Searching...</span>
              </div>
            </div>
          )}
        </div>

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
