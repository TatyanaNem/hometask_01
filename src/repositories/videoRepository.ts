import { db } from "../db/in-memory.db";
import { VideoInputDto } from "../videos/dto/video.input.dto";
import { VideoUpdateDto } from "../videos/dto/video.update.dto";
import { Video } from "../videos/types/video";

export const videoRepository = {
  getAllVideos() {
    return db.videos;
  },
  getVideoById(id: string) {
    return db.videos.find((video) => video.id === parseInt(id));
  },
  createVideo(newVideo: VideoInputDto): Video {
    const lastVideo = db.videos[db.videos.length - 1];
    const createdVideo: Video = {
      id: lastVideo ? lastVideo.id + 1 : 1,
      ...newVideo,
      publicationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      minAgeRestriction: null,
      canBeDownloaded: false,
    };

    db.videos.push(createdVideo);
    return createdVideo;
  },
  deleteVideoById(id: string) {
    db.videos = db.videos.filter((video) => video.id !== parseInt(id));
  },
  updateVideoById(id: string, videoUpdateDto: VideoUpdateDto) {
    db.videos = db.videos.map((video) => {
      if (video.id === parseInt(id)) {
        return {
          ...video,
          ...videoUpdateDto,
        };
      }
      return video;
    });
  },
};
