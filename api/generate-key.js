export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: "Missing captcha token" });
  }

  // ✅ Verify hCaptcha
  try {
    const verifyRes = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        response: token,
        secret: "ES_21a96b2773da463eb20321bd5c92417d" // ← REPLACE with your hCaptcha secret
      }),
    });

    const verification = await verifyRes.json();
    if (!verification.success) {
      return res.status(400).json({ success: false, message: "Captcha failed" });
    }
  } catch (err) {
    console.error("❌ Captcha error:", err);
    return res.status(500).json({ success: false, message: "Captcha verification failed" });
  }

  // ✅ Generate key
  const generatedKey = Math.random().toString(36).substring(2, 10).toUpperCase();

  // ✅ MongoDB connection
  const { MongoClient } = await import("mongodb");

  const mongoURI = "mongodb://mongo:ykDvXACYxKsLzLZsIWyVRkkBoKZhvqUz@yamabiko.proxy.rlwy.net:11372";

  try {
    const client = new MongoClient(mongoURI, {
      serverSelectionTimeoutMS: 5000, // faster error detection
    });

    await client.connect();
    const db = client.db("keys_db");
    const keys = db.collection("keys");

    await keys.insertOne({
      key: generatedKey,
      used: false,
      createdAt: new Date(),
    });

    await client.close();

    return res.status(200).json({ success: true, key: generatedKey });

  } catch (err) {
    console.error("❌ MongoDB error:", err);
    return res.status(500).json({ success: false, message: "Database error" });
  }
}
