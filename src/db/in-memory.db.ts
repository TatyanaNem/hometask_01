import { AvailableResolutions, Video } from "../videos/types/video";

export const db = {
  videos: <Video[]>[
    {
      id: 0,
      title: "string",
      author: "string",
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: new Date().toISOString(),
      publicationDate: new Date().toISOString(),
      availableResolutions: [AvailableResolutions.P144],
    },
  ],
};
