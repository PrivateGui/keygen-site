// api/verify-key.js
const Redis = require('ioredis');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    console.error('Method not allowed:', req.method);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { key } = req.query;

  if (!key) {
    console.error('Key is missing in query parameters');
    return res.status(400).json({ success: false, message: 'Key is required' });
  }

  try {
    // Connect to Redis
    const redis = new Redis('redis://default:QTQUXTdXMXwqhnqTDEsBcFRwEGvPqlIj@metro.proxy.rlwy.net:51092', {
      connectTimeout: 10000, // 10 seconds timeout
      maxRetriesPerRequest: 3,
    });

    // Log Redis connection attempt
    console.log('Attempting to connect to Redis...');

    // Test Redis connection
    await redis.ping().catch((err) => {
      console.error('Redis ping failed:', err);
      throw new Error('Failed to connect to Redis');
    });
    console.log('Redis connection successful');

    // Check if key exists and is not used
    const keyData = await redis.get(key);
    console.log(`Key ${key} status: ${keyData}`);

    if (!keyData || keyData === 'used') {
      await redis.quit();
      console.log(`Key ${key} is invalid or already used`);
      return res.status(400).json({ success: false, message: 'Invalid or expired key' });
    }

    // Key is valid; mark as used
    await redis.setex(key, 3600, 'used'); // Expire in 1 hour
    console.log(`Key ${key} marked as used with 1-hour expiration`);
    await redis.quit();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in verify-key:', error.message, error.stack);
    res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
};
