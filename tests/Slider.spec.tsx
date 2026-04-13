import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ThemeProvider } from '@thanh-libs/theme';
import { Slider } from '../src/lib/Slider/Slider';

expect.extend(toHaveNoViolations);

describe('Slider', () => {
  it('renders correctly with default value', () => {
    render(
      <ThemeProvider>
        <Slider defaultValue={50} />
      </ThemeProvider>
    );
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '50');
  });

  it('renders range correctly with two thumbs', () => {
    render(
      <ThemeProvider>
        <Slider defaultValue={[20, 80]} />
      </ThemeProvider>
    );
    const thumbs = screen.getAllByRole('slider');
    expect(thumbs).toHaveLength(2);
    expect(thumbs[0]).toHaveAttribute('aria-valuenow', '20');
    expect(thumbs[1]).toHaveAttribute('aria-valuenow', '80');
  });

  it('renders disabled state correctly', () => {
    const { container } = render(
      <ThemeProvider>
        <Slider defaultValue={50} disabled />
      </ThemeProvider>
    );
    expect(screen.getByRole('slider')).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders vertical orientation', () => {
    const { container } = render(
      <ThemeProvider>
        <Slider defaultValue={50} orientation="vertical" />
      </ThemeProvider>
    );
    // Vertical slider should render
    // Vertical slider should render
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    render(
      <ThemeProvider>
        <Slider defaultValue={50} min={0} max={100} step={10} />
      </ThemeProvider>
    );
    const thumb = screen.getByRole('slider');
    expect(thumb).toHaveAttribute('aria-valuenow', '50');

    fireEvent.keyDown(thumb, { key: 'ArrowRight' });
    expect(thumb).toHaveAttribute('aria-valuenow', '60');

    fireEvent.keyDown(thumb, { key: 'ArrowLeft' });
    expect(thumb).toHaveAttribute('aria-valuenow', '50');

    fireEvent.keyDown(thumb, { key: 'Home' });
    expect(thumb).toHaveAttribute('aria-valuenow', '0');

    fireEvent.keyDown(thumb, { key: 'End' });
    expect(thumb).toHaveAttribute('aria-valuenow', '100');
  });

  it('handles keyboard navigation for range (dual thumb)', () => {
    render(
      <ThemeProvider>
        <Slider defaultValue={[20, 80]} min={0} max={100} step={5} />
      </ThemeProvider>
    );
    const thumbs = screen.getAllByRole('slider');
    
    // Move second thumb left
    fireEvent.keyDown(thumbs[1], { key: 'ArrowLeft' });
    expect(thumbs[1]).toHaveAttribute('aria-valuenow', '75');

    // Move first thumb right
    fireEvent.keyDown(thumbs[0], { key: 'ArrowRight' });
    expect(thumbs[0]).toHaveAttribute('aria-valuenow', '25');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ThemeProvider>
        <Slider defaultValue={30} aria-label="Volume" />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
