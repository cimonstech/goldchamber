# Fixes Applied — GoldTextReveal & TestimonialsSection

## 1. CARD CONTAINMENT ON WIDE SCREENS
- Wrapped the entire GoldTextReveal composition (text, icons, button, cards) in a `max-w-[1400px] mx-auto` container
- Cards use `position: absolute` relative to this container (which has `position: relative`)
- Card positions use percentages (`left: 4%`, `right: 4%`, etc.) so they stay within the 1400px boundary

## 2. BUTTON Z-INDEX AND POINTER FIX
**Root cause:** The absolutely positioned stat cards were layered above the button in the stacking context and were intercepting pointer events (clicks) before they reached the button.

**Fixes applied:**
- Button: `position: relative`, `z-index: 20`, `pointer-events: auto`
- All three stat cards: `pointer-events: none` (via class and inline style) so they no longer block clicks

## 3. BUTTON ON SMALL SCREENS
- On mobile (<768px), Card 3 (999.9 Purity) is hidden via `.gold-card-3 { display: none; }` in the media query
- Only Card 1 and Card 2 remain visible on the sides, so the button is no longer overlapped

## 4. TESTIMONIALS — NO TILT
- Removed all rotation transforms from testimonial cards
- Cards now sit flat with no `rotate()` applied

## 5. TESTIMONIALS — RANDOM 3 FROM 6
- Defined 6 testimonials (person1–person6.webp) with quote, name, title, star rating
- On each page load: `useState(() => shuffled.slice(0, 3))` picks 3 randomly
- Display: 3-column grid on desktop, single column on mobile
- Float animation by position index: 0s/3.5s, 0.6s/4s, 1.2s/3.8s

## 6. GOLDTEXTREVEAL SCROLL BEHAVIOUR
**Root cause:** The inner container used `position: sticky` with `top-0 h-screen`, which kept the content fixed in the viewport while the user scrolled through the section. This created the "stuck" feeling because the scroll appeared to pause as the sticky content stayed in place.

**Fixes applied:**
- Removed `sticky top-0 h-screen` and `overflow-hidden` entirely
- Section is now a normal in-flow block with `min-h-[120vh]`
- Content scrolls naturally with the page; no scroll locking or fixed positioning

## 7. LARGE DARK GAP
- Reduced GoldTextReveal section height from 200vh to 120vh
- GoldTextReveal uses its own local scroll tracking via `sectionRef` and `getBoundingClientRect()`
- Progress is computed from the section’s `offsetTop` and scroll position, decoupled from the hero
- Text reaches centre at `progress >= 0.4`; formula: `translateX = progress < 0.4 ? -100 + (progress/0.4)*100 : 0`

## 8. CSS PROPERTY SUMMARY

| Issue | Property / Cause |
|-------|------------------|
| Button pointer-events | Absolutely positioned cards were above the button and intercepted clicks. Fix: `pointer-events: none` on cards, `pointer-events: auto` + `z-index: 20` on button. |
| Scroll locking | `position: sticky` + `h-screen` on the inner container kept content fixed while scrolling. Fix: Removed sticky; section is normal in-flow. |
