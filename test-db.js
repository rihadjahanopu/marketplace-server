import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));
  
  const users = await mongoose.connection.db.collection('user').find().toArray();
  console.log("Users in 'user':", users);
  
  process.exit(0);
});
