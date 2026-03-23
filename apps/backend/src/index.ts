import express from 'express'
import cors from 'cors'
import { Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import newsRoutes from "./routes/news.routes";
import userRoutes from "./routes/user";
import sentimentRoutes from "./routes/sentiment.routes";
import aiRoutes from "./routes/ai.routes";
import { STATUS_CODES } from './statusCodes';
import "dotenv/config";
import { authMiddleware } from './middleware';
import { requestLogger } from './middleware/requestLogger';
const app=express()
app.use(cors())
app.use(express.json())
app.use(requestLogger)
const Port = parseInt(process.env.PORT || "3000", 10);

app.use("/auth", authRoutes);
app.use("/news",authMiddleware,newsRoutes);
app.use("/user",authMiddleware,userRoutes);
app.use("/sentiment",authMiddleware,sentimentRoutes);
app.use("/ai",authMiddleware,aiRoutes);
app.get("/",(req:Request,res:Response)=>{
    res.status(STATUS_CODES.OK).json({
        "message":"backend is running"
    })
})

app.listen(Port,()=>{
    console.log(`Primary Backend is running at port: ${Port}`);
})