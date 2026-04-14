import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SliderRange } from '../Slider/SliderRange';
import { ThemeProvider } from '@thanh-libs/theme';

// ─── Basic ───────────────────────────────────────────────

const BasicStory = () => (
  <SliderRange defaultValue={[20, 50]} />
);

// ─── Disabled ────────────────────────────────────────────

const DisabledStory = () => (
  <SliderRange defaultValue={[20, 60]} disabled />
);

// ─── Vertical ────────────────────────────────────────────

const VerticalStory = () => (
  <div style={{ height: 200 }}>
    <SliderRange defaultValue={[10, 80]} orientation="vertical" />
  </div>
);

// ─── Controlled ──────────────────────────────────────────

const ControlledStory = () => {
  const [rangeValue, setRangeValue] = useState<[number, number]>([20, 80]);
  return (
    <div>
      <SliderRange value={rangeValue} onChange={setRangeValue} />
      <div style={{ marginTop: 8, fontSize: 13, color: '#666' }}>Value: {JSON.stringify(rangeValue)}</div>
    </div>
  );
};

// ─── Playground ──────────────────────────────────────────

const PlaygroundStory = (args: any) => (
  <div style={args.orientation === 'vertical' ? { height: 200 } : {}}>
    <SliderRange {...args} />
  </div>
);

// ─── Meta & Exports ──────────────────────────────────────

const meta: Meta = {
  title: 'Slider/SliderRange',
  component: SliderRange,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ padding: 40, width: 300 }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default meta;

export const Basic: StoryObj = { name: 'Basic', render: () => <BasicStory /> };
export const Disabled: StoryObj = { name: 'Disabled', render: () => <DisabledStory /> };
export const Vertical: StoryObj = { name: 'Vertical', render: () => <VerticalStory /> };
export const Controlled: StoryObj = { name: 'Controlled', render: () => <ControlledStory /> };

export const Playground: StoryObj = {
  name: 'Playground',
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    orientation: 'horizontal',
    defaultValue: [20, 80],
  },
  render: (args: any) => <PlaygroundStory {...args} />,
};
