
import express from 'express'
import { PrismaClient } from './generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';



const prisma = new PrismaClient({
    adapter: new PrismaPg({})
});

const app = express();

app.get("/test", async (req, res) => {
    const test = await prisma.user.create({
        data: {
            firstName: "Suhas",
            lastName: "Hegade",
            passwordHash: "wioanfoawinfoniaw",
            username: "suhas9980",
        }
    })
    console.log(test)
    res.status(200).send("test")
})

app.listen(3000, () => {
    console.log("Server started")
})