import { Request, Response } from "express";
import { Video } from "../../types/video";
import { videoRepository } from "../../../repositories/videoRepository";
import { HttpStatus } from "../../../core/types/http-statuses";

export const getVideoHandler = (
  req: Request<{ id: string }>,
  res: Response<Video>,
) => {
  const video = videoRepository.getVideoById(req.params.id);
  if (!video) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  res.status(HttpStatus.Ok).send(video);
};
