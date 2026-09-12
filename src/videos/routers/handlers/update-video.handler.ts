import { Request, Response } from "express";
import { VideoUpdateDto } from "../../dto/video.update.dto";
import { videoRepository } from "../../../repositories/videoRepository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { validateVideoUpdateDto } from "../../validation/video.update.dto.validation";

export const updateVideoHandler = (
  req: Request<{ id: string }, {}, VideoUpdateDto>,
  res: Response,
) => {
  const video = videoRepository.getVideoById(req.params.id);
  if (!video) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }

  const errors = validateVideoUpdateDto(req.body);
  if (errors.length > 0) {
    res.status(HttpStatus.BadRequest).send({ errorsMessages: errors });
    return;
  }

  videoRepository.updateVideoById(req.params.id, req.body);
  res.sendStatus(HttpStatus.NoContent);
};
