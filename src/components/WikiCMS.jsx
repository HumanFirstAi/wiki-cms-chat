import React, { useState } from 'react';
import { Search, Plus, Trash2, ExternalLink, X, MessageSquare, Send, Loader2 } from 'lucide-react';

export default function WikiCMS() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [wikiQuery, setWikiQuery] = useState('');
  
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const fetchWikipediaArticle = async (title) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
      );
      
      if (!response.ok) {
        throw new Error('Article not found');
      }
      
      const data = await response.json();
      const article = {
        id: Date.now(),
        title: data.title,
        extract: data.extract,
        url: data.content_urls?.desktop?.page || '',
        thumbnail: data.thumbnail?.source || null,
        addedAt: new Date().toISOString()
      };
      
      setArticles(prev => [...prev, article]);
      setWikiQuery('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = (id) => {
    setArticles(prev => prev.filter(article => article.id !== id));
    if (selectedArticle?.id === id) {
      setSelectedArticle(null);
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.extract.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const findRelevantArticles = (query) => {
    const lowerQuery = query.toLowerCase();
    return articles.filter(article => {
      const titleMatch = article.title.toLowerCase().includes(lowerQuery);
      const contentMatch = article.extract.toLowerCase().split(' ').some(word => 
        lowerQuery.includes(word) && word.length > 3
      );
      return titleMatch || contentMatch;
    });
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);

    try {
      const relevantArticles = findRelevantArticles(userMessage);
      
      let context = '';
      if (relevantArticles.length > 0) {
        context = 'Here are relevant Wikipedia articles from the knowledge base:\n\n';
        relevantArticles.forEach(article => {
          context += `Article: ${article.title}\n`;
          context += `Content: ${article.extract}\n`;
          context += `Source: ${article.url}\n\n`;
        });
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: relevantArticles.length > 0 
                ? `${context}\nBased on the articles above, please answer this question: ${userMessage}\n\nIf the articles don't contain relevant information, please say so and provide a general answer based on your knowledge.`
                : `I don't have any relevant Wikipedia articles in my knowledge base about this topic. Question: ${userMessage}\n\nPlease provide a helpful answer based on your general knowledge, and mention that this isn't from the stored articles.`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Claude');
      }

      const data = await response.json();
      const assistantMessage = data.content[0].text;

      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: assistantMessage,
        articlesUsed: relevantArticles.length
      }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { 
        role: 'error', 
        content: 'Sorry, I encountered an error processing your request. Please try again.'
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Wikipedia CMS POC with AI Chat
          </h1>
          <p className="text-gray-600">
            Build your knowledge base and query it with AI
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Wikipedia article title (e.g., 'Apollo 11')"
              value={wikiQuery}
              onChange={(e) => setWikiQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && wikiQuery.trim() && fetchWikipediaArticle(wikiQuery)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => fetchWikipediaArticle(wikiQuery)}
              disabled={loading || !wikiQuery.trim()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              {loading ? 'Fetching...' : 'Add'}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-red-600 text-sm">{error}</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="text-sm text-gray-600 whitespace-nowrap">
              {filteredArticles.length} of {articles.length} articles
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredArticles.map(article => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
              {article.thumbnail && (
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-gray-800">{article.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.extract}</p>
                <div className="flex justify-between items-center">
                  
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Wikipedia
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteArticle(article.id);
                    }}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-2">No articles yet</p>
            <p className="text-gray-400 text-sm">Add your first Wikipedia article to get started</p>
          </div>
        )}

        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-colors z-50"
        >
          <MessageSquare className="w-6 h-6" />
        </button>

        {chatOpen && (
          <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50">
            <div className="bg-indigo-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold">AI Assistant</h3>
                <p className="text-xs text-indigo-200">Ask about your articles</p>
              </div>
              <button onClick={() => setChatOpen(false)} className="hover:bg-indigo-700 p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Ask me anything about your stored articles!</p>
                  <p className="text-xs text-gray-400 mt-2">Try: "Tell me about Apollo 11's moon landing"</p>
                </div>
              )}
              
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white' 
                      : msg.role === 'error'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    {msg.articlesUsed !== undefined && (
                      <p className="text-xs mt-2 opacity-70">
                        📚 Used {msg.articlesUsed} article{msg.articlesUsed !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleChatKeyPress}
                  disabled={chatLoading}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                />
                <button
                  onClick={handleChatSubmit}
                  disabled={chatLoading || !chatInput.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedArticle && (
          <div
            onClick={() => setSelectedArticle(null)}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedArticle.title}</h2>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {selectedArticle.thumbnail && (
                  <img
                    src={selectedArticle.thumbnail}
                    alt={selectedArticle.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}
                
                <p className="text-gray-700 mb-6">{selectedArticle.extract}</p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-bold text-sm text-gray-700 mb-2">Chat Agent Format:</h3>
                  <pre className="text-xs text-gray-600 overflow-x-auto">
                    {JSON.stringify({
                      title: selectedArticle.title,
                      content: selectedArticle.extract,
                      source: selectedArticle.url
                    }, null, 2)}
                  </pre>
                </div>
                
                
                  href={selectedArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="w-4 h-4" />
                  Read full article on Wikipedia
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
