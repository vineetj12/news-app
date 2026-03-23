import { Request, Response } from "express";
import prisma from "@repo/db";
import bcrypt from "bcrypt";
import { STATUS_CODES } from "../statusCodes";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secret_key = (process.env.SECRET_KEY || process.env.JWT_SECRET || "default_secret_123") as string;

export const Signup = async (req: Request, res: Response) => {

  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secret_key,
      { expiresIn: "1d" }

    );

    res.status(STATUS_CODES.CREATED).json({
      message: "User created successfully",
      token,
      user
    });
  } catch (error: any) {
    console.log(error);
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Email already exists"
      });
    }

    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: "Signup failed"
    });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if (!user) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        message: "Invalid email or password"
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        message: "Invalid email or password"
      });
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secret_key,
      { expiresIn: "1d" }
    );
    res.status(STATUS_CODES.OK).json({
      message: "User signed in successfully",
      token,
      user
    });
  } catch (error: any) {
    console.log(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: "Signin failed"
    });
  }
}