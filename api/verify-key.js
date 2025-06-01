// api/verify-key.js
const Redis = require('ioredis');

module.exports = async (req, res) => {
  // Log request method and query
  console.log(`Request received: method=${req.method}, query=${JSON.stringify(req.query)}`);

  if (req.method !== 'GET') {
    console.error('Invalid method:', req.method);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { key } = req.query;

  if (!key) {
    console.error('No key provided in query');
    return res.status(400).json({ success: false, message: 'Key is required' });
  }

  console.log(`Verifying key: ${key}`);

  try {
    // Connect to Redis
    const redis = new Redis('redis://default:QTQUXTdXMXwqhnqTDEsBcFRwEGvPqlIj@metro.proxy.rlwy.net:51092', {
      connectTimeout: 10000,
      maxRetriesPerRequest: 3,
      enableOfflineQueue: false, // Prevent queuing if Redis is down
    });

    console.log('Connecting to Redis...');

    // Test Redis connection
    const pingResponse = await redis.ping();
    if (pingResponse !== 'PONG') {
      console.error('Redis ping failed');
      await redis.quit();
      return res.status(500).json({ success: false, message: 'Redis connection failed' });
    }
    console.log('Redis connection successful');

    // Check key in Redis
    const keyData = await redis.get(key);
    console.log(`Key ${key} value in Redis: ${keyData}`);

    if (keyData !== 'valid') {
      console.log(`Key ${key} is invalid, expired, or already used. Found value: ${keyData}`);
      await redis.quit();
      return res.status(400).json({ success: false, message: 'Invalid or expired key' });
    }

    // Mark key as used
    console.log(`Marking key ${key} as used`);
    await redis.setex(key, 3600, 'used');
    console.log(`Key ${key} marked as used with 3600s TTL`);

    await redis.quit();
    console.log('Redis connection closed');

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in verify-key:', error.message, error.stack);
    try { await redis.quit(); } catch (e) { console.error('Error closing Redis:', e); }
    res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
};
