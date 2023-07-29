import express, { Express, Request, Response, NextFunction } from "express";
import { writeFile, appendFile } from "fs";
export const logger = express.Router();

logger.use((req: Request, res: Response, next: NextFunction) => {
  const logText = `${Date()} METHOD: ${req.method}, PATH: ${req.path}, IP: ${
    req.ip
  }`;
  //   console.log(logText);
  appendFile("serverlog.log", logText + "\n", (err) => {
    if (err) {
      console.log(err);
    }
  });
  next();
});
