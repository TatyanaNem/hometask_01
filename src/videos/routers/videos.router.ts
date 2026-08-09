import { Router, Response, Request } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { Video } from "../types/video";
import { db } from "../../db/in-memory.db";
import { VideoInputDto } from "../dto/video.input.dto";
import { VideoUpdateDto } from "../dto/video.update.dto";
import { validateVideoInputDto } from "../validation/video.input.dto.validation";
import { validateVideoUpdateDto } from "../validation/video.update.dto.validation";
import { videoRepository } from "../../repositories/videoRepository";

export const videosRouter = Router({ mergeParams: true });

videosRouter.get("/", (req: Request, res: Response<Video[]>) => {
  res.status(HttpStatus.Ok).send(videoRepository.getAllVideos());
});

videosRouter.get(
  "/:id",
  (req: Request<{ id: string }>, res: Response<Video>) => {
    const video = videoRepository.getVideoById(req.params.id);
    if (!video) {
      res.sendStatus(HttpStatus.NotFound);
      return;
    }
    res.status(HttpStatus.Ok).send(video);
  },
);

videosRouter.post(
  "/",
  (req: Request<{}, Video, VideoInputDto>, res: Response) => {
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
  },
);

videosRouter.put(
  "/:id",
  (req: Request<{ id: string }, {}, VideoUpdateDto>, res: Response) => {
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
  },
);

videosRouter.delete("/:id", (req: Request<{ id: string }>, res: Response) => {
  const video = videoRepository.getVideoById(req.params.id);
  if (!video) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  videoRepository.deleteVideoById(req.params.id);
  res.sendStatus(HttpStatus.NoContent);
});
