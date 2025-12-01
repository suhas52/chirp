import { configDotenv } from "dotenv";

configDotenv();
const SECRET = String(process.env.JWT_SECRET)
if (!SECRET) throw new Error("Please ensure the JWT_SECRET exists in your environment")

