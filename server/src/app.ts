
import express from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv';
import { authRouter } from './routes/authRoutes.ts';
import { userRouter } from './routes/crudRoutes.ts';
import cookieParser from 'cookie-parser'

configDotenv();
if (!process.env.SERVER_PORT) throw new Error("Please make sure SERVER_PORT is available in your environment");
const PORT = Number(process.env.SERVER_PORT);



const app = express();
app.use(express.urlencoded())
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

app.listen(PORT, () => {
    console.log("Server started on port: ", PORT)
})