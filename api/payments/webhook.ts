import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import admin from 'firebase-admin';

// Lazy-init Firebase Admin
let adminInitialized = false;
function initAdmin() {
  if (adminInitialized) return;
  try {
    if (admin.apps.length === 0) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
      if (projectId && clientEmail && privateKey) {
        admin.initializeApp({
          credential: admin.credential.cert({ projectId, clientEmail, privateKey })
        });
      } else {
        admin.initializeApp({ credential: admin.credential.applicationDefault() });
      }
    }
    adminInitialized = true;
  } catch (e) {
    console.error('❌ Firebase Admin init failed:', e);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const secret = process.env.PAYSTACK_SECRET_KEY || '';
    const signature = (req.headers['x-paystack-signature'] as string) || '';

    // Best-effort signature verification (stringify parsed body)
    const computed = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');
    if (!secret || !signature || signature !== computed) {
      console.warn('⚠️ Invalid Paystack signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.body as any;
    const evt = event?.event;
    const data = event?.data;
    console.log('🔔 Paystack webhook:', evt, data?.reference);

    // Only handle successful charges
    if (evt === 'charge.success' && data?.status === 'success') {
      // Retrieve metadata
      const metadata = data?.metadata || {};
      const userId: string | undefined = metadata.userId || metadata.user_id || metadata.uid;
      const planRaw: string | undefined = metadata.plan;
      const intervalRaw: string | undefined = metadata.interval;

      if (!userId || !planRaw) {
        console.warn('⚠️ Missing userId/plan in metadata');
        return res.status(200).json({ received: true, updated: false });
      }

      const plan = (planRaw as string).toUpperCase();
      const interval = (intervalRaw as string)?.toLowerCase() || 'monthly';

      // Compute expiry
      let planExpiresAt: Date | null = null;
      if (interval === 'monthly') {
        planExpiresAt = new Date();
        planExpiresAt.setMonth(planExpiresAt.getMonth() + 1);
      } else if (interval === 'yearly') {
        planExpiresAt = new Date();
        planExpiresAt.setFullYear(planExpiresAt.getFullYear() + 1);
      }

      initAdmin();
      if (!adminInitialized) {
        console.error('❌ Admin not initialized; cannot update Firestore');
        return res.status(500).json({ error: 'Admin init failed' });
      }

      const db = admin.firestore();
      await db.collection('profiles').doc(userId).set({
        userId,
        plan,
        planExpiresAt: planExpiresAt,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      console.log(`✅ Updated plan for ${userId} → ${plan} (${interval})`);
      return res.status(200).json({ received: true, updated: true });
    }

    return res.status(200).json({ received: true, ignored: true });
  } catch (e) {
    console.error('❌ Webhook error:', e);
    res.status(400).json({ error: 'Invalid payload' });
  }
}


