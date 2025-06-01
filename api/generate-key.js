export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Only POST allowed" });
  }

  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, message: "Missing captcha token" });
  }

  // ✅ 1. Verify hCaptcha
  const hRes = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=ES_21a96b2773da463eb20321bd5c92417d&response=${token}`
  });
  const hData = await hRes.json();
  if (!hData.success) {
    return res.status(403).json({ success: false, message: "Captcha failed" });
  }

  // ✅ 2. Generate key
  const key = Math.random().toString(36).substr(2, 10).toUpperCase();

  // ✅ 3. Connect to MongoDB
  const { MongoClient } = await import("mongodb");
  const client = new MongoClient("mongodb://mongo:ykDvXACYxKsLzLZsIWyVRkkBoKZhvqUz@yamabiko.proxy.rlwy.net:11372");

  try {
    await client.connect();
    const db = client.db("keydb");
    const keys = db.collection("keys");

    // Save the key as unused
    await keys.insertOne({ key, used: false, createdAt: new Date() });

    return res.status(200).json({ success: true, key });
  } catch (err) {
    console.error("Mongo error:", err);
    return res.status(500).json({ success: false, message: "Database error" });
  } finally {
    await client.close();
  }
}
