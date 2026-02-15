# GSAP SplitText Recipes

SplitText splits text into characters, words, and lines for staggered animations.
**Free since April 2025** (was $100+/year Club plugin).

## CDN

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/SplitText.min.js" defer></script>
```

## Character-by-Character Reveal

```javascript
const split = new SplitText('.hero-title .title-script', { type: 'chars' });

gsap.from(split.chars, {
  opacity: 0,
  y: 40,
  rotateX: -90,
  stagger: 0.03,
  duration: 0.6,
  ease: 'back.out(1.7)'
});
```

## Word-by-Word Fade Up

```javascript
const split = new SplitText('.hero-description', { type: 'words' });

gsap.from(split.words, {
  opacity: 0,
  y: 20,
  stagger: 0.02,
  duration: 0.5,
  ease: 'power2.out',
  delay: 0.5
});
```

## Line-by-Line Clip Reveal

```javascript
const split = new SplitText('.about-text', { type: 'lines' });

split.lines.forEach(line => {
  const wrapper = document.createElement('div');
  wrapper.style.overflow = 'hidden';
  line.parentNode.insertBefore(wrapper, line);
  wrapper.appendChild(line);
});

gsap.from(split.lines, {
  y: '100%',
  stagger: 0.12,
  duration: 0.8,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.about-section',
    start: 'top 70%',
  }
});
```

## Section Title Entrance (CAPS + Script combo)

```javascript
// Animate the CAPS label
gsap.from('.section-title .title-caps', {
  opacity: 0,
  y: 20,
  duration: 0.6,
  ease: 'power2.out',
  scrollTrigger: { trigger: '.section-title', start: 'top 85%' }
});

// Then animate the Script title character by character
const scriptSplit = new SplitText('.section-title .title-script', { type: 'chars' });
gsap.from(scriptSplit.chars, {
  opacity: 0,
  y: 30,
  stagger: 0.04,
  duration: 0.5,
  ease: 'power2.out',
  delay: 0.2,
  scrollTrigger: { trigger: '.section-title', start: 'top 85%' }
});
```

## Auto-Resplit on Resize

```javascript
const split = new SplitText('.hero-title', {
  type: 'chars,words,lines',
  autoSplit: true  // Re-splits on resize
});
```
