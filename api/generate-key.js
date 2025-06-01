import { createClient } from 'redis';

const redis = createClient({
  url: 'redis://default:QTQUXTdXMXwqhnqTDEsBcFRwEGvPqlIj@metro.proxy.rlwy.net:51092'
});

await redis.connect();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Missing captcha token' });

  // Replace this with your actual hCaptcha secret verification fetch
  const hcaptchaResponse = await fetch('https://hcaptcha.com/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: 'ES_21a96b2773da463eb20321bd5c92417d',
      response: token,
    }),
  });
  const hcaptchaData = await hcaptchaResponse.json();

  if (!hcaptchaData.success) {
    return res.status(401).json({ message: 'hCaptcha verification failed' });
  }

  // Generate key
  const key = 'KEY-' + Math.random().toString(36).substring(2, 10).toUpperCase();

  // Store key in Redis with TTL 10 minutes (600 seconds)
  await redis.setEx(key, 600, 'valid');

  res.status(200).json({ key });
}
