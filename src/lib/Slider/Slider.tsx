import React, { forwardRef, useCallback, useRef, useState } from 'react';

import { cancelEvent } from '@thanh-libs/utils';

import { clamp, getPercent } from '../helpers';
import { useSliderKeyboard, useSliderPointerValue } from '../hooks';
import type { SliderProps } from '../models';

import {
  SliderRailStyled,
  SliderRootStyled,
  SliderThumbStyled,
  SliderTrackStyled,
} from './styled';

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      value: valueProp,
      defaultValue,
      min = 0,
      max = 100,
      step = 1,
      orientation = 'horizontal',
      onChange,
      disabled = false,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-valuetext': ariaValuetext,
      ...rest
    },
    ref,
  ) => {
    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = useState<number>(
      defaultValue !== undefined ? defaultValue : valueProp !== undefined ? valueProp : min
    );

    const value = isControlled ? valueProp : internalValue;

    const [activeThumb, setActiveThumb] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const thumbRef = useRef<HTMLDivElement | null>(null);

    const handleValueChange = useCallback(
      (newValue: number) => {
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(newValue);
      },
      [isControlled, onChange],
    );

    const { getValueFromPointer } = useSliderPointerValue({
      containerRef,
      min,
      max,
      step,
      orientation,
    });

    const handlePointerDown = (e: React.PointerEvent) => {
      if (disabled) return;
      cancelEvent(e);
      if (containerRef.current && e.pointerId !== undefined) {
        containerRef.current.setPointerCapture(e.pointerId);
      }

      const pointerValue = getValueFromPointer(e);

      setActiveThumb(0);
      handleValueChange(pointerValue);
      thumbRef.current?.focus();
    };

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (disabled || activeThumb === null) return;
        const pointerValue = getValueFromPointer(e);
        handleValueChange(pointerValue);
      },
      [disabled, activeThumb, getValueFromPointer, handleValueChange],
    );

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
      setActiveThumb(null);
      if (containerRef.current && e.pointerId !== undefined) {
        containerRef.current.releasePointerCapture(e.pointerId);
      }
    }, []);

    const handleKeyDownHelper = useSliderKeyboard({ min, max, step, disabled });

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (value === undefined) return;
      handleKeyDownHelper(e, value, handleValueChange);
    };

    const renderThumb = (val: number) => {
      const percent = getPercent({ val, min, max });
      const style =
        orientation === 'horizontal'
          ? { left: `${percent}%` }
          : { bottom: `${percent}%` };

      return (
        <SliderThumbStyled
          ref={thumbRef}
          ownerOrientation={orientation}
          ownerActive={activeThumb === 0}
          ownerDisabled={disabled}
          style={style}
          role="slider"
          aria-orientation={orientation}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={val}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-valuetext={ariaValuetext}
          aria-disabled={disabled}
          tabIndex={disabled ? undefined : 0}
          onKeyDown={handleKeyDown}
        />
      );
    };

    const p = getPercent({ val: value as number, min, max });
    let trackStyle = {};
    if (orientation === 'horizontal') {
      trackStyle = { left: '0%', width: `${p}%` };
    } else {
      trackStyle = { bottom: '0%', height: `${p}%` };
    }

    return (
      <SliderRootStyled
        ref={(node) => {
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
          containerRef.current = node;
        }}
        ownerOrientation={orientation}
        ownerDisabled={disabled}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        {...rest}
      >
        <SliderRailStyled ownerOrientation={orientation} />
        <SliderTrackStyled ownerOrientation={orientation} style={trackStyle} />
        {value !== undefined && renderThumb(value)}
      </SliderRootStyled>
    );
  },
);

Slider.displayName = 'Slider';
