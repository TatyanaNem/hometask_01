import { ValidationError } from "../../core/types/validation-error";
import { VideoUpdateDto } from "../dto/video.update.dto";
import { validateVideoInputDto } from "./video.input.dto.validation";

export const validateVideoUpdateDto = (
  data: VideoUpdateDto,
): ValidationError[] => {
  const errors: ValidationError[] = validateVideoInputDto(data);

  if (typeof data.canBeDownloaded !== "boolean") {
    errors.push({
      field: "canBeDownloaded",
      message: "canBeDownloaded must be a boolean",
    });
  }

  if (
    data.minAgeRestriction !== null &&
    (typeof data.minAgeRestriction !== "number" ||
      data.minAgeRestriction < 1 ||
      data.minAgeRestriction > 18)
  ) {
    errors.push({
      field: "minAgeRestriction",
      message: "minAgeRestriction must be null or a number between 1 and 18",
    });
  }

  if (!data.publicationDate || isNaN(Date.parse(data.publicationDate))) {
    errors.push({
      field: "publicationDate",
      message: "publicationDate must be a valid date string",
    });
  }

  return errors;
};
