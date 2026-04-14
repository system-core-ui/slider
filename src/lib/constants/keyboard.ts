import { clamp } from '../helpers';
import type { SliderKeyboardActionOptions } from '../models';

export const KEY_ACTIONS = {
  ArrowLeft: ({ val, step, min, max }: SliderKeyboardActionOptions) =>
    clamp({ val: val - step, min, max }),
  ArrowDown: ({ val, step, min, max }: SliderKeyboardActionOptions) =>
    clamp({ val: val - step, min, max }),
  ArrowRight: ({ val, step, min, max }: SliderKeyboardActionOptions) =>
    clamp({ val: val + step, min, max }),
  ArrowUp: ({ val, step, min, max }: SliderKeyboardActionOptions) =>
    clamp({ val: val + step, min, max }),
  Home: ({ min }: Pick<SliderKeyboardActionOptions, 'min'>) => min,
  End: ({ max }: Pick<SliderKeyboardActionOptions, 'max'>) => max,
};
