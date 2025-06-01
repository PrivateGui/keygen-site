// api/generate-key.js (relevant excerpt)
const key = uuidv4();
const redis = new Redis('redis://default:QTQUXTdXMXwqhnqTDEsBcFRwEGvPqlIj@metro.proxy.rlwy.net:51092');
await redis.setex(key, 24 * 60 * 60, 'valid');
await redis.quit();
res.status(200).json({ success: true, key });
