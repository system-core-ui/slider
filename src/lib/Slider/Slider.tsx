import React, { forwardRef, useCallback, useRef, useState } from 'react';

import { clamp } from '../helpers';
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
      [min, max, step, orientation],
    );

    const handlePointerDown = (e: React.PointerEvent) => {
      if (disabled) return;
      e.preventDefault();
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

    const getPercent = (val: number) => ((val - min) / (max - min)) * 100;

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled || value === undefined) return;

      const currentValue = value;
      let newValue = currentValue;

      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        newValue = clamp(currentValue - step, min, max);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        newValue = clamp(currentValue + step, min, max);
      } else if (e.key === 'Home') {
        e.preventDefault();
        newValue = min;
      } else if (e.key === 'End') {
        e.preventDefault();
        newValue = max;
      }

      if (newValue !== currentValue) {
        handleValueChange(newValue);
      }
    };

    const renderThumb = (val: number) => {
      const percent = getPercent(val);
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

    const p = getPercent(value as number);
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
