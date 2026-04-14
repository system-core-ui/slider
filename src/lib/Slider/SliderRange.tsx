import React, { forwardRef, useCallback, useRef, useState } from 'react';

import { clamp } from '../helpers';
import type { SliderRangeProps } from '../models';

import {
  SliderRailStyled,
  SliderRootStyled,
  SliderThumbStyled,
  SliderTrackStyled,
} from './styled';

export const SliderRange = forwardRef<HTMLDivElement, SliderRangeProps>(
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
    const [internalValue, setInternalValue] = useState<[number, number]>(
      defaultValue !== undefined ? defaultValue : valueProp !== undefined ? valueProp : [min, max]
    );

    const value = isControlled ? valueProp : internalValue;

    const [activeThumb, setActiveThumb] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleValueChange = useCallback(
      (newValue: [number, number]) => {
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
      if (disabled || !value) return;
      e.preventDefault();
      if (containerRef.current && e.pointerId !== undefined) {
        containerRef.current.setPointerCapture(e.pointerId);
      }

      const pointerValue = getValueFromPointer(e);
      const [val0, val1] = value;
      const dist0 = Math.abs(val0 - pointerValue);
      const dist1 = Math.abs(val1 - pointerValue);

      let activeIdx = 0;
      if (dist0 > dist1 || (dist0 === dist1 && pointerValue > val1)) {
        activeIdx = 1;
      }

      setActiveThumb(activeIdx);
      const newValue: [number, number] = [...value] as [number, number];
      newValue[activeIdx] = pointerValue;
      handleValueChange(newValue);
      thumbRefs.current[activeIdx]?.focus();
    };

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (disabled || activeThumb === null || !value) return;

        const pointerValue = getValueFromPointer(e);
        const newValue: [number, number] = [...value] as [number, number];
        
        let currentActive = activeThumb;

        if (newValue[0] === newValue[1]) {
          if (currentActive === 0 && pointerValue > newValue[1]) {
            currentActive = 1;
            setActiveThumb(1);
          } else if (currentActive === 1 && pointerValue < newValue[0]) {
            currentActive = 0;
            setActiveThumb(0);
          }
        }

        if (currentActive === 0) {
          newValue[0] = clamp(pointerValue, min, newValue[1]);
        } else {
          newValue[1] = clamp(pointerValue, newValue[0], max);
        }
        
        handleValueChange(newValue);
      },
      [disabled, activeThumb, getValueFromPointer, value, min, max, handleValueChange],
    );

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
      setActiveThumb(null);
      if (containerRef.current && e.pointerId !== undefined) {
        containerRef.current.releasePointerCapture(e.pointerId);
      }
    }, []);

    const getPercent = (val: number) => ((val - min) / (max - min)) * 100;

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
      if (disabled || !value) return;

      const currentValue = value[index];
      let newValueStr = currentValue;

      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        newValueStr = clamp(currentValue - step, min, max);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        newValueStr = clamp(currentValue + step, min, max);
      } else if (e.key === 'Home') {
        e.preventDefault();
        newValueStr = min;
      } else if (e.key === 'End') {
        e.preventDefault();
        newValueStr = max;
      }

      if (newValueStr !== currentValue) {
        const newArray: [number, number] = [...value] as [number, number];
        newArray[index] = newValueStr;
        if (newArray[0] > newArray[1]) {
          newArray[index] = index === 0 ? newArray[1] : newArray[0];
        }
        handleValueChange(newArray);
      }
    };

    const renderThumb = (val: number, index: number) => {
      const percent = getPercent(val);
      const style =
        orientation === 'horizontal'
          ? { left: `${percent}%` }
          : { bottom: `${percent}%` };

      return (
        <SliderThumbStyled
          key={index}
          ref={(node) => {
            thumbRefs.current[index] = node;
          }}
          ownerOrientation={orientation}
          ownerActive={activeThumb === index}
          ownerDisabled={disabled}
          style={style}
          role="slider"
          aria-orientation={orientation}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={val}
          aria-label={ariaLabel ? `${ariaLabel} ${index === 0 ? 'min' : 'max'}` : undefined}
          aria-labelledby={ariaLabelledby}
          aria-valuetext={ariaValuetext}
          aria-disabled={disabled}
          tabIndex={disabled ? undefined : 0}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      );
    };

    let trackStyle = {};
    if (value) {
      const [val0, val1] = value;
      const p0 = getPercent(val0);
      const p1 = getPercent(val1);
      if (orientation === 'horizontal') {
        trackStyle = { left: `${p0}%`, width: `${p1 - p0}%` };
      } else {
        trackStyle = { bottom: `${p0}%`, height: `${p1 - p0}%` };
      }
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
        {value && (
          <>
            {renderThumb(value[0], 0)}
            {renderThumb(value[1], 1)}
          </>
        )}
      </SliderRootStyled>
    );
  },
);

SliderRange.displayName = 'SliderRange';
