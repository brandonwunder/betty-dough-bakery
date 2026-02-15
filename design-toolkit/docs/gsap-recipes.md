# GSAP + ScrollTrigger Recipes

## Setup

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js" defer></script>
<script>
gsap.registerPlugin(ScrollTrigger);
</script>
```

## Staggered Card Entrance

```javascript
gsap.from('.product-card', {
  y: 60,
  opacity: 0,
  duration: 0.8,
  stagger: 0.12,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.product-grid',
    start: 'top 80%',
  }
});
```

## Parallax Background

```javascript
gsap.to('.hero::before', {
  yPercent: -30,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  }
});
```

## Section Fade + Slide + Blur

```javascript
gsap.utils.toArray('.section-reveal').forEach(section => {
  gsap.from(section, {
    y: 40,
    opacity: 0,
    filter: 'blur(4px)',
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 85%',
    }
  });
});
```

## Clip-Path Image Reveal

```javascript
gsap.from('.about-owner-photo', {
  clipPath: 'inset(0 100% 0 0)',
  duration: 1.2,
  ease: 'power3.inOut',
  scrollTrigger: {
    trigger: '.about-section',
    start: 'top 70%',
  }
});
```

## Footer Column Stagger

```javascript
gsap.from('.footer-grid > *', {
  y: 30,
  opacity: 0,
  duration: 0.6,
  stagger: 0.1,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.site-footer',
    start: 'top 85%',
  }
});
```

## Lenis + GSAP Integration

```javascript
const lenis = new Lenis({ autoRaf: true });

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

## Hero Background Scale on Load

```javascript
gsap.from('.hero::before', {
  scale: 1.1,
  duration: 3,
  ease: 'power2.out'
});
```
