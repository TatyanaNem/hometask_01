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
      message: "Title is required",
      field: "title",
    });
  }

  if (data.title && isInvalidString(data.title, 1, 40)) {
    errors.push({
      message: "Title is too long",
      field: "title",
    });
  }

  if (!data.author) {
    errors.push({
      message: "Поле author обязательно",
      field: "author",
    });
  }

  if (data.author && isInvalidString(data.author, 1, 20)) {
    errors.push({
      message: "Author is too long",
      field: "author",
    });
  }

  if (!data.availableResolutions) {
    errors.push({
      message: "AvailableResolutions field is required",
      field: "availableResolutions",
    });
  }

  if (!Array.isArray(data.availableResolutions)) {
    errors.push({
      message: "availableResolutions must be an array",
      field: "availableResolutions",
    });
  } else {
    const validFeatures = Object.values(AvailableResolutions);
    const hasInvalidFeature = data.availableResolutions.some(
      (feature) => !validFeatures.includes(feature),
    );
    if (hasInvalidFeature) {
      errors.push({
        message: "Invalid available Resolutions value",
        field: "availableResolutions",
      });
    }
  }
  return errors;
};
