import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { getAuth, initAuth } from './src/lib/auth.js';
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace');
  await initAuth();
  const auth = getAuth();
  
  try {
    const db = mongoose.connection.db;
    if (db) {
        await db.collection('user').deleteOne({ email: 'demo@marketplace.com' });
        console.log("Deleted old demo user");
    }

    const regResult = await auth.api.signUpEmail({
      body: { email: 'demo@marketplace.com', password: 'demo123', name: 'Demo User' }
    });
    console.log("Demo user registered successfully with password 'demo123'!");
  } catch (e: any) {
    console.log("Register error:", e.message);
  }
  
  process.exit(0);
}
run();
