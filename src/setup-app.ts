import { VideoInputDto } from "./videos/dto/video.input.dto";
import express, { Express, Request, Response } from "express";
import { db } from "./db/in-memory.db";
import { Video } from "./videos/types/video";
import { HttpStatus } from "./core/types/http-statuses";
import { VideoUpdateDto } from "./videos/dto/video.update.dto";

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  app.get("/hometask_01/api/videos", (req: Request, res: Response<Video[]>) => {
    res.status(HttpStatus.Ok).send(db.videos);
  });

  app.get(
    "/hometask_01/api/videos/:id",
    (req: Request<{ id: string }>, res: Response<Video>) => {
      const id = parseInt(req.params.id);
      const video = db.videos.find((video) => video.id === id);
      if (!video) {
        res.sendStatus(HttpStatus.NotFound);
        return;
      }
      res.status(HttpStatus.Ok).send(video);
    },
  );

  app.post(
    "/hometask_01/api/videos",
    (
      req: Request<{}, Video, { video: VideoInputDto }>,
      res: Response<Video>,
    ) => {
      const lastVideo = db.videos[db.videos.length - 1];
      const newVideo: Video = {
        id: lastVideo ? lastVideo.id + 1 : 1,
        title: req.body.video.title,
        author: req.body.video.author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        availableResolutions: req.body.video.availableResolutions,
        createdAt: new Date().toISOString(),
        publicationDate: new Date(
          Date.now() + 24 * 60 * 60 * 1000,
        ).toISOString(),
      };

      db.videos.push(newVideo);
      res.status(HttpStatus.Created).send(newVideo);
    },
  );

  app.put(
    "/hometask_01/api/videos/:id",
    (
      req: Request<{ id: string }, {}, { video: VideoUpdateDto }>,
      res: Response,
    ) => {
      const videoId = db.videos.find(
        (video) => video.id === Number(req.params.id),
      );
      if (!videoId) {
        res.sendStatus(HttpStatus.NotFound);
        return;
      }
      db.videos = db.videos.map((video) => {
        if (video.id === Number(videoId)) {
          return {
            ...video,
            ...req.body.video,
          };
        }
        return video;
      });
      res.sendStatus(HttpStatus.NoContent);
    },
  );

  app.delete(
    "/hometask_01/api/videos/:id",
    (req: Request<{ id: string }>, res: Response) => {
      const videoId = db.videos.find(
        (video) => video.id === Number(req.params.id),
      );
      if (!videoId) {
        res.sendStatus(HttpStatus.NotFound);
        return;
      }
      db.videos = db.videos.filter((video) => video.id !== Number(videoId));
      res.sendStatus(HttpStatus.NoContent);
    },
  );

  app.delete(
    "/hometask_01/api/testing/all-data",
    (req: Request, res: Response) => {
      db.videos = [];
      res.sendStatus(HttpStatus.NoContent);
    },
  );

  return app;
};
