import { useCallback } from 'react';

import { clamp } from '../helpers';
import type { SliderOrientation } from '../models';

export interface UseSliderPointerValueOptions {
  containerRef: React.RefObject<HTMLElement | null>;
  min: number;
  max: number;
  step: number;
  orientation: SliderOrientation;
}

export function useSliderPointerValue({
  containerRef,
  min,
  max,
  step,
  orientation,
}: UseSliderPointerValueOptions) {
  const getValueFromPointer = useCallback(
    (e: PointerEvent | React.PointerEvent) => {
      if (!containerRef.current) return min;
      const rect = containerRef.current.getBoundingClientRect();
      let percent = 0;

      const clientX = e.clientX || 0;
      const clientY = e.clientY || 0;

      if (orientation === 'horizontal') {
        percent = (clientX - rect.left) / (rect.width || 1);
      } else {
        percent = (rect.bottom - clientY) / (rect.height || 1);
      }

      const exactValue = percent * (max - min) + min;
      const steppedValue = Math.round((exactValue - min) / step) * step + min;
      return clamp(steppedValue, min, max);
    },
    [containerRef, min, max, step, orientation],
  );

  return { getValueFromPointer };
}
