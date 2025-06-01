export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false });

  const { captcha } = req.body;
  if (!captcha) return res.status(400).json({ success: false, error: "Missing captcha" });

  const hcaptchaSecret = "ES_21a96b2773da463eb20321bd5c92417d";

  const verifyRes = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `response=${captcha}&secret=${hcaptchaSecret}`,
  });

  const data = await verifyRes.json();
  if (!data.success) return res.status(403).json({ success: false, error: "Captcha failed" });

  const key = [...Array(16)].map(() => Math.random().toString(36)[2]).join("");
  res.json({ success: true, key });
}
