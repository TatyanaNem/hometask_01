import { ValidationError } from "../../core/types/validation-error";
import { VideoInputDto } from "../dto/video.input.dto";
import { AvailableResolutions } from "../types/video";

const isInvalidString = (value: unknown, min: number, max: number): boolean =>
  typeof value !== "string" ||
  value.trim().length < min ||
  value.trim().length > max;

export const validateVideoInputDto = (
  data: VideoInputDto,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.title) {
    errors.push({
      field: "title",
      message: "Title is required",
    });
  }

  if (data.title && isInvalidString(data.title, 1, 40)) {
    errors.push({
      field: "title",
      message: "Title is too long",
    });
  }

  if (!data.author) {
    errors.push({
      field: "author",
      message: "Поле author обязательно",
    });
  }

  if (data.author && isInvalidString(data.author, 1, 20)) {
    errors.push({
      field: "author",
      message: "Author is too long",
    });
  }

  if (!data.availableResolutions) {
    errors.push({
      field: "availableResolutions",
      message: "AvailableResolutions field is required",
    });
  }

  if (!Array.isArray(data.availableResolutions)) {
    errors.push({
      field: "availableResolutions",
      message: "availableResolutions must be an array",
    });
  } else {
    const validFeatures = Object.values(AvailableResolutions);
    const hasInvalidFeature = data.availableResolutions.some(
      (feature) => !validFeatures.includes(feature),
    );
    if (hasInvalidFeature) {
      errors.push({
        field: "availableResolutions",
        message: "Invalid available Resolutions value",
      });
    }
  }
  return errors;
};
