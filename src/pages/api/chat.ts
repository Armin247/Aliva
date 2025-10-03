// api/chat.ts or pages/api/chat.ts (depending on your setup)
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, chatHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build conversation history for context
    const messages = [
      { role: 'system', content: ALIVA_SYSTEM_PROMPT },
      ...chatHistory.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // or 'gpt-4' if you prefer
      messages: messages as any,
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
    
    // Fallback response in case of API issues
    const fallbackResponse = "I'm experiencing some technical difficulties right now. In the meantime, I'd recommend focusing on whole foods, plenty of vegetables, lean proteins, and staying hydrated. Please try again in a moment.";
    
    return res.status(500).json({ 
      error: 'AI service temporarily unavailable',
      fallbackResponse 
    });
  }
}