import { db } from "../db/in-memory.db";
import { VideoUpdateDto } from "../videos/dto/video.update.dto";

export const videoRepository = {
  getAllVideos() {
    return db.videos;
  },
  getVideoById(id: string) {
    return db.videos.find((video) => video.id === parseInt(id));
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
