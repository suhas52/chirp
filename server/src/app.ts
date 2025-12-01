
import express from 'express'

import { configDotenv } from 'dotenv';
import { authRouter } from './routes/authRoutes.ts';

configDotenv();
const PORT = process.env.SERVER_PORT || 3000;

const app = express();
app.use(express.urlencoded())
app.use(express.json())
app.use("/api", authRouter)


app.listen(PORT, () => {
    console.log("Server started on port: ", PORT)
})