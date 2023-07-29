import express, { Express, Request, Response, NextFunction } from "express";
import { prisma } from "../server";
import bcrypt from "bcrypt";
import { rateLimiter } from "../middleware/ratelimiter";
import { sign } from "jsonwebtoken";
import ms from "ms";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authRouter = express.Router();
authRouter.use(rateLimiter);

authRouter.get("/verify/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Missing body parameter" });

  await prisma.company.update({
    where: {
      id: id,
    },
    data: {
      verified: true,
    },
  });

  return res.status(200).json({ success: "Verified" });
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Missing body parameter" });

  const company = await prisma.company.findUnique({
    where: {
      email: email,
    },
  });

  const errorMessage =
    "Login attempt was unsuccessful. Please check your credentials and try again";
  if (!company) return res.status(400).json({ error: errorMessage });

  const hashedPassword = await bcrypt.hash(password, company.salt);

  if (company.password !== hashedPassword)
    return res.status(400).json({ error: errorMessage });

  const token = generateAccessToken(company.id);

  return res.status(200).json({ success: "Logged in", token: token });
});

function generateAccessToken(id: string) {
  return sign({ id: id }, JWT_SECRET, { expiresIn: ms("1y3") / 1000 });
}

// function authenticateToken(req: Request, res: Response, next: NextFunction) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (token == null) return res.sendStatus(401);

//   verify(token, JWT_SECRET as string, (err: any, user: any) => {
//     console.log(err);

//     if (err) return res.sendStatus(403);
//     next();
//   });
// }
