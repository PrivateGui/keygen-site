// utils/key-generation.js
const { v4: uuidv4 } = require('uuid');

function generateKey() {
  return uuidv4();
}

function validateKey(key, store) {
  // Check if key exists and is not expired or used
  const keyData = store.get(key);
  if (!keyData || keyData.used || keyData.expires < Date.now()) {
    return false;
  }
  return true;
}

function expireKey(key, store) {
  // Mark key as used or delete it
  store.set(key, { ...store.get(key), used: true });
}

module.exports = { generateKey, validateKey, expireKey };
