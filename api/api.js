// api/generate-key.js
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { 'h-captcha-response': hcaptchaResponse } = req.body;
  const secretKey = 'ES_21a96b2773da463eb20321bd5c92417d'; // Replace with your hCaptcha secret key

  // Verify hCaptcha
  try {
    const verificationResponse = await fetch('https://api.hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `response=${hcaptchaResponse}&secret=${secretKey}`,
    });

    const verificationData = await verificationResponse.json();
    if (!verificationData.success) {
      return res.status(400).json({ success: false, message: 'hCaptcha verification failed' });
    }

    // Generate unique key
    const key = uuidv4();
    
    // Store key in Vercel KV (or another database)
    // For simplicity, assume a temporary in-memory store or use Vercel KV
    // Example: await kv.set(key, { used: false, expires: Date.now() + 24 * 60 * 60 * 1000 });

    res.status(200).json({ success: true, key });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
