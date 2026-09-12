import { Request, Response } from "express";
import { videoRepository } from "../../../repositories/videoRepository";
import { HttpStatus } from "../../../core/types/http-statuses";

export const deleteVideoHandler = (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const video = videoRepository.getVideoById(req.params.id);
  if (!video) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  videoRepository.deleteVideoById(req.params.id);
  res.sendStatus(HttpStatus.NoContent);
};
