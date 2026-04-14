import type { SliderKeyboardActionOptions } from '../models';

export type CalcProps = Omit<SliderKeyboardActionOptions, 'step'>;

export const clamp = ({ val, min, max }: CalcProps) =>
  Math.min(Math.max(val, min), max);

export const getPercent = ({ val, min, max }: CalcProps): number =>
  ((val - min) / (max - min)) * 100;
