import { cancelEvent } from '@thanh-libs/utils';

import { KEY_ACTIONS } from '../constants';


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
    cancelEvent(e);
    const newValue = action({ val: currentValue, step, min, max });

    if (newValue !== currentValue) onValueChange(newValue);
  };
}
