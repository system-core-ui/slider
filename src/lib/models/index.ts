import type { HTMLAttributes } from 'react';

export type SliderOrientation = 'horizontal' | 'vertical';

export interface SliderBaseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Minimum value. Defaults to 0. */
  min?: number;
  /** Maximum value. Defaults to 100. */
  max?: number;
  /** The granularity the slider can step through values. Defaults to 1. */
  step?: number;
  /** The component orientation. */
  orientation?: SliderOrientation;
  /** If true, the component is disabled. */
  disabled?: boolean;
}

export interface SliderProps extends SliderBaseProps {
  /** The current value of the slider. */
  value?: number;
  /** The default value. Use when the component is not controlled. */
  defaultValue?: number;
  /** Callback fired when the value changes. */
  onChange?: (value: number) => void;
}

export interface SliderRangeProps extends SliderBaseProps {
  /** The current value of the slider range. */
  value?: [number, number];
  /** The default value. Use when the component is not controlled. */
  defaultValue?: [number, number];
  /** Callback fired when the value changes. */
  onChange?: (value: [number, number]) => void;
}
