# Lenis Smooth Scroll Setup

## CDN Installation

```html
<link rel="stylesheet" href="https://unpkg.com/lenis@1.1.13/dist/lenis.css">
<script src="https://cdn.jsdelivr.net/npm/lenis@latest/dist/lenis.min.js" defer></script>
```

## Basic Init

```javascript
const lenis = new Lenis({ autoRaf: true });
```

## With GSAP ScrollTrigger

```javascript
const lenis = new Lenis();

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

## Configuration Options

```javascript
const lenis = new Lenis({
  duration: 1.2,        // Scroll duration (default: 1.2)
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Default easing
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  autoRaf: true,
});
```

## Stopping Scroll (for modals/drawers)

```javascript
// Stop smooth scroll when modal opens
lenis.stop();

// Resume when modal closes
lenis.start();
```

## Scroll To

```javascript
// Smooth scroll to element
lenis.scrollTo('#menu', { duration: 1.5 });

// Smooth scroll to top
lenis.scrollTo(0);
```
