import { ColorPickerMode, GradientColor } from './interface';

export const getMode = (mode: ColorPickerMode | ColorPickerMode[]) => {
  if (Array.isArray(mode) && mode.length === 1) {
    return mode[0];
  }
  return mode;
};

export const isSingleMode = (
  mode: ColorPickerMode | ColorPickerMode[]
): mode is ColorPickerMode.Single => {
  return getMode(mode) === ColorPickerMode.Single;
};
export const isGradientMode = (
  mode: ColorPickerMode | ColorPickerMode[]
): mode is ColorPickerMode.Gradient => {
  return getMode(mode) === ColorPickerMode.Gradient;
};
export const isMultiMode = (
  mode: ColorPickerMode | ColorPickerMode[]
): mode is ColorPickerMode[] => {
  return Array.isArray(getMode(mode));
};

export const getInitialActiveMode = (
  mode: ColorPickerMode | ColorPickerMode[]
): ColorPickerMode => {
  if (isMultiMode(mode)) {
    return ColorPickerMode.Gradient;
  }
  return mode;
};

export const getModeByValue = (
  value: string | GradientColor[],
  defaultValue: string | GradientColor[],
  mode: ColorPickerMode | ColorPickerMode[]
) => {
  if (value && Array.isArray(value)) {
    return ColorPickerMode.Gradient;
  }
  if (value && typeof value === 'string') {
    return ColorPickerMode.Single;
  }
  if (defaultValue && Array.isArray(defaultValue)) {
    return ColorPickerMode.Gradient;
  }
  if (defaultValue && typeof defaultValue === 'string') {
    return ColorPickerMode.Single;
  }
  return getInitialActiveMode(mode as ColorPickerMode | ColorPickerMode[]);
};
