import express, { Express, Request, Response } from "express";
import { prisma } from "../server";

export const deliveryMethodsRouter = express.Router();

deliveryMethodsRouter.post(
  "/deliveryMethods",
  async (req: Request, res: Response) => {
    const { name, price, alwaysTax } = req.body;

    if (!name || !price || !alwaysTax)
      return res.status(400).json({ error: "Missing body parameter" });

    const deliveryMethod = await prisma.deliveryMethod.create({
      data: {
        name: name,
        price: price,
        alwaysTax: alwaysTax,
      },
    });

    return res.status(201).json({
      success: "Delivery Method created",
      deliveryMethod: deliveryMethod,
    });
  }
);

deliveryMethodsRouter.get(
  "/deliveryMethods",
  async (req: Request, res: Response) => {
    const deliveryMethods = await prisma.deliveryMethod.findMany();

    const response = deliveryMethods.map((deliveryMethod) => {
      return {
        id: deliveryMethod.id,
        name: deliveryMethod.name,
        price: deliveryMethod.price,
        alwaysTax: deliveryMethod.alwaysTax,
      };
    });

    res.status(200).json(response);
  }
);
