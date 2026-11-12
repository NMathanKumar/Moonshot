# Common Component Library (MSP-2011)

Shared, documented UI primitives for the Moonshot Test Taker frontend.

**Conventions (all components):**

- React functional components, JSX.
- Styles via CSS Modules (`*.module.css`), imported as a `styles` object.
- Colors/spacing/type come from semantic design tokens in `src/styles/variables.css` — no hardcoded hex.
- SVG icons only (no icon fonts/emoji).
- WCAG 2.1 AA: labels, keyboard operability, visible focus, roles/aria.
- No external UI libraries.

Import from the barrel:

```js
import {
  Button,
  Input,
  Modal,
  ToastProvider,
  useToast,
  Tooltip,
  Dropdown,
  Card,
  Alert,
  MediaControls,
  Timer,
  Stepper,
} from '@components/common';
```

---

## Design tokens (brand-swappable)

`src/styles/variables.css` has two layers:

- **Layer 1 — raw brand palette** (`--brand-*`): the only values to change when re-branding (F118 HST brand). e.g. `--brand-primary`, `--brand-danger`.
- **Layer 2 — semantic tokens** (`--color-action`, `--color-danger-action`, `--color-surface`, `--color-text`, `--color-focus-ring`, …): components reference ONLY these.

**Usage rule:** components must never reference `--brand-*` directly. To re-brand, override the `--brand-*` block (globally or in a theme scope); components need no change.

---

## Button

| Prop        | Type                                   | Default     | Notes                    |
| ----------- | -------------------------------------- | ----------- | ------------------------ |
| `children`  | node                                   | —           | Button label/content     |
| `onClick`   | func                                   | —           | Click handler            |
| `type`      | `'button' \| 'submit' \| 'reset'`      | `'button'`  | Native type              |
| `variant`   | `'primary' \| 'secondary' \| 'danger'` | `'primary'` | Visual style             |
| `size`      | `'small' \| 'medium' \| 'large'`       | `'medium'`  |                          |
| `disabled`  | bool                                   | `false`     |                          |
| `isLoading` | bool                                   | `false`     | Shows spinner + disables |
| `fullWidth` | bool                                   | `false`     | Stretches to container   |
| `className` | string                                 | `''`        | Extra classes (appended) |

**Usage rules:** use `variant="danger"` only for destructive actions. Always provide a text label (or `aria-label` for icon-only). `isLoading` already disables — don't also pass `disabled` for the same state.

## Input

| Prop                            | Type   | Default  | Notes                                          |
| ------------------------------- | ------ | -------- | ---------------------------------------------- |
| `label`                         | string | —        | Renders a `<label>` tied to the input          |
| `name`                          | string | —        | Used as `id`; required for label + a11y wiring |
| `type`                          | string | `'text'` |                                                |
| `value` / `onChange` / `onBlur` | —      | —        | Controlled input                               |
| `placeholder`                   | string | —        | Not a label substitute                         |
| `error`                         | string | —        | Shows `role="alert"`, sets `aria-invalid`      |
| `helperText`                    | string | —        | Hidden when `error` is present                 |
| `disabled` / `required`         | bool   | `false`  |                                                |
| `autoComplete`                  | string | —        |                                                |
| `className`                     | string | `''`     |                                                |

**Usage rules:** always pass `name` (drives `htmlFor`/`id` and `aria-describedby`). Always pass `label` (placeholder is not accessible labelling). Provide `error` as human text, no raw codes.

## Dropdown

| Prop          | Type                  | Default | Notes                                   |
| ------------- | --------------------- | ------- | --------------------------------------- |
| `label`       | string                | —       | Renders a `<label>` for the select      |
| `name`        | string                | —       | HTML name; used for aria-describedby    |
| `options`     | Array<{label, value}> | —       | Selectable items                        |
| `value`       | string \| number      | —       | Controlled value (selected option)      |
| `onChange`    | func(value)           | —       | Called on selection change              |
| `placeholder` | string                | —       | Fallback text when no option selected   |
| `error`       | string                | —       | Error message, sets `aria-invalid`      |
| `helperText`  | string                | —       | Helper text (hidden when error present) |
| `disabled`    | bool                  | `false` | Disables interaction                    |
| `required`    | bool                  | `false` | Shows `*` in label                      |
| `className`   | string                | `''`    | Extra classes                           |

**Usage:** styled native `<select>` with custom arrow icon. Always provide `name` for a11y and `label` for accessibility. Placeholder is optional.

---

## Card

| Prop        | Type                               | Default  | Notes                                     |
| ----------- | ---------------------------------- | -------- | ----------------------------------------- |
| `children`  | node                               | —        | Card body content                         |
| `title`     | string                             | —        | Optional card heading (renders as `<h3>`) |
| `footer`    | node                               | —        | Optional footer slot                      |
| `bordered`  | bool                               | `true`   | Shows border                              |
| `shadow`    | `'none' \| 'sm' \| 'base' \| 'md'` | `'base'` | Shadow depth                              |
| `padding`   | `'none' \| 'sm' \| 'md' \| 'lg'`   | `'md'`   | Padding level                             |
| `className` | string                             | `''`     | Extra classes                             |

**Usage:** semantic container for grouped content. No state; purely structural. Use `title` for a heading, `footer` for actions/metadata at bottom.

---

## Alert

| Prop        | Type                                          | Default  | Notes                              |
| ----------- | --------------------------------------------- | -------- | ---------------------------------- |
| `variant`   | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Color/icon/role                    |
| `title`     | string                                        | —        | Optional alert heading             |
| `children`  | node                                          | —        | Alert message (string or JSX)      |
| `onClose`   | func                                          | —        | Called when dismiss button clicked |
| `closeable` | bool                                          | `true`   | Show dismiss button                |
| `className` | string                                        | `''`     | Extra classes                      |

**Behaviour:** in-page contextual feedback (not a toast). Role is `"alert"` for error/warning, `"status"` for info/success. Each variant has a semantic color and icon.

**Usage rules:** use for persistent, contextual messages on a page or form. For transient notifications, use `Toast` instead.

---

## MediaControls

| Prop             | Type         | Default          | Notes                               |
| ---------------- | ------------ | ---------------- | ----------------------------------- |
| `label`          | string       | `'Media player'` | Accessible label                    |
| `currentTime`    | number       | 0                | Current playback position (seconds) |
| `duration`       | number       | 0                | Total media duration (seconds)      |
| `isPlaying`      | bool         | `false`          | Play/pause state                    |
| `onPlay`         | func         | —                | Called when play clicked            |
| `onPause`        | func         | —                | Called when pause clicked           |
| `onSeek`         | func(time)   | —                | Called on progress bar seek         |
| `showVolume`     | bool         | `true`           | Show volume control                 |
| `volume`         | number       | 1                | Volume level (0–1)                  |
| `onVolumeChange` | func(volume) | —                | Called on volume slider change      |
| `className`      | string       | `''`             | Extra classes                       |

**Behaviour:** displays playback controls, progress bar, and optional volume slider. Time displayed in MM:SS format. Progress bar shows current position; click to seek. Play/pause buttons disabled when in opposite state.

**Usage:** component is controls-only; parent manages media element, playback state, and time. Pass `onPlay`, `onPause`, `onSeek`, `onVolumeChange` to emit events.

---

## Timer

| Prop               | Type                         | Default        | Notes                                   |
| ------------------ | ---------------------------- | -------------- | --------------------------------------- |
| `initialSeconds`   | number                       | —              | Total seconds to count down             |
| `isActive`         | bool                         | `false`        | Start/stop the countdown                |
| `onComplete`       | func                         | —              | Called when countdown reaches 0         |
| `onTick`           | func(secondsRemaining)       | —              | Called each second (before decrement)   |
| `format`           | func(seconds) -> string      | `'MM:SS'`      | Format time display                     |
| `displayVariant`   | string                       | `'countdown'`  | Reserved for future elapsed mode        |
| `warningThreshold` | number                       | —              | Seconds remaining to show warning color |
| `orientation`      | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout                                  |
| `className`        | string                       | `''`           | Extra classes                           |

**Behaviour:** displays a countdown or elapsed timer. When `isActive={true}`, decrements by 1 second per interval. Emits `onTick` each tick and `onComplete` when reaching 0. Color changes to warning yellow at threshold, then critical red at 50% of threshold. Respects `prefers-reduced-motion`.

**Usage rules:** manage timer state externally; component is controlled. Set `isActive={true}` to start, `isActive={false}` to stop. Cleanup is automatic on unmount or when `isActive` becomes false.

---

## Stepper

| Prop          | Type                         | Default        | Notes                                        |
| ------------- | ---------------------------- | -------------- | -------------------------------------------- |
| `steps`       | Array<{label, id?}>          | —              | Step definitions                             |
| `activeStep`  | number                       | 0              | Current step index (0-based)                 |
| `onStepClick` | func(index)                  | —              | Called on step click; omit for non-clickable |
| `disabled`    | bool                         | `false`        | Disable all step interactions                |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction                             |
| `className`   | string                       | `''`           | Extra classes                                |

**Behaviour:** multi-step progress indicator. Completed steps (< activeStep) show a checkmark. Active step is highlighted with blue background. Future steps (> activeStep) are grayed out and disabled (if clickable). Connector lines show progress flow.

**Usage:** display-only indicator or optionally clickable for "revisit a step" flows. If `onStepClick` is omitted, steps are not clickable. Future steps remain disabled and unclickable to enforce linear progression (or allow revisiting completed steps).

---

## Modal

| Prop              | Type   | Default          | Notes                                        |
| ----------------- | ------ | ---------------- | -------------------------------------------- |
| `isOpen`          | bool   | —                | Controls visibility                          |
| `onClose`         | func   | —                | Called on Escape, backdrop, close button     |
| `title`           | string | —                | Sets the accessible name (`aria-labelledby`) |
| `children`        | node   | —                | Body content                                 |
| `closeOnBackdrop` | bool   | `true`           | Disable for forced decisions                 |
| `closeLabel`      | string | `'Close dialog'` | aria-label for the X button                  |
| `className`       | string | `''`             | Extra classes on the dialog                  |

**Behaviour:** `role="dialog"` + `aria-modal`, focus moves into the dialog on open and is trapped (Tab/Shift+Tab cycle, only _visible_ focusable elements; escaped focus is pulled back on Tab), focus returns to the trigger on close, Escape closes. Rendered via a portal to `document.body`. The accessible name id is generated with React `useId()`.

**Stacking / nested modals:** supported. Body scroll lock is reference-counted via a shared manager (`scrollLock.js`), so with multiple modals open, scrolling stays locked until the **last** modal closes. Each modal traps focus within its own dialog.

**Usage rules:** always pass a `title` (accessible name). Set `closeOnBackdrop={false}` only for flows that must not be dismissed accidentally. Prefer one modal at a time; nested modals work but add cognitive load.

## Toast (`ToastProvider` + `useToast`)

Wrap the app once:

```jsx
<ToastProvider defaultDuration={5000}>
  <App />
</ToastProvider>
```

Then in any component:

```js
const { notify, dismiss } = useToast();
notify('Saved', { variant: 'success', duration: 4000 });
```

`<ToastProvider defaultDuration={5000} maxVisible={4}>` — `maxVisible` caps concurrent toasts.

| `notify(message, options)` | —                                                              |
| -------------------------- | -------------------------------------------------------------- |
| `options.variant`          | `'info' \| 'success' \| 'error' \| 'warning'` (default `info`) |
| `options.duration`         | ms; `0` = persist until dismissed                              |
| returns                    | toast id (pass to `dismiss(id)`)                               |

**Behaviour:**

- Two live regions: **error** toasts announce via `aria-live="assertive"` + `role="alert"`; info/success/warning use `aria-live="polite"`. This ensures failures interrupt, while routine messages wait politely.
- Auto-dismiss after `duration`; each toast has a keyboard-focusable dismiss button.
- **Overflow:** capped at `maxVisible` (default 4); when exceeded the **oldest** toasts are dropped and their timers cleared.
- **Cleanup:** timers are cleared on individual dismiss and when the provider unmounts.

**Usage rules:** keep messages short and human. Use `error` variant with `duration: 0` for failures that need acknowledgement. `useToast` throws if used outside `ToastProvider`.

## Tooltip

| Prop        | Type                                     | Default | Notes             |
| ----------- | ---------------------------------------- | ------- | ----------------- |
| `content`   | node                                     | —       | Tooltip text      |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` |                   |
| `children`  | single element                           | —       | Must be focusable |

**Behaviour:** shows on hover, keyboard focus, and **touch** (tap toggles), links to the trigger via `aria-describedby`, dismisses on Escape, `role="tooltip"`.

**Usage rules:** wrap a single focusable element (button/link). Tooltips are **supplementary** — never put essential-only info in a tooltip; it must not be the only way to access important information. Not a replacement for a visible label.

**Known limitation:** positioning is CSS-based (`placement` = top/bottom/left/right) with **no automatic viewport-edge flipping** — near an edge the bubble can clip. This is a deliberate trade-off to avoid a positioning dependency. Choose a `placement` that fits the layout, or keep tooltips away from viewport edges. Revisit with a positioning solution if edge cases become common.
