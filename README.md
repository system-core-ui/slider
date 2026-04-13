# @thanh-libs/slider

A slider component for choosing a value from a range, with support for single and dual thumbs.

## Installation

```sh
npm install @thanh-libs/slider
# or
yarn add @thanh-libs/slider
```

## API Reference

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number \| number[]` | - | Controlled slider value (single or range) |
| `defaultValue` | `number \| number[]` | - | Uncontrolled slider value |
| `min` | `number` | `0` | Minimum allowed value |
| `max` | `number` | `100` | Maximum allowed value |
| `step` | `number` | `1` | Granularity of the slider |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Slider orientation |
| `disabled` | `boolean` | `false` | Whether the slider is interactable |
| `onChange` | `(val: number \| number[]) => void` | - | Callback on value change |

## Usage

```tsx
import { useState } from 'react';
import { Slider } from '@thanh-libs/slider';

export const Example = () => {
  const [val, setVal] = useState<number | number[]>([20, 50]);
  return (
    <Slider value={val} onChange={setVal} max={100} />
  );
};
```
