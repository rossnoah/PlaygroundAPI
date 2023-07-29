import express, { Express, Request, Response } from "express";
import { prisma } from "../server";

export const productCategoriesRouter = express.Router();

productCategoriesRouter.post(
  "/productCategories",
  async (req: Request, res: Response) => {
    const { name, description } = req.body;

    if (!name || !description)
      return res.status(400).json({ error: "Missing body parameter" });

    await prisma.productCatagory.create({
      data: {
        name: name,
        description: description,
      },
    });

    return res.status(201).json({ success: "Product Catagory created" });
  }
);

productCategoriesRouter.get(
  "/productCategories",
  async (req: Request, res: Response) => {
    const productCategories = await prisma.productCatagory.findMany();

    const response = productCategories.map((productCategory) => {
      return {
        id: productCategory.id,
        name: productCategory.name,
        description: productCategory.description,
      };
    });

    res.status(200).json(response);
  }
);
