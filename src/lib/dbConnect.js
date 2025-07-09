import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://savalosAdmin:123123123@cluster0.3b6qnpt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGO_URI) {
  throw new Error("⚠️ MONGO_URI no está definida en .env.local");
}

// Persistir conexión entre llamadas usando globalThis
let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
      console.log("🟢 MongoDB conectado");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
