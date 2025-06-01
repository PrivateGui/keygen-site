import clientPromise from "../../lib/mongodb";

function generateRandomKey(length = 16) {
  return [...Array(length)].map(() => Math.random().toString(36)[2]).join("");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Only POST allowed" });
  }

  const client = await clientPromise;
  const db = client.db("vercel_db");
  const keys = db.collection("keys");

  const key = generateRandomKey();
  await keys.insertOne({ key, used: false, createdAt: new Date() });

  return res.json({ success: true, key });
}
