# @megbailey/ui

React component library with implemented [W3 design patterns](https://www.w3.org/WAI/ARIA/apg/patterns/), new form elements, GraphQL integrations, and hooks.

**Source:** [github.com/megbailey/megbailey-core/tree/main/packages/ui](https://github.com/megbailey/megbailey-core/tree/main/packages/ui)

## Install

```bash
npm install @megbailey/ui
```

`@megbailey/utils` is installed automatically as a runtime dependency.

### Peer dependencies

```bash
npm install react react-dom
```

Optional — install only for the components you use:

| Peer | Used by |
| --- | --- |
| `informed` | `InformedSelect`, `ButtonSelect`, `Dropzone`, `ToggleSwitch` |
| `react-select` | `InformedSelect`, `GraphQLSelect` |
| `@apollo/client` | `GraphQLSelect` |

```bash
npm install informed react-select
npm install @apollo/client
```

## Exports

Each export is available from the package entry point:

```tsx
import { Button, ToggleSwitch, useOnClickOutside } from "@megbailey/ui";
```

Some component CSS is bundled with the package, but it is not imported by the package by default.

---

### Button

**Summary** — Themed button or anchor link with optional leading icon, active state, and four color themes (`primary`, `secondary`, `danger`, `success`).

**Usage**

```tsx
import { Button } from "@megbailey/ui";

<Button theme="primary" size="medium" onClick={() => console.log("clicked")}>
  Save
</Button>

<Button href="/settings" theme="secondary" icon={{ name: "cog", size: "small" }}>
  Settings
</Button>
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `theme` | `"primary"` \| `"secondary"` \| `"danger"` \| `"success"` \| `string` | — | Visual style variant |
| `size` | `"small"` \| `"medium"` \| `"large"` \| `"normal"` \| `string` | — | Button size |
| `text` | `string` | — | Label text (alternative to `children`) |
| `href` | `string` | — | Renders as `<a>` when set |
| `target` | `string` | — | Link target (with `href`) |
| `icon` | `IconProps` | — | Optional leading icon |
| `active` | `boolean` | — | Applies active styling |
| `layout` | `string` | — | Layout modifier class |
| `onClick` | `MouseEventHandler` | — | Click handler |
| `onKeyDown` | `KeyboardEventHandler` | — | Keydown handler |
| `aria-expanded` | `boolean` | — | ARIA expanded state |
| `aria-controls` | `string` | — | ID of controlled element |
| `aria-current` | `boolean` \| `"page"` \| … | — | ARIA current state |
| `className` | `string` | — | Additional CSS class |
| `children` | `ReactNode` | — | Button content |

Also accepts standard `HTMLAttributes` for `<button>` / `<a>`.

**Types:** `ButtonProps`, `ButtonTheme`, `ButtonSize`, `ButtonIconProps`

---

### Icon

**Summary** — SVG icon wrapper keyed by `name`, with size (`micro`–`jumbo`) and style (`solid`, `regular`) variants.

**Usage**

```tsx
import { Icon } from "@megbailey/ui";

<Icon name="check-circle" size="normal" theme="solid" />
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | **Required.** Icon identifier |
| `size` | `"micro"` \| `"small"` \| `"normal"` \| `"large"` \| `"jumbo"` \| `string` | — | Icon dimensions |
| `theme` | `"solid"` \| `"regular"` \| `string` | — | Icon style variant |
| `color` | `string` | — | CSS color override |
| `className` | `string` | — | Additional CSS class |

**Types:** `IconProps`, `IconSize`, `IconTheme`

---

### Tooltip

**Summary** — Accessible tooltip in wrapper or standalone icon mode, with four positions, light/dark themes, and optional arrow.

**Usage**

```tsx
import { Tooltip } from "@megbailey/ui";

<Tooltip text="This field is required" position="top" theme="dark">
  <span>Hover me</span>
</Tooltip>

<Tooltip type="icon" text="Help text" iconName="info-circle" />
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | — | **Required.** Tooltip content |
| `type` | `"icon"` \| `"wrapper"` \| `string` | `"wrapper"` | Trigger mode |
| `position` | `"top"` \| `"bottom"` \| `"left"` \| `"right"` \| `string` | — | Tooltip placement |
| `theme` | `"dark"` \| `"light"` \| `string` | — | Color theme |
| `iconName` | `string` | — | Icon name when `type="icon"` |
| `arrow` | `boolean` | — | Show directional arrow |
| `showTip` | `boolean` | — | Control tip visibility |
| `className` | `string` | — | Additional CSS class |
| `children` | `ReactNode` | — | Wrapped trigger content |

**Types:** `TooltipProps`, `TooltipPosition`, `TooltipTheme`, `TooltipType`

---

### Paragraph

**Summary** — Lightweight typography wrapper for body text via `text` or `children`.

**Usage**

```tsx
import { Paragraph } from "@megbailey/ui";

<Paragraph text="A short description of this section." />
<Paragraph className="text-muted">Custom styled paragraph.</Paragraph>
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | — | Paragraph content |
| `className` | `string` | — | Additional CSS class |
| `children` | `ReactNode` | — | Alternative to `text` |

**Types:** `ParagraphProps`

---

### DisclosureTree

**Summary** — [Disclosure (Tree View)](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) tree with keyboard navigation, multi-expand or accordion behavior, and optional flat rendering.

**Usage**

```tsx
import { DisclosureTree } from "@megbailey/ui";

<DisclosureTree
  id="nav-tree"
  items={[
    {
      id: "1",
      parent_id: null,
      item: "Section A",
      items: [{ id: "1a", parent_id: "1", item: "Item 1" }],
    },
  ]}
  allowMultipleExpanded
  preExpandedIds={["1"]}
/>
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | — | **Required.** Root tree ID |
| `items` | `DisclosureTreeItemProps[]` | — | **Required.** Tree data |
| `allowMultipleExpanded` | `boolean` | — | Allow multiple open branches |
| `preExpandedIds` | `string[]` | — | Initially expanded node IDs |
| `collapseOnLoad` | `boolean` | — | Collapse all on mount |
| `collapseOnBlur` | `boolean` | — | Collapse when focus leaves tree |
| `nested` | `boolean` | `true` | `false` renders flat list without expansion |
| `onKeyEscape` | `(e: KeyboardEvent) => void` | — | Escape key handler |

**`DisclosureTreeItemProps`**

| Prop | Type | Description |
| --- | --- | --- |
| `id` | `string` | **Required.** Unique node ID |
| `parent_id` | `string` \| `null` | **Required.** Parent node ID |
| `item` | `ReactNode` | **Required.** Node label/content |
| `items` | `DisclosureTreeItemProps[]` | Child nodes |
| `active` | `boolean` | Active/selected state |

**Types:** `DisclosureTreeProps`, `DisclosureTreeItemProps`, `BranchProps`, `LeafProps`, `TreeNodeProps`

---

### ExpansionControls

**Summary** — Single expand/collapse toggle (plus/minus icon) with `aria-expanded` and `aria-controls`, built on `Button`.

**Usage**

```tsx
import { ExpansionControls } from "@megbailey/ui";

<ExpansionControls
  controlsId="panel-1"
  expanded={isExpanded}
  onClick={() => setIsExpanded((prev) => !prev)}
/>
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `controlsId` | `string` | — | **Required.** ID of controlled panel |
| `expanded` | `boolean` | — | **Required.** Current expanded state |
| `onClick` | `() => void` | — | **Required.** Toggle handler |
| `active` | `boolean` | — | Active styling |
| `onKeyDown` | `(e: KeyboardEvent) => void` | — | Keyboard handler |

**Types:** `ExpansionControlsProps`

---

### ButtonSelect

**Summary** — Segmented button group for single or multi-select from plain values or `{ label, value }` options.

**Usage**

```tsx
import { ButtonSelect } from "@megbailey/ui";

<ButtonSelect
  label="Priority"
  theme="primary"
  options={[
    { label: "Low", value: "low" },
    { label: "High", value: "high" },
  ]}
  initialValue="low"
  onChange={(value) => console.log(value)}
/>
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Field label |
| `options` | `ButtonSelectOption[]` | — | Options (value or `{ label, value }`) |
| `theme` | `"primary"` \| `"secondary"` \| `"danger"` \| `"success"` \| `string` | — | Button style |
| `initialValue` | `string` \| `number` \| `boolean` \| array \| `null` | — | Starting selection |
| `onChange` | `(value) => void` | — | Selection change handler |
| `isMulti` | `boolean` | — | Allow multiple selections |
| `isDisabled` | `boolean` | — | Disable interaction |
| `capitalizeOptions` | `boolean` | — | Auto-capitalize option labels |
| `className` | `string` | — | Additional CSS class |

Also accepts standard `HTMLAttributes` for `<div>` (except `onChange`).

**Types:** `ButtonSelectProps`, `ButtonSelectOption`, `ButtonSelectOptionValue`, `ButtonSelectTheme`

---

### Dropzone

**Summary** — Informed drag-and-drop file upload with MIME/size validation, optional image dimension checks, preview thumbnails, and a pluggable upload promise. Default max file size is 2 MB (`DEFAULT_MAX_FILE_SIZE`).

**Usage**

```tsx
import { Form } from "informed";
import { Dropzone, DEFAULT_MAX_FILE_SIZE } from "@megbailey/ui";

<Form>
  <Dropzone
    field="avatar"
    label="Profile photo"
    accept="image"
    aspectRatio="1:1"
    maxFileSize={DEFAULT_MAX_FILE_SIZE}
    uploadsURL="https://cdn.example.com/"
    uploadFilePromise={(file) => uploadToServer(file)}
    onDrop={(result) => console.log(result)}
  />
</Form>
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `field` | `string` | — | **Required.** Informed field name |
| `uploadFilePromise` | `(file: File) => Promise<UploadResult>` | — | **Required.** Upload handler |
| `uploadsURL` | `string` | — | **Required.** Base URL for uploaded file previews |
| `label` | `string` | — | Field label |
| `helperText` | `string` | — | Helper text below field |
| `accept` | `"image"` \| `"document"` \| `string` | — | Accepted file types |
| `isMulti` | `boolean` | — | Allow multiple files |
| `isRequired` | `boolean` | — | Mark as required |
| `tooltip` | `boolean` | — | Show info tooltip |
| `initialValue` | `string[]` | — | Pre-populated file URLs |
| `aspectRatio` | `"1:1"` \| `"3:2"` \| `"4:3"` \| `"4:5"` \| `"9:16"` \| `"16:9"` \| `string` | — | Image aspect ratio validation |
| `imageMinimumWidth` | `number` | — | Min image width (px) |
| `imageMinimumHeight` | `number` | — | Min image height (px) |
| `imageMaximumWidth` | `number` | — | Max image width (px) |
| `imageMaximumHeight` | `number` | — | Max image height (px) |
| `maxFileSize` | `number` | `2097152` (2 MB) | Max file size in bytes |
| `onDrop` | `(result: UploadResult) => void` | — | Called after successful upload |
| `onItemRemove` | `(index: number) => void` | — | Called when a preview is removed |
| `className` | `string` | — | Additional CSS class |

Also accepts Informed `FieldProps` and standard input attributes (excluding `onDrop`, `accept`, `multiple`, `type`, `value`, `defaultValue`).

**Types:** `DropzoneProps`, `DropzoneUserProps`, `DropItemProps`, `DropzoneAccept`, `DropzoneAspectRatio`, `UploadResult`, `ValidationResult`, `ImageDimensions`

**Peer dependencies:** `informed`

---

### GraphQLSelect

**Summary** — Apollo-powered async select for Informed forms; loads options via GraphQL query, supports grouping, multi-select, and request abort on unmount.

**Usage**

```tsx
import { gql } from "graphql-tag";
import { GraphQLSelect } from "@megbailey/ui";

const QUERY = gql`
  query Countries {
    countries { id name }
  }
`;

<GraphQLSelect
  field="country"
  label="Country"
  query={QUERY}
  endpointDataPath="countries"
  formatOptionLabel={(item) => item.name as string}
  attachAbortController
/>;
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `field` | `string` | — | Informed field name |
| `label` | `string` | — | Field label |
| `query` | `DocumentNode` | — | Apollo GraphQL query |
| `queryVariables` | `Record<string, unknown>` | — | Query variables |
| `endpointDataPath` | `string` | — | Dot-path to options in query result |
| `initialValue` | `TItem` \| `TItem[]` | — | Starting selection |
| `formatOptionLabel` | `(item: TItem) => string` | — | Custom option label |
| `formatGroupLabel` | `(group) => string` | — | Custom group label |
| `groupOptionsCallback` | `(options) => OptionsOrGroups` | — | Transform/group options |
| `attachAbortController` | `boolean` | — | Abort in-flight query on unmount |
| `onLoadingChange` | `(loading: boolean) => void` | — | Loading state callback |
| `onChange` | `(event: GraphQLSelectChangeEvent) => void` | — | Selection change handler |
| `isMulti` | `boolean` | — | Allow multiple selections |
| `isDisabled` | `boolean` | — | Disable interaction |
| `placeholder` | `string` | — | Placeholder text |

**Types:** `GraphQLSelectProps`, `GraphQLSelectItem`, `GraphQLSelectChangeEvent`, `ParseJSONOptionValueEvent`

**Peer dependencies:** `@apollo/client`, `react-select`, `informed`

---

### InformedSelect

**Summary** — `react-select` dropdown as an Informed form field with typed change/blur handlers, grouping, and multi-select support.

**Usage**

```tsx
import { Form } from "informed";
import { InformedSelect } from "@megbailey/ui";

<Form>
  <InformedSelect
    field="country"
    label="Country"
    placeholder="Choose a country"
    options={[
      { value: "us", label: "United States" },
      { value: "ca", label: "Canada" },
    ]}
    onChange={({ value }) => console.log(value)}
  />
</Form>
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `field` | `string` | — | Informed field name |
| `name` | `string` | — | Alternative field identifier |
| `label` | `string` | — | Field label |
| `helperText` | `string` | — | Helper text below field |
| `options` | `InformedSelectOption[]` \| grouped | — | **Required.** Select options |
| `placeholder` | `string` | — | Placeholder text |
| `initialValue` | option \| option[] \| grouped | — | Starting selection |
| `isMulti` | `boolean` | — | Allow multiple selections |
| `isDisabled` | `boolean` | — | Disable interaction |
| `formatGroupLabel` | `(group) => ReactNode` | — | Custom group label renderer |
| `forwardedRef` | `Ref<SelectInstance>` | — | Ref to react-select instance |
| `onChange` | `FormFieldChangeHandler` | — | Typed change handler |
| `onBlur` | `FormFieldBlurHandler` | — | Typed blur handler |

Also accepts additional [react-select props](https://react-select.com/props) (excluding `value`, `onChange`, `onBlur`, `options`, `isMulti`, `isDisabled`, `inputId`) and Informed `FieldProps`.

**Types:** `InformedSelectProps`, `InformedSelectFieldProps`, `InformedSelectOption`, `InformedSelectFieldValue`

**Peer dependencies:** `informed`, `react-select`

---

### ToggleSwitch

**Summary** — Accessible on/off toggle with customizable on/off labels, helper text, and a click handler.

**Usage**

```tsx
import { ToggleSwitch } from "@megbailey/ui";

<ToggleSwitch
  label="Email notifications"
  helperText="Receive updates about your account"
  initialValue={true}
  onLabel="On"
  offLabel="Off"
  onClick={({ value }) => console.log(value)}
/>
```

**Props**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Field label |
| `helperText` | `string` | — | Helper text below toggle |
| `initialValue` | `boolean` | — | Starting on/off state |
| `onLabel` | `string` | — | Label when on |
| `offLabel` | `string` | — | Label when off |
| `onClick` | `(event: ToggleSwitchChangeEvent) => void` | — | Toggle handler (`event.value` is boolean) |
| `className` | `string` | — | Additional CSS class |

Also accepts standard `HTMLAttributes` for `<div>` (except `onClick`).

**Types:** `ToggleSwitchProps`, `ToggleSwitchChangeEvent`

---

### useAbortController

**Summary** — Provides a stable `AbortController` with lazy creation and automatic abort on unmount (used by `GraphQLSelect`).

**Usage**

```tsx
import { useAbortController } from "@megbailey/ui";

function MyComponent() {
  const { getController } = useAbortController();

  const fetchData = () => {
    const { signal } = getController();
    fetch("/api/data", { signal });
  };
}
```

**Returns**

| Property | Type | Description |
| --- | --- | --- |
| `getController` | `() => AbortController` | Returns (or creates) the controller instance |

---

### useDelay

**Summary** — Debounce-style utility that runs a callback after a delay and returns a cleanup function for `useEffect`.

**Usage**

```tsx
import { useEffect } from "react";
import { useDelay } from "@megbailey/ui";

function SearchInput() {
  useEffect(() => {
    return useDelay(() => runSearch(), 300);
  }, [query]);
}
```

**Parameters**

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| `callback` | `() => void` | `() => null` | Function to run after delay |
| `delay` | `number` | `1000` | Delay in milliseconds |
| `cleanUpCallback` | `() => void` | `() => null` | Called when timeout is cleared |

**Returns:** `() => void` — cancel function for effect cleanup.

---

### useOnClickOutside

**Summary** — Fires a callback on `document` mousedown when the click target is outside the referenced element.

**Usage**

```tsx
import { useRef } from "react";
import { useOnClickOutside } from "@megbailey/ui";

function Dropdown() {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setOpen(false));
  return <div ref={ref}>...</div>;
}
```

**Parameters**

| Param | Type | Description |
| --- | --- | --- |
| `ref` | `RefObject<HTMLElement \| null>` | Element boundary |
| `callback` | `() => void` | Called on outside click |

---

### usePromises

**Summary** — Tracks one or more in-flight promises so UI can reflect pending state (e.g. disable submit while uploads run).

**Usage**

```tsx
import { usePromises } from "@megbailey/ui";

function UploadForm() {
  const { addPromise, isPending } = usePromises();

  const handleUpload = (file: File) => {
    addPromise(uploadFile(file));
  };

  return <button disabled={isPending()}>Submit</button>;
}
```

**Returns**

| Property | Type | Description |
| --- | --- | --- |
| `addPromise` | `(promise: Promise<boolean>) => Promise<boolean>` | Register a promise; auto-removes when settled |
| `isPending` | `() => boolean` | `true` if any tracked promise is in flight |
| `clear` | `() => void` | Remove all tracked promises |
| `promises` | `() => TrackedPromise[]` | Current tracked list |

---

## Development

From the monorepo root:

```bash
npm install
npm run build    # builds utils, then ui
npm test         # unit tests
npm run storybook --workspace=@megbailey/ui
```

From this package directory:

```bash
npm run build
npm test
npm run test:coverage
npm run storybook
npm run build-storybook
```

## License

MIT
