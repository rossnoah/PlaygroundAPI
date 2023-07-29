import express from "express";
import { prisma } from "../server";

const productRouter = express.Router();

// productRouter.post("/", async (req, res) => {
//   const { name, price, description, image } = req.body;

//   if (!name || !price || !description || !image)
//     return res.status(400).json({ error: "Missing body parameter" });

//     await prisma.product.create({
//         data: {
//             name: name,
//             price: price,
//             description: description,
//         },

// });
