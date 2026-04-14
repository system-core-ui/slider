import type { CSSObject } from '@emotion/react';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { ThemeSchema } from '@thanh-libs/theme';
import { alpha } from '@thanh-libs/utils';

import type { SliderOrientation } from '../models';
import { AXIS_STYLES, AXIS_THICKNESS, ROOT_STYLES } from '../constants';

export interface SliderOwnerState {
  ownerOrientation?: SliderOrientation;
  ownerDisabled?: boolean;
}

export const SliderRootStyled = styled.div<SliderOwnerState>(
  ({ ownerOrientation = 'horizontal', ownerDisabled }): CSSObject => {
    return {
      position: 'relative',
      ...ROOT_STYLES[ownerOrientation],
      display: 'inline-block',
      cursor: ownerDisabled ? 'not-allowed' : 'pointer',
      opacity: ownerDisabled ? 0.5 : 1,
      touchAction: 'none',
      userSelect: 'none',
      WebkitTapHighlightColor: 'transparent',
    };
  },
);

export const SliderRailStyled = styled.div<SliderOwnerState>(
  ({ ownerOrientation = 'horizontal' }): CSSObject => {
    const { palette, shape }: ThemeSchema = useTheme();
    return {
      position: 'absolute',
      backgroundColor: palette?.action?.disabledBackground || '#bdbdbd',
      borderRadius: shape?.borderRadius || '4px',
      ...AXIS_STYLES[ownerOrientation],
      width: ownerOrientation === 'horizontal' ? '100%' : AXIS_THICKNESS,
      height: ownerOrientation === 'vertical' ? '100%' : AXIS_THICKNESS,
    };
  },
);

export const SliderTrackStyled = styled.div<SliderOwnerState>(
  ({ ownerOrientation = 'horizontal' }): CSSObject => {
    const { palette, shape }: ThemeSchema = useTheme();
    return {
      position: 'absolute',
      backgroundColor: palette?.primary?.main || '#1976d2',
      borderRadius: shape?.borderRadius || '4px',
      ...AXIS_STYLES[ownerOrientation],
    };
  },
);

export interface SliderThumbOwnerState extends SliderOwnerState {
  ownerActive?: boolean;
}

export const SliderThumbStyled = styled.div<SliderThumbOwnerState>(
  ({
    ownerOrientation = 'horizontal',
    ownerActive,
    ownerDisabled,
  }): CSSObject => {
    const { palette, shape }: ThemeSchema = useTheme();

    // Compute an extremely light transparent color for the hover ring
    const hoverBgColor = alpha(palette?.primary?.main || '#1976d2', 0.1);
    const activeBgColor = alpha(palette?.primary?.main || '#1976d2', 0.15);

    return {
      position: 'absolute',
      width: '20px',
      height: '20px',
      boxSizing: 'border-box',
      borderRadius: '50%',
      backgroundColor: palette?.primary?.main || '#1976d2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      top: ownerOrientation === 'horizontal' ? '50%' : undefined,
      left: ownerOrientation === 'horizontal' ? undefined : '50%',
      transform:
        ownerOrientation === 'horizontal'
          ? 'translate(-50%, -50%)'
          : 'translate(-50%, 50%)',
      transition: ownerActive
        ? 'none'
        : 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      outline: 0,
      '&:hover': {
        boxShadow: ownerDisabled ? 'none' : `0px 0px 0px 6px ${hoverBgColor}`,
      },
      ...(ownerActive &&
        !ownerDisabled && {
          boxShadow: `0px 0px 0px 9px ${activeBgColor}`,
        }),
      '&:focus-visible': {
        boxShadow: `0px 0px 0px 9px ${hoverBgColor}`,
      },
    };
  },
);
