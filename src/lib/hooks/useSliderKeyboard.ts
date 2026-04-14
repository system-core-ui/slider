import { clamp } from '../helpers';

interface SliderKeyboardActionOptions {
  val: number;
  step: number;
  min: number;
  max: number;
}

const KEY_ACTIONS = {
  ArrowLeft: ({ val, step, min, max }: SliderKeyboardActionOptions) =>
    clamp(val - step, min, max),
  ArrowDown: ({ val, step, min, max }: SliderKeyboardActionOptions) =>
    clamp(val - step, min, max),
  ArrowRight: ({ val, step, min, max }: SliderKeyboardActionOptions) =>
    clamp(val + step, min, max),
  ArrowUp: ({ val, step, min, max }: SliderKeyboardActionOptions) =>
    clamp(val + step, min, max),
  Home: ({ min }: Pick<SliderKeyboardActionOptions, 'min'>) => min,
  End: ({ max }: Pick<SliderKeyboardActionOptions, 'max'>) => max,
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
    onValueChange: (newValue: number) => void,
  ) => {
    if (disabled) return;

    const action = KEY_ACTIONS?.[e.key as keyof typeof KEY_ACTIONS];
    if (!action) return;
    e.preventDefault();
    const newValue = action({ val: currentValue, step, min, max });

    if (newValue !== currentValue) onValueChange(newValue);
  };
}
