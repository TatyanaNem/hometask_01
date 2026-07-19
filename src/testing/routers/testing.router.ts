import { Router, Response, Request } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { db } from "../../db/in-memory.db";

export const testingRouter = Router({ mergeParams: true });

testingRouter.delete("/all-data", (req: Request, res: Response) => {
  db.videos = [];
  res.sendStatus(HttpStatus.NoContent);
});
