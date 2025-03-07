import express from "express";
import dotenv from "dotenv";
import { setupSwagger } from "./config/swagger.config";
import connectDB from "./db"; 
import expressConfig from "./config/express.config";

import { createClient } from 'redis';
dotenv.config(); 
const app = express();
const port = 3000;

export const redisClient = createClient({
  url: 'redis://localhost:6379'
});

// Connect to Redis
redisClient.connect();

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Handle errors
redisClient.on('error', (err) => {
  console.log('Redis Client Error', err);
});
 
redisClient.on("error", (error) => {
 console.error(error);
});
const dbConnectionString = process.env.MONGO_LOCALURL;
//console.log("hgjdkfhgiduthjgitrjhjtrhitrj587654",dbConnectionString)

//const dbConnectionString="mongodb://localhost:27017/75waydb"

if (!dbConnectionString) {
  console.error("❌ MONGO_LOCALURL environment variable is missing!");
  process.exit(1);
}

expressConfig(app)
setupSwagger(app);
// ✅ Connect to the database first, then start the server
connectDB(dbConnectionString).then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});
