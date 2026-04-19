# Design System Document: The Invisible Shield

> **SoT:** UI·비주얼 결정 시 이 문서를 우선합니다. Cursor 규칙 `.cursor/rules/design.mdc`는 여기로 연결됩니다.

## 1. Overview & Creative North Star

### Creative North Star: "The Digital Curator"

This design system moves beyond the "utilitarian tool" trope to become a premium digital concierge. While the user requested a "utility" feel, our editorial approach elevates this to "High-End Utility"—think of a luxury automobile's dashboard or a high-end medical instrument.

We avoid the "template" look by rejecting traditional boxes and lines. Instead, we use **Tonal Architecture**: defining spaces through subtle shifts in light and depth. The layout is intentionally spacious, using Korean typography as a structural element rather than just information. We break the rigid grid with asymmetrical content clusters that guide the eye naturally toward the "Clean" actions.

---

## 2. Colors & Surface Architecture

The palette is rooted in `primary` (#0050cb) to evoke deep institutional trust, supported by a sophisticated range of cool grays.

### The "No-Line" Rule

**Explicit Instruction:** Do not use 1px solid borders to section content. Traditional borders create visual noise and "trap" the user. Instead, define boundaries using:

- **Tonal Shifts:** Place a `surface-container-low` card on a `surface` background.

- **Negative Space:** Use the spacing scale to create "invisible" borders.

### Surface Hierarchy & Nesting

Treat the UI as a series of physical layers. Use the following hierarchy to define importance:

1.  **Base Layer:** `surface` (#f7f9fc) — The canvas.

2.  **Section Layer:** `surface-container-low` (#f2f4f7) — For grouping related metadata categories.

3.  **Active Component Layer:** `surface-container-lowest` (#ffffff) — For interactive cards or input fields.

### The "Glass & Gradient" Rule

To prevent a "flat" utility feel, use **Glassmorphism** for floating action headers. Apply `surface-container-lowest` with 80% opacity and a 20px backdrop-blur.

- **Signature Texture:** For the main "Clean Metadata" CTA, use a linear gradient: `primary` (#0050cb) to `primary-container` (#0066ff) at a 135-degree angle. This adds a "jewel-like" depth that solid colors lack.

---

## 3. Typography: Editorial Clarity

We use **Manrope/Pretendard JP** for its exceptional legibility in Korean characters, focusing on a high-contrast scale that feels authoritative.

- **Display (Display-MD):** 2.75rem / Bold. Used for data visualizations (e.g., "0개의 메타데이터").

- **Headline (Headline-SM):** 1.5rem / Semi-Bold. Primary screen titles (e.g., "개인정보 보호 리포트").

- **Title (Title-MD):** 1.125rem / Medium. For card headers and metadata categories.

- **Body (Body-LG):** 1rem / Regular. For primary descriptions and user instructions.

- **Label (Label-MD):** 0.75rem / Bold. For technical metadata tags (Exif, GPS, Device ID).

**Editorial Note:** Use `on-surface-variant` (#424656) for secondary metadata descriptions to create a clear visual hierarchy against the `on-surface` primary text.

---

## 4. Elevation & Depth

We achieve hierarchy through **Tonal Layering** rather than structural shadows.

- **The Layering Principle:** Depth is "stacked." A `surface-container-highest` button should sit on a `surface-container-low` section. This creates a soft, tactile feel.

- **Ambient Shadows:** If a floating element (like a bottom sheet) is required, use a shadow with a 40px blur at 4% opacity, tinted with `primary` (#0050cb) to simulate natural light refracting through the UI.

- **The "Ghost Border" Fallback:** For accessibility in high-glare environments, use an `outline-variant` (#c2c6d8) at 15% opacity. It should be felt, not seen.

---

## 5. Components

### Buttons (버튼)

- **Primary:** `xl` (1.5rem) corner radius. Gradient fill. White text. High-density padding (16px 24px).

- **Secondary:** `surface-container-high` background. No border. `on-secondary-container` text color.

- **State:** On press, scale down to 98% to provide haptic visual feedback.

### Metadata Chips (메타데이터 칩)

- Use `surface-container-highest` for the background.

- Label text should be `label-md`.

- **Iconography:** Use 20px "Optical Size" icons to maintain a lightweight utility feel.

### Lists & Cards (리스트 및 카드)

- **Zero-Divider Policy:** Forbid horizontal lines between list items. Use 12px of vertical spacing and a `surface-container-lowest` background shift on tap.

- **Corner Radius:** All containers must use the `lg` (1rem) or `xl` (1.5rem) tokens for a friendly, modern touch.

### Input Fields (입력 필드)

- Background: `surface-container-high`.

- Focused State: 2px "Ghost Border" using `primary`.

- **Text:** All placeholders must be in Korean (e.g., "검색어를 입력하세요").

---

## 6. Do’s and Don’ts

### Do

- **Do** use `primary-container` (#0066ff) for success states and "Clean" actions.

- **Do** prioritize Korean readability by increasing line-height to 1.6 for body text.

- **Do** use asymmetrical margins (e.g., 24px left, 16px right) on hero sections to create a premium editorial feel.

- **Do** use `tertiary` (#a33200) for "Delete" or "Sensitive Data Found" alerts.

### Don't

- **Don't** use 100% black (#000000). Use `on-surface` (#191c1e) for deep contrast that remains easy on the eyes.

- **Don't** use sharp 90-degree corners. This breaks the "Shield" metaphor of safety and approachability.

- **Don't** use standard "Drop Shadows." Stick to tonal shifts or ambient, tinted blurs.

- **Don't** clutter the UI. If a piece of metadata isn't actionable, move it to a "Details" layer.

---

## 7. Signature App Logic: "The Cleaning Pulse"

When the user initiates a "Clean" action, transition the background from `surface` to a subtle radial gradient of `primary-fixed` (#dae1ff) to create a "cleansing" atmosphere. Use the `surface-tint` (#0054d6) for progress indicators to maintain visual authority.
