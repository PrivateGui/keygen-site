import clientPromise from "../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Only GET allowed" });
  }

  const { key } = req.query;
  if (!key) {
    return res.status(400).json({ success: false, message: "No key provided" });
  }

  const client = await clientPromise;
  const db = client.db("vercel_db");
  const keys = db.collection("keys");

  const keyDoc = await keys.findOne({ key });

  if (!keyDoc) {
    return res.json({ success: false, message: "❌ Invalid key" });
  }

  if (keyDoc.used) {
    return res.json({ success: false, message: "❌ Already used" });
  }

  await keys.updateOne({ key }, { $set: { used: true, usedAt: new Date() } });

  return res.json({ success: true, message: "✅ Verified successfully" });
}
