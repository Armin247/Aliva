import type { VercelRequest, VercelResponse } from '@vercel/node';

// Paystack webhook stub: verify signature and log event
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // NOTE: For production, compute and verify Paystack signature header 'x-paystack-signature'
  // against your PAYSTACK_SECRET_KEY. Then update your database accordingly.

  try {
    const event = req.body;
    console.log('🔔 Paystack webhook event:', event?.event, event?.data?.reference);
    // TODO: match reference -> user, set plan and planExpiresAt in your DB securely
    res.status(200).json({ received: true });
  } catch (e) {
    res.status(400).json({ error: 'Invalid payload' });
  }
}


