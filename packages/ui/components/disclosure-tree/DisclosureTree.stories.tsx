import type { Meta, StoryObj } from '@storybook/react-vite';
import DisclosureTree, { DisclosureTreeItemProps } from './DisclosureTree';

const mockItems: DisclosureTreeItemProps[] = [
  {
    id: '1',
    parent_id: null,
    //children: ['1-1', '1-2'],
    item: ( <p>Item 1</p> )
  },
  {
    id: '1-1',
    parent_id: null,
    //children: [],
    item: ( <p>Item 2</p> )
  },
  {
    id: '1-2',
    parent_id: null,
    //children: [],
    item: ( <p>Item 3</p> )
  },
  {
    id: '2',
    parent_id: null,
    //children: [],
    item: ( <p>Item 4</p> ),
  },
];

/* const renderItem = (item: any, isBranch: boolean, expanded: boolean) => {
  return (
        <div 
            style={{ 
                padding: '6px 12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                width: '100%', 
                background: '#fafafa', 
                border: '1px solid #f0f0f0', 
                borderRadius: '6px',
                fontSize: '14px',
                color: item.item.active ? '#1890ff' : 'rgba(0,0,0,0.85)',
                fontWeight: item.item.active ? 'bold' : 'normal',
                cursor: 'pointer'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{item.item.text}</span>
            </div>
            {isBranch && (
                <span style={{ fontSize: '10px', padding: '2px 6px', background: expanded ? '#e6f7ff' : '#f5f5f5', color: expanded ? '#1890ff' : '#999', borderRadius: '10px' }}>
                    {expanded ? 'Expanded' : 'Collapsed'}
                </span>
            )}
        </div>
    );
}; */

const meta = {
    title: 'Components/DisclosureTree',
    component: DisclosureTree,
    parameters: {
        layout: 'padded',
    },
    argTypes: {
        allowMultipleExpanded: { control: 'boolean' },
        nested: { 
            control: 'boolean',
            description: 'When true, items with children are rendered as expandable branches. When false, all items render flat.',
        },
        collapseOnBlur: { control: 'boolean' },
    },
    args: {
        id: 'story-tree',
        items: mockItems,
        allowMultipleExpanded: true,
        nested: true,
        collapseOnBlur: false,
    },
} satisfies Meta<typeof DisclosureTree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

