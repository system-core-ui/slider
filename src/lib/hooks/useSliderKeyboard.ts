import { clamp } from '../helpers';

const KEY_ACTIONS: Record<
  string,
  (val: number, step: number, min: number, max: number) => number
> = {
  ArrowLeft: (v, s, min, max) => clamp(v - s, min, max),
  ArrowDown: (v, s, min, max) => clamp(v - s, min, max),
  ArrowRight: (v, s, min, max) => clamp(v + s, min, max),
  ArrowUp: (v, s, min, max) => clamp(v + s, min, max),
  Home: (_, __, min, ___) => min,
  End: (_, __, ___, max) => max,
};

interface UseSliderKeyboardOptions {
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
}

export function useSliderKeyboard({
  min,
  max,
  step,
  disabled,
}: UseSliderKeyboardOptions) {
  return (
    e: React.KeyboardEvent,
    currentValue: number,
    onValueChange: (newValue: number) => void
  ) => {
    if (disabled) return;

    const action = KEY_ACTIONS[e.key];
    if (action) {
      e.preventDefault();
      const newValue = action(currentValue, step, min, max);

      if (newValue !== currentValue) {
        onValueChange(newValue);
      }
    }
  };
}
