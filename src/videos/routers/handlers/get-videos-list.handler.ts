import { Request, Response } from "express";
import { Video } from "../../types/video";
import { HttpStatus } from "../../../core/types/http-statuses";
import { videoRepository } from "../../../repositories/videoRepository";

export const getVideosListHandler = (req: Request, res: Response<Video[]>) => {
  res.status(HttpStatus.Ok).send(videoRepository.getAllVideos());
};
