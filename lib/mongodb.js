import { MongoClient } from "mongodb";

// 🔥 Your MongoDB connection string hardcoded
const uri = "mongodb://mongo:ykDvXACYxKsLzLZsIWyVRkkBoKZhvqUz@yamabiko.proxy.rlwy.net:11372";
const options = {};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;
