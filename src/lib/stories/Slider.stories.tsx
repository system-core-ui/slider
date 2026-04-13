import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Slider } from '../Slider/Slider';
import { ThemeProvider } from '@thanh-libs/theme';

// ─── Basic ───────────────────────────────────────────────

const BasicStory = () => (
  <Slider defaultValue={30} />
);

// ─── Range ───────────────────────────────────────────────

const RangeStory = () => (
  <Slider defaultValue={[20, 50]} />
);

// ─── Disabled ────────────────────────────────────────────

const DisabledStory = () => (
  <Slider defaultValue={40} disabled />
);

// ─── Vertical ────────────────────────────────────────────

const VerticalStory = () => (
  <div style={{ height: 200 }}>
    <Slider defaultValue={[10, 80]} orientation="vertical" />
  </div>
);

// ─── Controlled ──────────────────────────────────────────

const ControlledStory = () => {
  const [value, setValue] = useState<number | number[]>(50);
  return (
    <>
      <Slider value={value} onChange={setValue} />
      <div style={{ marginTop: 20 }}>Value: {JSON.stringify(value)}</div>
    </>
  );
};

// ─── Playground ──────────────────────────────────────────

const PlaygroundStory = (args: any) => (
  <div style={args.orientation === 'vertical' ? { height: 200 } : {}}>
    <Slider {...args} />
  </div>
);

// ─── Meta & Exports ──────────────────────────────────────

const meta: Meta = {
  title: 'Slider/Slider',
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
export const Range: StoryObj = { name: 'Range', render: () => <RangeStory /> };
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
    defaultValue: 50,
  },
  render: (args: any) => <PlaygroundStory {...args} />,
};
