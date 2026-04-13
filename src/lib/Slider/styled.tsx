import type { CSSObject } from '@emotion/react';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { ThemeSchema } from '@thanh-libs/theme';
import type { SliderOrientation } from '../models';

export interface SliderOwnerState {
  ownerOrientation?: SliderOrientation;
  ownerDisabled?: boolean;
}

export const SliderRootStyled = styled.div<SliderOwnerState>(
  ({ ownerOrientation = 'horizontal', ownerDisabled }): CSSObject => {
    const { palette }: ThemeSchema = useTheme();

    return {
      position: 'relative',
      width: ownerOrientation === 'horizontal' ? '100%' : '12px',
      height: ownerOrientation === 'horizontal' ? '12px' : '100%',
      padding: ownerOrientation === 'horizontal' ? '10px 0' : '0 10px',
      display: 'inline-block',
      cursor: ownerDisabled ? 'not-allowed' : 'pointer',
      opacity: ownerDisabled ? 0.5 : 1,
      touchAction: 'none',
      userSelect: 'none',
      WebkitTapHighlightColor: 'transparent',
    };
  }
);

export const SliderRailStyled = styled.div<SliderOwnerState>(
  ({ ownerOrientation = 'horizontal' }): CSSObject => {
    const { palette, shape }: ThemeSchema = useTheme();
    return {
      position: 'absolute',
      backgroundColor: palette?.action?.disabledBackground || '#bdbdbd',
      borderRadius: shape?.borderRadius || '4px',
      width: ownerOrientation === 'horizontal' ? '100%' : '4px',
      height: ownerOrientation === 'horizontal' ? '4px' : '100%',
      top: ownerOrientation === 'horizontal' ? '50%' : 0,
      left: ownerOrientation === 'horizontal' ? 0 : '50%',
      transform: ownerOrientation === 'horizontal' ? 'translateY(-50%)' : 'translateX(-50%)',
    };
  }
);

export const SliderTrackStyled = styled.div<SliderOwnerState>(
  ({ ownerOrientation = 'horizontal' }): CSSObject => {
    const { palette, shape }: ThemeSchema = useTheme();
    return {
      position: 'absolute',
      backgroundColor: palette?.primary?.main || '#1976d2',
      borderRadius: shape?.borderRadius || '4px',
      height: ownerOrientation === 'horizontal' ? '4px' : undefined,
      width: ownerOrientation === 'horizontal' ? undefined : '4px',
      top: ownerOrientation === 'horizontal' ? '50%' : undefined,
      left: ownerOrientation === 'horizontal' ? undefined : '50%',
      transform: ownerOrientation === 'horizontal' ? 'translateY(-50%)' : 'translateX(-50%)',
    };
  }
);

export interface SliderThumbOwnerState extends SliderOwnerState {
  ownerActive?: boolean;
}

export const SliderThumbStyled = styled.div<SliderThumbOwnerState>(
  ({ ownerOrientation = 'horizontal', ownerActive, ownerDisabled }): CSSObject => {
    const { palette, shape }: ThemeSchema = useTheme();
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
      transform: 'translate(-50%, -50%)',
      transition: ownerActive ? 'none' : 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      outline: 0,
      '&:hover': {
        boxShadow: ownerDisabled ? 'none' : `0px 0px 0px 8px ${palette?.primary?.light || 'rgba(25, 118, 210, 0.16)'}`,
      },
      ...(ownerActive && !ownerDisabled && {
        boxShadow: `0px 0px 0px 14px ${palette?.primary?.light || 'rgba(25, 118, 210, 0.16)'}`,
      }),
      '&:focus-visible': {
        boxShadow: `0px 0px 0px 14px ${palette?.primary?.light || 'rgba(25, 118, 210, 0.16)'}`,
      }
    };
  }
);
