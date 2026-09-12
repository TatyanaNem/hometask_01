import express, { Express, Request, Response } from "express";
import { db } from "./db/in-memory.db";
import { videosRouter } from "./videos/routers/videos.router";
import { testingRouter } from "./testing/routers/testing.router";
import { VIDEOS_PATH } from "./videos/constants/videos.paths";
import { TESTING_PATH } from "./testing/constants/testing.paths";

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  app.get("/", (_req: Request, res: Response) => {
    res.redirect("/videos");
  });

  app.use(VIDEOS_PATH, videosRouter);
  app.use(TESTING_PATH, testingRouter);

  return app;
};
