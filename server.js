// server.js
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000', process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '*'],
  methods: ['GET', 'POST'],
  credentials: true
}));

// Initialize OpenAI
let openai;
try {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY is not set in environment variables');
  } else {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('✅ OpenAI API Key configured');
  }
} catch (error) {
  console.error('❌ Error initializing OpenAI:', error.message);
}

const ALIVA_SYSTEM_PROMPT = `You are Aliva, a professional AI nutritionist and medical practitioner specializing in dietary guidance and health recommendations. You provide evidence-based, compassionate, and personalized nutrition advice.

Key characteristics:
- Professional yet approachable tone
- Always prioritize patient safety and well-being
- Provide specific, actionable dietary recommendations
- Consider medical conditions when giving advice
- Encourage users to consult healthcare providers for serious conditions
- Focus on whole foods, balanced nutrition, and sustainable eating habits
- Be empathetic to users' challenges and preferences

Guidelines for responses:
- Keep responses concise but informative (2-4 sentences typically)
- Always acknowledge the user's condition or concern
- Provide specific food recommendations when appropriate
- Mention portion sizes or preparation methods when relevant
- If a user mentions serious symptoms, gently suggest consulting a doctor
- End with an encouraging or supportive statement when appropriate

When users ask about restaurant searches or want to find places to eat, respond positively and suggest they can say "find restaurants" to see nearby options that align with your recommendations.

Remember: You're here to guide users toward healthier eating choices while being understanding of their current situation and preferences.`;

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  console.log('📥 Received chat request');

  try {
    const { message, chatHistory = [] } = req.body;
    console.log('📨 Message:', message);
    console.log('📚 Chat history length:', chatHistory.length);

    if (!message) {
      console.log('❌ No message provided');
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if OpenAI is initialized
    if (!openai) {
      console.log('❌ OpenAI not initialized');
      return res.status(500).json({
        error: 'OpenAI API key not configured',
        fallbackResponse: "I'm experiencing configuration issues. For general health advice, focus on balanced meals with plenty of vegetables, lean proteins, and whole grains. Please try again later."
      });
    }

    // Build conversation history for context
    const messages = [
      { role: 'system', content: ALIVA_SYSTEM_PROMPT },
      ...chatHistory.slice(-8).map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    console.log('🤖 Calling OpenAI API...');

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 300,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const aiResponse = completion.choices[0]?.message?.content || 
      "I'm here to help with your nutrition questions. Could you tell me more about what you're looking for?";

    console.log('✅ OpenAI response received');
    console.log('📤 Response preview:', aiResponse.substring(0, 100) + '...');

    return res.status(200).json({
      response: aiResponse,
      usage: completion.usage
    });

  } catch (error) {
    console.error('❌ OpenAI API error:', error);
    
    let errorMessage = 'AI service temporarily unavailable';
    let fallbackResponse = "I'm experiencing technical difficulties right now. For general nutrition advice, focus on whole foods, plenty of vegetables, lean proteins, and staying hydrated. Please try again in a moment.";

    if (error.code === 'invalid_api_key') {
      console.log('❌ Invalid API key');
      errorMessage = 'Invalid API key';
      fallbackResponse = "There's an API configuration issue. For now, I recommend consulting with a healthcare provider for personalized nutrition advice.";
    } else if (error.code === 'rate_limit_exceeded') {
      console.log('❌ Rate limit exceeded');
      errorMessage = 'Rate limit exceeded';
      fallbackResponse = "I'm receiving too many requests right now. Please wait a moment and try again.";
    } else if (error.code === 'insufficient_quota') {
      console.log('❌ Insufficient quota');
      errorMessage = 'OpenAI quota exceeded';
      fallbackResponse = "The AI service quota has been exceeded. Please try again later.";
    }
    
    return res.status(500).json({ 
      error: errorMessage,
      fallbackResponse,
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('🏥 Health check requested');
  res.json({ 
    status: 'Server is running!', 
    timestamp: new Date().toISOString(),
    openaiConfigured: !!process.env.OPENAI_API_KEY 
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Aliva API Server is running!' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('🔥 Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`🔑 OpenAI API Key configured: ${!!process.env.OPENAI_API_KEY}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   - GET  http://localhost:${port}/api/health`);
  console.log(`   - POST http://localhost:${port}/api/chat`);
});