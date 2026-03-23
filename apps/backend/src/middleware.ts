import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { STATUS_CODES } from "./statusCodes";

interface AuthRequest extends Request {
    user?: jwt.JwtPayload | string;
}

dotenv.config();
const secret_key = (process.env.SECRET_KEY || process.env.JWT_SECRET || "default_secret_123") as string;

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
            message: "Unauthorized"
        });
    }
    try {
        const decoded = jwt.verify(token, secret_key);
        req.user = (decoded as jwt.JwtPayload).userId;
        next();
    } catch (error) {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
            message: "Unauthorized"
        });
    }
};