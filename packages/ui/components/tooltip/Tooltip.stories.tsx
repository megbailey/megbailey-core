import type { Meta, StoryObj } from '@storybook/react-vite';
import Tooltip from './Tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
    type: {
      control: 'select',
      options: ['icon', 'wrapper'],
    },
    iconName: { control: 'text' },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    theme: {
      control: 'select',
      options: ['dark', 'light'],
    },
    arrow: { control: 'boolean' },
    showTip: { control: 'boolean' },
  },
  args: {
    text: 'This is a tooltip message!',
    type: 'icon',
    iconName: 'info-circle',
    position: 'top',
    theme: 'dark',
    arrow: true,
    showTip: true,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IconType: Story = {};

export const WrapperType: Story = {
  args: {
    type: 'wrapper',
    children: <span style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>Hover over me</span>,
    text: 'Tooltip content over custom wrapper element!',
    showTip: false,
  },
};
