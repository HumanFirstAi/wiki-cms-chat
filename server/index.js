import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Calculate __dirname first
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env IMMEDIATELY
dotenv.config({ path: path.join(__dirname, '.env') });

// NOW import other modules AFTER env is loaded
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import cors from 'cors';

console.log('=== SERVER STARTING ===');
console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);
console.log('=== SERVER STARTING ===');
console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);
console.log('Key length:', process.env.ANTHROPIC_API_KEY?.length);
console.log('Port:', process.env.PORT || 3001);
console.log('======================');

const app = express();
const PORT = process.env.PORT || 3001;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes - THESE MUST COME FIRST, BEFORE STATIC FILES
// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Extract keywords using Claude
app.post('/api/extract-keywords', async (req, res) => {
  console.log('📥 Received keyword extraction request:', req.body);
  console.log('🔑 API Key being used:', process.env.ANTHROPIC_API_KEY?.substring(0, 30) + '...');

  try {
    const { query } = req.body;

    if (!query) {
      console.error('❌ No query provided');
      return res.status(400).json({
        success: false,
        error: 'Query is required',
        keywords: ''
      });
    }

    console.log('🤖 Calling Claude API for:', query);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: `Extract the main search keywords from this question for a Wikipedia search. Return ONLY the keywords, nothing else. Capitalize proper nouns.

Question: "${query}"

Keywords:`
      }]
    });

    const keywords = message.content[0].text.trim();

    res.json({
      success: true,
      keywords: keywords
    });

  } catch (error) {
    console.error('Keyword extraction error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      keywords: req.body.query || '' // Fallback to original query
    });
  }
});

// Streaming endpoint
app.post('/api/chat/stream', async (req, res) => {
  try {
    const { query, articles } = req.body;

    let context = '';
    if (articles && articles.length > 0) {
      context = 'Here are relevant Wikipedia articles:\n\n';
      articles.forEach(article => {
        context += `Article: ${article.title}\n`;
        context += `Content: ${article.extract}\n`;
        context += `Source: ${article.url}\n\n`;
      });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: articles && articles.length > 0
          ? `${context}\n\nBased on these Wikipedia articles, please answer this question in a natural, conversational way: ${query}\n\nProvide a clear, informative answer and mention which articles you're referencing.`
          : `I don't have any Wikipedia articles about this topic. Question: ${query}\n\nPlease provide a brief, helpful answer based on your general knowledge.`
      }]
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true, articlesUsed: articles?.length || 0 })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Streaming error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// Serve static files from the dist directory
// This comes AFTER API routes so API routes take precedence
app.use(express.static(path.join(__dirname, '../dist')));

// SPA fallback - serve index.html for all other routes
// This must be LAST to catch any routes not matched above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, '../dist')}`);
});

