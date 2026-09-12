import { Request, Response } from "express";
import { VideoInputDto } from "../../dto/video.input.dto";
import { Video } from "../../types/video";
import { validateVideoInputDto } from "../../validation/video.input.dto.validation";
import { HttpStatus } from "../../../core/types/http-statuses";
import { db } from "../../../db/in-memory.db";

export const createVideoHandler = (
  req: Request<{}, Video, VideoInputDto>,
  res: Response,
) => {
  const errors = validateVideoInputDto(req.body);
  if (errors.length > 0) {
    res.status(HttpStatus.BadRequest).send({ errorsMessages: errors });
    return;
  }

  const lastVideo = db.videos[db.videos.length - 1];
  const newVideo: Video = {
    id: lastVideo ? lastVideo.id + 1 : 1,
    title: req.body.title,
    author: req.body.author,
    canBeDownloaded: false,
    minAgeRestriction: null,
    availableResolutions: req.body.availableResolutions,
    createdAt: new Date().toISOString(),
    publicationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  db.videos.push(newVideo);
  res.status(HttpStatus.Created).send(newVideo);
};
