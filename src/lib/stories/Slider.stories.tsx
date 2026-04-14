import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Slider } from '../Slider/Slider';
import { SliderRange } from '../Slider/SliderRange';
import { ThemeProvider } from '@thanh-libs/theme';

// ─── Basic ───────────────────────────────────────────────

const BasicStory = () => (
  <Slider defaultValue={30} />
);

// ─── Range ───────────────────────────────────────────────

const RangeStory = () => (
  <SliderRange defaultValue={[20, 50]} />
);

// ─── Disabled ────────────────────────────────────────────

const DisabledStory = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <div>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Single disabled</div>
      <Slider defaultValue={40} disabled />
    </div>
    <div>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Range disabled</div>
      <SliderRange defaultValue={[20, 60]} disabled />
    </div>
  </div>
);

// ─── Vertical ────────────────────────────────────────────

const VerticalStory = () => (
  <div style={{ display: 'flex', gap: 48 }}>
    <div style={{ height: 200 }}>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Single</div>
      <Slider defaultValue={50} orientation="vertical" />
    </div>
    <div style={{ height: 200 }}>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Range</div>
      <SliderRange defaultValue={[10, 80]} orientation="vertical" />
    </div>
  </div>
);

// ─── Controlled ──────────────────────────────────────────

const ControlledStory = () => {
  const [value, setValue] = useState<number>(50);
  const [rangeValue, setRangeValue] = useState<[number, number]>([20, 80]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Single Controlled</div>
        <Slider value={value} onChange={setValue} />
        <div style={{ marginTop: 8, fontSize: 13, color: '#666' }}>Value: {JSON.stringify(value)}</div>
      </div>
      <div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Range Controlled</div>
        <SliderRange value={rangeValue} onChange={setRangeValue} />
        <div style={{ marginTop: 8, fontSize: 13, color: '#666' }}>Value: {JSON.stringify(rangeValue)}</div>
      </div>
    </div>
  );
};

// ─── Custom Step ─────────────────────────────────────────

const CustomStepStory = () => {
  const [val1, setVal1] = useState<number>(20);
  const [val2, setVal2] = useState<number>(50);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Step = 10 → Value: {JSON.stringify(val1)}</div>
        <Slider defaultValue={20} step={10} value={val1} onChange={setVal1} />
      </div>
      <div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Step = 25 → Value: {JSON.stringify(val2)}</div>
        <Slider defaultValue={50} step={25} value={val2} onChange={setVal2} />
      </div>
    </div>
  );
};

// ─── Custom Min/Max ──────────────────────────────────────

const CustomRangeStory = () => {
  const [temp, setTemp] = useState<number>(22);
  const [year, setYear] = useState<number>(2020);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
          Temperature: {JSON.stringify(temp)}°C (min=-10, max=40)
        </div>
        <Slider min={-10} max={40} step={1} value={temp} onChange={setTemp} />
      </div>
      <div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
          Year: {JSON.stringify(year)} (min=2000, max=2030, step=1)
        </div>
        <Slider min={2000} max={2030} step={1} value={year} onChange={setYear} />
      </div>
    </div>
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
export const CustomStep: StoryObj = { name: 'Custom Step', render: () => <CustomStepStory /> };
export const CustomRange: StoryObj = { name: 'Custom Min/Max', render: () => <CustomRangeStory /> };

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
