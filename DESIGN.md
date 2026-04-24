---
name: Technical Precision
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb2b7'
  on-tertiary: '#67001b'
  tertiary-container: '#ff516a'
  on-tertiary-container: '#5b0017'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#92002a'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  badge-text:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 12px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  container-padding: 1rem
  gutter: 1rem
---

## Brand & Style

This design system is built for a high-performance technical environment, focusing on clarity, data density, and professional growth. The aesthetic is **Corporate / Modern** with a strong emphasis on **Minimalism**, ensuring that complex skill data remains digestible and actionable.

The UI targets developers, engineers, and technical leads who value efficiency and precision. The visual language should evoke feelings of competence, progress, and analytical rigor. By utilizing a dark-first color palette, we reduce eye strain for users who spend significant time in IDEs and terminal environments, making the app feel like a native extension of their existing workflow.

## Colors

The color palette is anchored by a deep slate foundation to provide a sophisticated backdrop for technical data.

- **Surface Layers:** The primary background uses `slate-900`, with container elements and cards stepping up to `slate-800` to create subtle depth.
- **Accents:** The primary action color is a crisp Blue (`blue-500`), representing logic and navigation. Emerald (`emerald-500`) is used for growth indicators, completion states, and "acquired" skills.
- **Priority Indicators:** To communicate urgency in skill gaps, we use a semantic triad:
    - **High Priority:** Rose/Red (`rose-500`) for critical deficiencies.
    - **Medium Priority:** Amber/Yellow (`amber-400`) for secondary needs.
    - **Low Priority:** Slate (`slate-400`) for optional or foundational skills.

## Typography

This design system utilizes a dual-font strategy to balance technical character with readability.

- **Space Grotesk** is used for headlines, display numbers, and labels. Its geometric, slightly futuristic construction reinforces the tech-focused nature of the app.
- **Inter** is used for all body text, lists, and inputs. Its neutral, systematic design ensures high legibility for long descriptions of technical requirements and skill definitions.

All priority badges and skill tags use uppercase `label-caps` or tight `badge-text` styles to differentiate metadata from primary content.

## Layout & Spacing

The system follows a strict **mobile-first, 8pt grid** philosophy.

- **Grid:** For mobile devices, use a 4-column fluid grid with 16px margins and 16px gutters. For larger screens, expand to a 12-column grid while maintaining a maximum content width of 1200px.
- **Rhythm:** Vertical spacing between cards should be consistent at `16px` (md). Internal card padding should also follow the `16px` rule to ensure a uniform "breathing room" across the UI.
- **Stacking:** Use a "tight stack" for related items (e.g., a skill name and its priority badge) with `4px` or `8px` spacing.

## Elevation & Depth

In this dark-mode environment, depth is communicated through **Tonal Layers** and **Low-contrast Outlines** rather than heavy shadows.

- **Level 0 (Base):** `bg-slate-900` — The canvas.
- **Level 1 (Cards/Surface):** `bg-slate-800` — Floating elements and containers. These surfaces feature a 1px border of `white/5%` to define their edges against the dark background.
- **Level 2 (Modals/Popovers):** `bg-slate-700` — Active overlays. These should have a subtle `20%` opacity black shadow with a large blur (24px) to create a soft "lift" effect.
- **Interactive States:** Use subtle background color shifts (e.g., `slate-800` to `slate-750`) on hover or press, rather than increasing elevation.

## Shapes

The shape language is **Rounded**, striking a balance between the harshness of sharp corners and the playfulness of pill shapes.

- **Standard Containers:** Cards and large sections use a `1rem` (rounded-lg) radius.
- **Interactive Elements:** Buttons and input fields use a `0.5rem` radius to maintain a professional, structured appearance.
- **Small Components:** Skill badges and tags use a `0.25rem` (rounded-sm) radius to appear distinct from interactive buttons.

## Components

- **Skill Badges:** Small, high-contrast tags. 
    - *High:* Rose background (20% opacity) with Rose text.
    - *Medium:* Amber background (20% opacity) with Amber text.
    - *Low:* Slate background (20% opacity) with Slate-300 text.
- **Primary Buttons:** Solid `blue-500` with white text. Use `Space Grotesk` Bold for the label.
- **Secondary Buttons:** Ghost style with `slate-700` border and white text.
- **Cards:** `bg-slate-800` with a `1px` border of `white/10%`. Content should be padded at `1.5rem`.
- **Progress Bars:** Use a thick `8px` track in `slate-700` with the progress indicator in `emerald-500` to signify growth.
- **Inputs:** `bg-slate-900` with a `slate-700` border. On focus, the border shifts to `blue-500` with a subtle blue outer glow (3px).
- **Skill Matrix:** Use a grid of cards for skill categories, with a "Match Percentage" circular progress indicator in the top right corner of each card.
