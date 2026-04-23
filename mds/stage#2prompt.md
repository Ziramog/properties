**✅ Green light for Stage 2** — almost perfect. One small token is missing but it's not a blocker.

---

**🟡 Minor — `--t-hero-italic-style: italic` was dropped**

The italic font-style token didn't make it in. Not critical for Stage 2, but the developer will need it when building the hero headline. Note it for a future patch:

```css
--t-hero-italic-style: italic;
```

**On the breakpoints** — Minimax kept them as variables with the comment above. That's actually fine as a compromise; the variables are harmless and can be read by JavaScript if needed. Just make sure the dev knows to write `@media (max-width: 640px)` with raw values, never `var(--bp-mobile)`.

---

**Everything else: correct.** All 30+ token names match the spec, single `:root` block, typography scale is now properly atomic, Google Fonts import is clean.

---

Here's your **Stage 2 prompt**, ready to paste:

---

> **Attached:** `WOLFIM_landing_design_spec.md` and `design-system.css`
>
> Your task is **Stage 2 only**: implement the Global Components from Section 2 of the spec.
>
> Deliver two files:
> - `components.css` — all component styles
> - `components-demo.html` — a single HTML page that imports both `design-system.css` and `components.css` and visually shows every component variant
>
> Build exactly these components, nothing more:
> 1. **Primary button** (Section 2.1) — including hover, active, and focus states
> 2. **Secondary button** (Section 2.2) — including hover state
> 3. **Ghost button** (Section 2.3) — for use on dark/photo backgrounds
> 4. **All 5 badge variants** (Section 2.4): price, available, rented, featured, consult
> 5. **Input / Dropdown** (Section 2.5) — including focus state
>
> **Rules:**
> - Every value must reference a token from `design-system.css` — no hardcoded hex colors, no hardcoded pixel values that have a token equivalent
> - Typography must use the atomic `--t-*` tokens (e.g. `font-size: var(--t-button-size); font-weight: var(--t-button-weight)`) — never the old shorthand tokens
> - The demo HTML must show each component on both a white background and a dark background so ghost button and dark badges are visible
> - No JavaScript — CSS only for all states
> - Do not build any layout sections yet — components only