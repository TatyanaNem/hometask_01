import { ValidationError } from "../../core/types/validation-error";
import { VideoInputDto } from "../dto/video.input.dto";
import { AvailableResolutions } from "../types/video";

const isValidLength = (item: string, maxLength: number) => {
  return item.length <= maxLength;
};

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

  if (data.title && !isValidLength(data.title, 40)) {
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

  if (data.author && !isValidLength(data.author, 20)) {
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
