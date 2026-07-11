import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace');
  const db = mongoose.connection.db;
  if (!db) return;
  const users = await db.collection('user').find({}).toArray();
  console.log("Users in DB:", users.length, users.map(u => u.email));
  process.exit(0);
}
run();
