// api/verify-key.js
module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { key } = req.query;

  // Validate key (use your storage solution)
  // For simplicity, assume a temporary in-memory store or Vercel KV
  const keyData = { used: false, expires: Date.now() + 24 * 60 * 60 * 1000 }; // Mock data

  if (!keyData || keyData.used || keyData.expires < Date.now()) {
    return res.status(400).json({ success: false, message: 'Invalid or expired key' });
  }

  // Mark key as used
  // Example: await kv.set(key, { ...keyData, used: true });

  res.status(200).json({ success: true });
};
