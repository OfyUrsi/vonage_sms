import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import pool from '../db.js';
import { Verify } from '@vonage/verify';
import { Auth } from '@vonage/auth';

const router = express.Router();

// Initialize Vonage
const vonage = new Verify(
  new Auth({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET,
  })
);

// ======================
// Start verification
// ======================
router.post('/start-verification', async (req, res) => {
  const { phone } = req.body;
  console.log('📲 Received phone:', phone);

  try {
    const response = await vonage.start({ number: phone, brand: 'MyApp' });
    const requestId = response.request_id;
    console.log('✅ Vonage requestId:', requestId);

    // Save request_id to DB
    await pool.query(
      `INSERT INTO users (phone, status, requested_at, request_id)
       VALUES ($1, $2, NOW(), $3)
       ON CONFLICT (phone)
       DO UPDATE SET request_id = $3, status = 'pending', requested_at = NOW()`,
      [phone, 'pending', requestId]
    );

    res.json({ success: true, requestId });
  } catch (error) {
    console.error('❌ Verification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ======================
// Check verification
// ======================
router.post('/check-verification', async (req, res) => {
  const { code, phone } = req.body;

  try {
    const { rows } = await pool.query(
      'SELECT request_id FROM users WHERE phone = $1',
      [phone]
    );

    if (rows.length === 0) {
      console.log('❌ No user found for phone:', phone);
      return res.status(404).json({ success: false, error: 'Phone not found' });
    }

    const requestId = rows[0].request_id;
    console.log('✅ Using requestId for verification:', requestId);

    const response = await vonage.check({ request_id: requestId, code });

    if (response.status === '0') {
      // Success
      await pool.query(
        'UPDATE users SET status = $1, verified_at = NOW() WHERE phone = $2',
        ['verified', phone]
      );
      res.json({ success: true });
    } else {
      res.json({ success: false, error: 'Code incorrect or expired' });
    }
  } catch (error) {
    console.error('❌ Check error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
