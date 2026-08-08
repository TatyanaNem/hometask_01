import { ValidationError } from "../../core/types/validation-error";
import { VideoUpdateDto } from "../dto/video.update.dto";
import { validateVideoInputDto } from "./video.input.dto.validation";

export const validateVideoUpdateDto = (
  data: VideoUpdateDto,
): ValidationError[] => {
  const errors: ValidationError[] = validateVideoInputDto(data);

  if (typeof data.canBeDownloaded !== "boolean") {
    errors.push({
      message: "canBeDownloaded must be a boolean",
      field: "canBeDownloaded",
    });
  }

  if (
    data.minAgeRestriction !== null &&
    (typeof data.minAgeRestriction !== "number" ||
      data.minAgeRestriction < 1 ||
      data.minAgeRestriction > 18)
  ) {
    errors.push({
      message: "minAgeRestriction must be null or a number between 1 and 18",
      field: "minAgeRestriction",
    });
  }

  if (typeof data.publicationDate !== "string") {
    errors.push({
      message: "publicationDate must be a string",
      field: "publicationDate",
    });
  } else if (!data.publicationDate || isNaN(Date.parse(data.publicationDate))) {
    errors.push({
      message: "publicationDate must be a valid date string",
      field: "publicationDate",
    });
  }

  return errors;
};
