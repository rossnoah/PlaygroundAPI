import express, { Express, Request, Response } from "express";
import { prisma } from "../server";

export const statesRouter = express.Router();

statesRouter.get("/states", async (req: Request, res: Response) => {
  const states = await prisma.state.findMany();

  states.sort((a: { name: number }, b: { name: number }) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  const response = states.map(
    (state: { name: any; abbreviation: any; taxRate: any }) => {
      return {
        name: state.name,
        abbreviation: state.abbreviation,
        taxRate: state.taxRate,
      };
    }
  );

  return res.status(200).json(response);
});

statesRouter.get("/states/:params", async (req: Request, res: Response) => {
  const { params } = req.params;
  const state = await prisma.state.findFirst({
    where: {
      abbreviation: params,
    },
  });
  if (!state) return res.status(404).json({ error: "State not found" });

  const response = {
    name: state.name,
    abbreviation: state.abbreviation,
    taxRate: state.taxRate,
  };

  return res.status(200).json(response);
});
