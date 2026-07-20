import express, { Express, Request, Response } from "express";
import { db } from "./db/in-memory.db";
import { videosRouter } from "./videos/routers/videos.router";
import { testingRouter } from "./testing/routers/testing.router";

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  app.use("/hometask_01/api/videos", videosRouter);
  app.use("/hometask_01/api/testing", testingRouter);

  return app;
};
