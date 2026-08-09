import express from "express";
import request from "supertest";
import { setupApp } from "../src/setup-app";
import { HttpStatus } from "../src/core/types/http-statuses";
import { AvailableResolutions, Video } from "../src/videos/types/video";
import { VideoInputDto } from "../src/videos/dto/video.input.dto";
import { VideoUpdateDto } from "../src/videos/dto/video.update.dto";

const app = setupApp(express());

const VIDEOS_PATH = "/videos";
const TESTING_PATH = "/testing";

const validInputDto: VideoInputDto = {
  title: "Valid title",
  author: "Valid author",
  availableResolutions: [AvailableResolutions.P144, AvailableResolutions.P720],
};

const createVideo = async (dto: VideoInputDto = validInputDto) => {
  const response = await request(app)
    .post(VIDEOS_PATH)
    .send(dto)
    .expect(HttpStatus.Created);
  return response.body as Video;
};

describe("Videos API e2e", () => {
  beforeEach(async () => {
    await request(app)
      .delete(`${TESTING_PATH}/all-data`)
      .expect(HttpStatus.NoContent);
  });

  describe("GET /videos", () => {
    it("should return an empty array when there are no videos", async () => {
      const response = await request(app)
        .get(VIDEOS_PATH)
        .expect(HttpStatus.Ok);
      expect(response.body).toEqual([]);
    });

    it("should return all created videos", async () => {
      const video1 = await createVideo({ ...validInputDto, title: "First" });
      const video2 = await createVideo({ ...validInputDto, title: "Second" });

      const response = await request(app)
        .get(VIDEOS_PATH)
        .expect(HttpStatus.Ok);
      expect(response.body).toEqual([video1, video2]);
    });
  });

  describe("GET /videos/:id", () => {
    it("should return 404 for a non-existent video", async () => {
      await request(app).get(`${VIDEOS_PATH}/999`).expect(HttpStatus.NotFound);
    });

    it("should return the video by id", async () => {
      const created = await createVideo();

      const response = await request(app)
        .get(`${VIDEOS_PATH}/${created.id}`)
        .expect(HttpStatus.Ok);
      expect(response.body).toEqual(created);
    });
  });

  describe("POST /videos", () => {
    it("should create a video with correct input data", async () => {
      const response = await request(app)
        .post(VIDEOS_PATH)
        .send(validInputDto)
        .expect(HttpStatus.Created);

      expect(response.body).toEqual({
        id: expect.any(Number),
        title: validInputDto.title,
        author: validInputDto.author,
        availableResolutions: validInputDto.availableResolutions,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: expect.any(String),
        publicationDate: expect.any(String),
      });

      const listResponse = await request(app)
        .get(VIDEOS_PATH)
        .expect(HttpStatus.Ok);
      expect(listResponse.body).toEqual([response.body]);
    });

    it("should return 400 and not create a video when title is missing", async () => {
      const response = await request(app)
        .post(VIDEOS_PATH)
        .send({ ...validInputDto, title: "" })
        .expect(HttpStatus.BadRequest);

      expect(response.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "title" })]),
      );

      const listResponse = await request(app)
        .get(VIDEOS_PATH)
        .expect(HttpStatus.Ok);
      expect(listResponse.body).toEqual([]);
    });

    it("should return 400 when title is too long", async () => {
      const response = await request(app)
        .post(VIDEOS_PATH)
        .send({ ...validInputDto, title: "a".repeat(41) })
        .expect(HttpStatus.BadRequest);

      expect(response.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "title" })]),
      );
    });

    it("should return 400 when author is missing", async () => {
      const response = await request(app)
        .post(VIDEOS_PATH)
        .send({ ...validInputDto, author: "" })
        .expect(HttpStatus.BadRequest);

      expect(response.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "author" })]),
      );
    });

    it("should return 400 when author is too long", async () => {
      const response = await request(app)
        .post(VIDEOS_PATH)
        .send({ ...validInputDto, author: "a".repeat(21) })
        .expect(HttpStatus.BadRequest);

      expect(response.body.errorsMessages).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "author" })]),
      );
    });

    it("should return 400 when availableResolutions contains an invalid value", async () => {
      const response = await request(app)
        .post(VIDEOS_PATH)
        .send({ ...validInputDto, availableResolutions: ["P999"] })
        .expect(HttpStatus.BadRequest);

      expect(response.body.errorsMessages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "availableResolutions" }),
        ]),
      );
    });

    it("should return 400 when availableResolutions is not an array", async () => {
      const response = await request(app)
        .post(VIDEOS_PATH)
        .send({ ...validInputDto, availableResolutions: "P144" })
        .expect(HttpStatus.BadRequest);

      expect(response.body.errorsMessages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "availableResolutions" }),
        ]),
      );
    });
  });

  describe("PUT /videos/:id", () => {
    const updateDto: VideoUpdateDto = {
      title: "Updated title",
      author: "Updated author",
      availableResolutions: [AvailableResolutions.P1080],
      canBeDownloaded: true,
      minAgeRestriction: 18,
      publicationDate: new Date().toISOString(),
    };

    it("should return 404 when updating a non-existent video", async () => {
      await request(app)
        .put(`${VIDEOS_PATH}/999`)
        .send(updateDto)
        .expect(HttpStatus.NotFound);
    });

    it("should update the video and persist changes", async () => {
      const created = await createVideo();

      await request(app)
        .put(`${VIDEOS_PATH}/${created.id}`)
        .send(updateDto)
        .expect(HttpStatus.NoContent);

      const response = await request(app)
        .get(`${VIDEOS_PATH}/${created.id}`)
        .expect(HttpStatus.Ok);

      expect(response.body).toEqual({
        id: created.id,
        createdAt: created.createdAt,
        ...updateDto,
      });
    });

    it("should return 400 and not change the video when input is invalid", async () => {
      const created = await createVideo();

      await request(app)
        .put(`${VIDEOS_PATH}/${created.id}`)
        .send({ ...updateDto, title: "" })
        .expect(HttpStatus.BadRequest);

      const response = await request(app)
        .get(`${VIDEOS_PATH}/${created.id}`)
        .expect(HttpStatus.Ok);
      expect(response.body).toEqual(created);
    });

    it("should return 400 when minAgeRestriction is out of range", async () => {
      const created = await createVideo();

      await request(app)
        .put(`${VIDEOS_PATH}/${created.id}`)
        .send({ ...updateDto, minAgeRestriction: 25 })
        .expect(HttpStatus.BadRequest);
    });
  });

  describe("DELETE /videos/:id", () => {
    it("should return 404 when deleting a non-existent video", async () => {
      await request(app)
        .delete(`${VIDEOS_PATH}/999`)
        .expect(HttpStatus.NotFound);
    });

    it("should delete the video", async () => {
      const created = await createVideo();

      await request(app)
        .delete(`${VIDEOS_PATH}/${created.id}`)
        .expect(HttpStatus.NoContent);

      await request(app)
        .get(`${VIDEOS_PATH}/${created.id}`)
        .expect(HttpStatus.NotFound);

      const listResponse = await request(app)
        .get(VIDEOS_PATH)
        .expect(HttpStatus.Ok);
      expect(listResponse.body).toEqual([]);
    });

    it("should only delete the targeted video", async () => {
      const video1 = await createVideo({ ...validInputDto, title: "Keep me" });
      const video2 = await createVideo({
        ...validInputDto,
        title: "Delete me",
      });

      await request(app)
        .delete(`${VIDEOS_PATH}/${video2.id}`)
        .expect(HttpStatus.NoContent);

      const listResponse = await request(app)
        .get(VIDEOS_PATH)
        .expect(HttpStatus.Ok);
      expect(listResponse.body).toEqual([video1]);
    });
  });
});
