import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { statesRouter } from "./routes/states";
import { productCategoriesRouter } from "./routes/productCategories";
import {
  seedCompanies,
  seedDeliveryMethods,
  seedProductCategories,
} from "./seed";
import { deliveryMethodsRouter } from "./routes/deliveryMethods";
import { authRouter } from "./routes/auth";
import { companiesRouter } from "./routes/companies";
import { rateLimiter } from "./middleware/ratelimiter";
import { logger } from "./middleware/logger";
import { authMiddleware } from "./middleware/auth";
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT ?? 3000;
const RESEND_KEY = process.env.RESEND_KEY;
if (!RESEND_KEY) throw new Error("Missing RESEND_KEY");
if (!DATABASE_URL) throw new Error("Missing DATABASE_URL");

export const prisma = new PrismaClient();
export const serviceName = "PatioWare";
export const FQDN = "epicfreemoneynow.com";

seedProductCategories();
seedDeliveryMethods();
seedCompanies();

const app: Express = express();
app.use(logger);
app.use(express.json());
app.use(authRouter);
app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!");
});

app.use(authMiddleware);

app.use(statesRouter);
app.use(productCategoriesRouter);
app.use(deliveryMethodsRouter);
app.use(companiesRouter);

app.listen(PORT, () => {
  console.log(`${serviceName} Server running on http://localhost:${PORT}`);
});

// app.get("/states", async (req: Request, res: Response) => {
//   // read the json file tax.json
//   const fs = require("fs");
//   const tax = JSON.parse(fs.readFileSync("./src/tax.json", "utf8"));
//   for (const state in tax) {
//     console.log(JSON.stringify(tax[state]));
//     let stateName = tax[state].state;
//     let rate = tax[state].rate;
//     let abbreviation = state;
//     await prisma.state.create({
//       data: {
//         name: stateName,
//         taxRate: rate,
//         abbreviation: abbreviation,
//       },
//     });
//   }
//   res.send("states");
// });
