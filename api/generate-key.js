import { createClient } from 'redis';
import { verify } from 'hcaptcha';

const redis = createClient({ url: 'redis://default:QTQUXTdXMXwqhnqTDEsBcFRwEGvPqlIj@metro.proxy.rlwy.net:51092' });
await redis.connect();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'POST only' });

  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Missing captcha token' });

  const captcha = await verify('ES_21a96b2773da463eb20321bd5c92417d', token);
  if (!captcha.success) return res.status(401).json({ message: 'Captcha failed' });

  const key = 'KEY-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  await redis.setEx(key, 600, 'valid'); // 10 mins TTL

  return res.status(200).json({ key });
}
