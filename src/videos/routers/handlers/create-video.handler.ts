import { Request, Response } from "express";
import { VideoInputDto } from "../../dto/video.input.dto";
import { Video } from "../../types/video";
import { validateVideoInputDto } from "../../validation/video.input.dto.validation";
import { HttpStatus } from "../../../core/types/http-statuses";
import { db } from "../../../db/in-memory.db";
import { videoRepository } from "../../../repositories/videoRepository";

export const createVideoHandler = (
  req: Request<{}, Video, VideoInputDto>,
  res: Response,
) => {
  const errors = validateVideoInputDto(req.body);
  if (errors.length > 0) {
    res.status(HttpStatus.BadRequest).send({ errorsMessages: errors });
    return;
  }

  const newVideo = videoRepository.createVideo(req.body);
  res.status(HttpStatus.Created).send(newVideo);
};
