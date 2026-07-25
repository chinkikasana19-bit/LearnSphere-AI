import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing from server/.env");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing from server/.env");
  process.exit(1);
}

await connectDB();

app.listen(PORT, () => {
  console.log(`LearnSphere API running on http://localhost:${PORT}`);
});
