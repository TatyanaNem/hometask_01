import { Router } from "express";
import { VIDEOS_ROUTES } from "../constants/videos.paths";
import { getVideosListHandler } from "./handlers/get-videos-list.handler";
import { getVideoHandler } from "./handlers/get-video.handler";
import { createVideoHandler } from "./handlers/create-video.handler";
import { updateVideoHandler } from "./handlers/update-video.handler";
import { deleteVideoHandler } from "./handlers/delete-video.handler";

export const videosRouter = Router({ mergeParams: true });

videosRouter.get(VIDEOS_ROUTES.ROOT, getVideosListHandler);

videosRouter.get(VIDEOS_ROUTES.BY_ID, getVideoHandler);

videosRouter.post(VIDEOS_ROUTES.ROOT, createVideoHandler);

videosRouter.put(VIDEOS_ROUTES.BY_ID, updateVideoHandler);

videosRouter.delete(VIDEOS_ROUTES.BY_ID, deleteVideoHandler);
