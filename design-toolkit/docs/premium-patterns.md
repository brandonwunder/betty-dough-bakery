# Premium Design Patterns

Reference patterns from award-winning dark-themed food/luxury sites.

## What Makes Dark Themes Feel Luxury

1. **Film grain overlay** — Adds organic warmth to flat digital surfaces
2. **Ambient glow blobs** — Soft radial gradients suggesting light sources behind content
3. **Glassmorphism** — Semi-transparent panels with blur create depth and layering
4. **Gradient borders** — Instead of solid borders, use gradient borders that suggest light
5. **Accent-colored shadows** — Shadows tinted with the brand color (not just black)
6. **Inner glow on hover** — Subtle inset box-shadow in the accent color
7. **Generous spacing** — Premium sites use more whitespace than you think is necessary

## Hero Section Patterns

- **Cinematic vignette**: Radial gradient (lighter center, darker edges)
- **Staggered entrance**: Logo → title → subtitle → CTA appear sequentially
- **Subtle background scale**: Image slowly zooms from 1.1 to 1.0 on load
- **Text character reveal**: Characters animate in one by one using SplitText

## Card Design Patterns

- **3D tilt on hover**: vanilla-tilt with glare creates "catch the light" effect
- **Shine sweep**: A light beam passes across the card on hover
- **Accent shadow on hover**: Box-shadow includes the accent color at low opacity
- **Image zoom**: Product image scales 1.08x on hover with overflow hidden
- **Staggered entrance**: Cards cascade in with 80-100ms stagger on scroll

## Typography Patterns

- **CAPS + Script combo**: Small-caps label above a large script/serif heading
- **Large type contrast**: Section titles are dramatically larger than body text
- **Pull-quotes**: First paragraph larger, italic, with a left border accent
- **Gold shimmer on text**: background-clip: text with animated gradient

## Animation Principles

- **Ease**: Use `cubic-bezier(0.23, 1, 0.32, 1)` for smooth card movements
- **Duration**: 500-800ms for entrances, 300-400ms for hovers, 100ms for clicks
- **Stagger**: 80-120ms between items in a grid
- **Direction**: Elements should enter from below (translateY positive to 0)
- **Blur**: Start with filter: blur(4px), clear to blur(0) for depth
- **Don't overdo it**: Every animation should have a purpose
