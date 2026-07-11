import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { getAuth, initAuth } from './src/lib/auth.js';
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace');
  await initAuth();
  const auth = getAuth();
  
  try {
    const regResult = await auth.api.signUpEmail({
      body: { email: 'demo@marketplace.com', password: 'demo1234', name: 'Demo User' }
    });
    console.log("Register Result keys:", Object.keys(regResult));
    console.log("Register Result token:", (regResult as any).token);
  } catch (e: any) {
    console.log("Register error:", e.message);
  }
  
  try {
    const loginResult = await auth.api.signInEmail({
      body: { email: 'demo@marketplace.com', password: 'demo1234' }
    });
    console.log("Login Result keys:", Object.keys(loginResult));
    console.log("Login Result token:", (loginResult as any).token);
  } catch (e: any) {
    console.log("Login error:", e.message);
  }
  
  process.exit(0);
}
run();
