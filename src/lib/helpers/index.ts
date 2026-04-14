export const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

export const getPercent = (val: number, min: number, max: number): number =>
  ((val - min) / (max - min)) * 100;
