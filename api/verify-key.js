import { createClient } from 'redis';

const redis = createClient({ url: 'redis://default:QTQUXTdXMXwqhnqTDEsBcFRwEGvPqlIj@metro.proxy.rlwy.net:51092' });
await redis.connect();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'POST only' });

  const { key } = req.body;
  if (!key) return res.status(400).json({ message: 'Missing key' });

  const status = await redis.get(key);
  if (!status) return res.status(404).json({ message: 'Key not found or expired' });

  await redis.del(key); // consume key
  return res.status(200).json({ message: 'Key valid' });
}
