
import express from 'express'

import { configDotenv } from 'dotenv';
import { authRouter } from './routes/authRoutes.ts';

configDotenv();


const app = express();
app.use("/api", authRouter)


app.listen(3000, () => {
    console.log("Server started")
})