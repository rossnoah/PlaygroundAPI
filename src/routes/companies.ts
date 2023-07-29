import express, { Express, Request, Response } from "express";
import { prisma } from "../server";
import { createCompany } from "../utils/companies.utils";

export const companiesRouter = express.Router();

// model Company {
//   id          String   @id @default(uuid())
//   name        String
//   address     String
//   email       String
//   phone       String
//   nexusStates State[]
//   createdAt   DateTime @default(now())
//   updatedAt   DateTime @updatedAt
// }

companiesRouter.post("/companies", async (req: Request, res: Response) => {
  const { name, address, email, phone, password } = req.body;

  if (!name || !address || !email || !phone || !password)
    return res.status(400).json({ error: "Missing body parameter" });

  // check if the email is already in use
  const existing = await prisma.company.findUnique({
    where: {
      email: email,
    },
  });

  if (existing) return res.status(400).json({ error: "Email already in use" });

  const response = await createCompany(name, address, email, phone, password);

  return res
    .status(201)
    .json({ success: "Company created", company: response });
});

companiesRouter.get("/companies", async (req: Request, res: Response) => {
  const companies = await prisma.company.findMany();

  const response = companies.map((company) => {
    return {
      id: company.id,
      name: company.name,
      address: company.address,
      email: company.email,
      phone: company.phone,
    };
  });

  res.status(200).json(response);
});
