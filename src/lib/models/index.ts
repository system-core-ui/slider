import type { HTMLAttributes } from 'react';

export type SliderOrientation = 'horizontal' | 'vertical';

export interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** The current value of the slider. Can be a single number or an array of two numbers for range. */
  value?: number | number[];
  /** The default value. Use when the component is not controlled. */
  defaultValue?: number | number[];
  /** Minimum value. Defaults to 0. */
  min?: number;
  /** Maximum value. Defaults to 100. */
  max?: number;
  /** The granularity the slider can step through values. Defaults to 1. */
  step?: number;
  /** The component orientation. */
  orientation?: SliderOrientation;
  /** Callback fired when the value changes. */
  onChange?: (value: number | number[]) => void;
  /** If true, the component is disabled. */
  disabled?: boolean;
}
