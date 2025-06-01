// Use the same storedKeys set from generate-key.js or put in a shared module
let storedKeys = new Set(); // This won't persist, but demo only!

export default function handler(req, res) {
  const key = req.query.key;
  if (!key) return res.status(400).json({ success: false, message: "No key provided" });

  if (storedKeys.has(key)) {
    // Mark key as used by deleting it
    storedKeys.delete(key);
    return res.json({ success: true, message: "Key verified and marked as used." });
  } else {
    return res.json({ success: false, message: "Invalid or already used key." });
  }
}
