import { render } from '@testing-library/react';

import ThanhLibsSlider from './slider';

describe('ThanhLibsSlider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ThanhLibsSlider />);
    expect(baseElement).toBeTruthy();
  });
});
