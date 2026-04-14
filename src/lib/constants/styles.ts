import type { CSSObject } from '@emotion/react';

import type { SliderOrientation } from '../models';

export const AXIS_THICKNESS = '4px';

export const AXIS_STYLES: Record<SliderOrientation, CSSObject> = {
  horizontal: {
    height: AXIS_THICKNESS,
    top: 0,
    bottom: 0,
    margin: 'auto 0',
  },
  vertical: {
    width: AXIS_THICKNESS,
    left: 0,
    right: 0,
    margin: '0 auto',
  },
};

export const ROOT_STYLES: Record<SliderOrientation, CSSObject> = {
  horizontal: { width: '100%', height: '12px', padding: '12px 0' },
  vertical: { width: '12px', height: '100%', padding: '0 12px' },
};
