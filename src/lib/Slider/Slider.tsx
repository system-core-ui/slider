import React, { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import type { SliderProps } from '../models';
import { SliderRootStyled, SliderRailStyled, SliderTrackStyled, SliderThumbStyled } from './styled';

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

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
    ref
  ) => {
    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = useState<number | number[]>(
      defaultValue !== undefined ? defaultValue : (valueProp !== undefined ? valueProp : min)
    );

    const value = isControlled ? (valueProp as number | number[]) : internalValue;
    const isRange = Array.isArray(value);
    
    const [activeThumb, setActiveThumb] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleValueChange = useCallback((newValue: number | number[]) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    }, [isControlled, onChange]);

    const getValueFromPointer = useCallback((e: PointerEvent | React.PointerEvent) => {
      if (!containerRef.current) return min;
      const rect = containerRef.current.getBoundingClientRect();
      let percent = 0;

      const clientX = (e as any).clientX || 0;
      const clientY = (e as any).clientY || 0;

      if (orientation === 'horizontal') {
        percent = (clientX - rect.left) / (rect.width || 1);
      } else {
        percent = (rect.bottom - clientY) / (rect.height || 1);
      }

      const exactValue = percent * (max - min) + min;
      const steppedValue = Math.round((exactValue - min) / step) * step + min;
      return clamp(steppedValue, min, max);
    }, [min, max, step, orientation]);

    const handlePointerDown = (e: React.PointerEvent) => {
      if (disabled) return;
      e.preventDefault();
      containerRef.current?.focus();

      const pointerValue = getValueFromPointer(e);

      if (isRange) {
        const [val0, val1] = value as number[];
        const dist0 = Math.abs(val0 - pointerValue);
        const dist1 = Math.abs(val1 - pointerValue);
        
        let activeIdx = 0;
        if (dist0 > dist1 || (dist0 === dist1 && pointerValue > val1)) {
          activeIdx = 1;
        }

        setActiveThumb(activeIdx);
        const newValue = [...(value as number[])];
        newValue[activeIdx] = pointerValue;
        if (newValue[0] > newValue[1]) {
          // swap logic if needed, but standard slider might just push
        }
        handleValueChange(newValue);
      } else {
        setActiveThumb(0);
        handleValueChange(pointerValue);
      }
    };

    const handlePointerMove = useCallback((e: PointerEvent) => {
      if (disabled || activeThumb === null) return;
      
      const pointerValue = getValueFromPointer(e);

      if (isRange) {
        const newValue = [...(value as number[])];
        newValue[activeThumb] = pointerValue;
        
        if (activeThumb === 0) {
          newValue[0] = clamp(pointerValue, min, newValue[1]);
        } else {
          newValue[1] = clamp(pointerValue, newValue[0], max);
        }
        handleValueChange(newValue);
      } else {
        handleValueChange(pointerValue);
      }
    }, [disabled, activeThumb, getValueFromPointer, isRange, value, min, max, handleValueChange]);

    const handlePointerUp = useCallback(() => {
      setActiveThumb(null);
    }, []);

    useEffect(() => {
      if (activeThumb !== null) {
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        return () => {
          window.removeEventListener('pointermove', handlePointerMove);
          window.removeEventListener('pointerup', handlePointerUp);
        };
      }
    }, [activeThumb, handlePointerMove, handlePointerUp]);

    const getPercent = (val: number) => ((val - min) / (max - min)) * 100;

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
      if (disabled) return;

      const currentValue = isRange ? (value as number[])[index] : (value as number);
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
        if (isRange) {
          const newArray = [...(value as number[])];
          newArray[index] = newValue;
          if (newArray[0] > newArray[1]) {
             // Handle collision logic
             newArray[index] = index === 0 ? newArray[1] : newArray[0];
          }
          handleValueChange(newArray);
        } else {
          handleValueChange(newValue);
        }
      }
    };

    const renderThumb = (val: number, index: number) => {
      const percent = getPercent(val);
      const style = orientation === 'horizontal' ? { left: `${percent}%` } : { bottom: `${percent}%` };
      
      return (
        <SliderThumbStyled
          key={index}
          ownerOrientation={orientation}
          ownerActive={activeThumb === index}
          ownerDisabled={disabled}
          style={style}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={val}
          aria-label={ariaLabel ? (isRange ? `${ariaLabel} ${index === 0 ? 'min' : 'max'}` : ariaLabel) : undefined}
          aria-labelledby={ariaLabelledby}
          aria-valuetext={ariaValuetext}
          aria-disabled={disabled}
          tabIndex={disabled ? undefined : 0}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      );
    };

    let trackStyle = {};
    if (isRange) {
      const [val0, val1] = value as number[];
      const p0 = getPercent(val0);
      const p1 = getPercent(val1);
      if (orientation === 'horizontal') {
        trackStyle = { left: `${p0}%`, width: `${p1 - p0}%` };
      } else {
        trackStyle = { bottom: `${p0}%`, height: `${p1 - p0}%` };
      }
    } else {
      const p = getPercent(value as number);
      if (orientation === 'horizontal') {
        trackStyle = { left: '0%', width: `${p}%` };
      } else {
        trackStyle = { bottom: '0%', height: `${p}%` };
      }
    }

    return (
      <SliderRootStyled
        ref={(node) => {
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
          // @ts-ignore
          containerRef.current = node;
        }}
        ownerOrientation={orientation}
        ownerDisabled={disabled}
        onPointerDown={handlePointerDown}
        {...rest}
      >
        <SliderRailStyled ownerOrientation={orientation} />
        <SliderTrackStyled ownerOrientation={orientation} style={trackStyle} />
        {isRange ? (
          <>
            {renderThumb((value as number[])[0], 0)}
            {renderThumb((value as number[])[1], 1)}
          </>
        ) : (
          renderThumb(value as number, 0)
        )}
      </SliderRootStyled>
    );
  }
);

Slider.displayName = 'Slider';
