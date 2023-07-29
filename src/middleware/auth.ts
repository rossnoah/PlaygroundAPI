import express, { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import dotenv from "dotenv";
import { prisma } from "../server";
import ms from "ms";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
export const authMiddleware = express.Router();

authMiddleware.use(async (req: Request, res: Response, next: NextFunction) => {
  //   console.log("Auth middleware");

  const token = req.headers["bearer"] as string;
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const decoded: any = verify(token, JWT_SECRET);
    // console.log(decoded);

    const id = decoded.id as string;
    const createdAt = decoded.iat as number;
    const expiresIn = decoded.exp as number;

    if (!id || !createdAt || !expiresIn)
      return res.status(401).json({ error: "Invalid token" });

    const company = await prisma.company.findUnique({
      where: {
        id: id,
      },
    });

    if (!company) return res.status(401).json({ error: "Invalid token" });

    if (company.jwtInvalid.getSeconds() > createdAt + expiresIn / 1000)
      return res.status(401).json({ error: "Expired token" });

    res.locals.company = company;
  } catch (err) {
    // err
    // console.log(err);
    // console.log("Failed to validate token");
    return res.status(401).json({ error: "Failed to validate token" });
  }

  next();
});
