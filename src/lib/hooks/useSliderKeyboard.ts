import { clamp } from '../helpers';
import type { SliderBaseProps } from '../models';

export type UseSliderKeyboardOptions = Required<Pick<SliderBaseProps, 'min' | 'max' | 'step'>> &
  Pick<SliderBaseProps, 'disabled'>;

export type SliderKeyboardActionOptions = Pick<UseSliderKeyboardOptions, 'min' | 'max' | 'step'> & {
  val: number;
};

const KEY_ACTIONS: Record<string, (options: SliderKeyboardActionOptions) => number> = {
  ArrowLeft: ({ val, step, min, max }) => clamp(val - step, min, max),
  ArrowDown: ({ val, step, min, max }) => clamp(val - step, min, max),
  ArrowRight: ({ val, step, min, max }) => clamp(val + step, min, max),
  ArrowUp: ({ val, step, min, max }) => clamp(val + step, min, max),
  Home: ({ min }) => min,
  End: ({ max }) => max,
};

export function useSliderKeyboard({ min, max, step, disabled }: UseSliderKeyboardOptions) {
  return (e: React.KeyboardEvent, currentValue: number, onValueChange: (newValue: number) => void) => {
    if (disabled) return;

    const action = KEY_ACTIONS[e.key];
    if (action) {
      e.preventDefault();
      const newValue = action({ val: currentValue, step, min, max });

      if (newValue !== currentValue) {
        onValueChange(newValue);
      }
    }
  };
}
