import OpenAI from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getLocationAwarePrompt = (location?: string) => {
  const basePrompt = `You are Aliva, a professional AI nutritionist and medical practitioner specializing in dietary guidance and health recommendations. You provide evidence-based, compassionate, and personalized nutrition advice.

Key characteristics:
- Professional yet approachable tone
- Always prioritize patient safety and well-being
- Provide specific, actionable dietary recommendations
- Consider medical conditions when giving advice
- Encourage users to consult healthcare providers for serious conditions
- Focus on whole foods, balanced nutrition, and sustainable eating habits
- Be empathetic to users' challenges and preferences`;

  const locationContext = location 
    ? `\n\nUser Location: ${location}
When making food recommendations:
- Suggest locally available and culturally appropriate foods from this region
- Recommend seasonal produce common in this area
- Consider local cuisine and eating habits
- Mention local dishes or ingredients that align with healthy eating
- Suggest where they might find these foods locally (markets, grocery stores, etc.)
- Be aware of regional food availability and preferences`
    : '';

  const guidelines = `\n\nGuidelines for responses:
- Keep responses concise but informative (2-4 sentences typically)
- Always acknowledge the user's condition or concern
- Provide specific food recommendations when appropriate, prioritizing locally available options
- Mention portion sizes or preparation methods when relevant
- If a user mentions serious symptoms, gently suggest consulting a doctor
- End with an encouraging or supportive statement when appropriate

When users ask about restaurant searches or want to find places to eat, respond positively and suggest they can say "find restaurants" to see nearby options that align with your recommendations.

Remember: You're here to guide users toward healthier eating choices while being understanding of their current situation and preferences.`;

  return basePrompt + locationContext + guidelines;
};

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  message: string;
  chatHistory?: ChatMessage[];
  location?: string; // e.g., "Lagos, Nigeria" or "New York, USA"
}

interface ResponseData {
  response?: string;
  usage?: any;
  error?: string;
  fallbackResponse?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, chatHistory = [], location } = req.body as RequestBody;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Verify API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return res.status(500).json({ 
        error: 'AI service not configured',
        fallbackResponse: "The AI service is not properly configured. Please contact support."
      });
    }

    // Build conversation history for context with location-aware prompt
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: getLocationAwarePrompt(location) },
      ...chatHistory.map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' as const : 'user' as const,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 300,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const aiResponse = completion.choices[0]?.message?.content || 
      "I'm here to help with your nutrition questions. Could you tell me more about what you're looking for?";

    return res.status(200).json({ 
      response: aiResponse,
      usage: completion.usage 
    });

  } catch (error: any) {
    console.error('OpenAI API error:', error);
    
    // More specific error messages
    let errorMessage = 'AI service temporarily unavailable';
    if (error?.code === 'invalid_api_key') {
      errorMessage = 'AI service authentication failed';
      console.error('Invalid OpenAI API key');
    } else if (error?.code === 'insufficient_quota') {
      errorMessage = 'AI service quota exceeded';
      console.error('OpenAI quota exceeded');
    }
    
    const fallbackResponse = "I'm experiencing some technical difficulties right now. In the meantime, I'd recommend focusing on whole foods, plenty of vegetables, lean proteins, and staying hydrated. Please try again in a moment.";
    
    return res.status(500).json({ 
      error: errorMessage,
      fallbackResponse 
    });
  }
}