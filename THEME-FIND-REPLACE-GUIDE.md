# Theme System — Find & Replace Guide

Use this table for global search-and-replace across all component and page files to complete the light/dark theme migration.

## Backgrounds

| Find | Replace |
|------|---------|
| `#050505` | `var(--bg-primary)` |
| `#0a0a0a` | `var(--bg-secondary)` |
| `#111111` | `var(--bg-tertiary)` |
| `rgba(201,168,76,0.08)` (card background) | `var(--bg-card)` |
| `bg-cream` | `style={{ backgroundColor: "var(--bg-primary)" }}` or use `var(--bg-primary)` |
| `bg-white` | `style={{ backgroundColor: "var(--bg-primary)" }}` |
| `bg-dark` | `style={{ backgroundColor: "var(--bg-secondary)" }}` |

## Text

| Find | Replace |
|------|---------|
| `#FAF6EE` | `var(--text-primary)` |
| `rgba(250,246,238,0.65)` | `var(--text-secondary)` |
| `rgba(250,246,238,0.35)` | `var(--text-muted)` |
| `rgba(250,246,238,0.4)` | `var(--text-muted)` |
| `rgba(250,246,238,0.5)` | `var(--text-muted)` |
| `rgba(250,246,238,0.55)` | `var(--text-secondary)` |
| `rgba(250,246,238,0.6)` | `var(--text-secondary)` |
| `rgba(201,168,76,0.7)` (label colour) | `var(--text-label)` |
| `text-dark` | `style={{ color: "var(--text-primary)" }}` |
| `text-dark/60` | `style={{ color: "var(--text-muted)" }}` |
| `text-dark/65` | `style={{ color: "var(--text-secondary)" }}` |
| `text-dark/70` | `style={{ color: "var(--text-secondary)" }}` |
| `text-dark/75` | `style={{ color: "var(--text-secondary)" }}` |
| `text-dark/80` | `style={{ color: "var(--text-secondary)" }}` |

## Gold Accents

| Find | Replace |
|------|---------|
| `#C9A84C` | `var(--gold-primary)` |
| `#F5D06A` | `var(--gold-highlight)` |
| `#8B6914` | `var(--gold-shadow)` |
| `linear-gradient(135deg, #C9A84C, #8B6914)` | `var(--gold-gradient)` |

## Borders

| Find | Replace |
|------|---------|
| `rgba(201,168,76,0.25)` | `var(--border-gold)` |
| `rgba(201,168,76,0.5)` | `var(--border-gold-strong)` |
| `rgba(201,168,76,0.12)` | `var(--border-subtle)` |
| `rgba(201,168,76,0.15)` | `var(--border-subtle)` |
| `rgba(201,168,76,0.2)` | `var(--input-border)` |
| `border-gold/20` | `style={{ borderColor: "var(--border-subtle)" }}` |
| `border-gold/30` | `style={{ borderColor: "var(--border-gold)" }}` |

## Other

| Find | Replace |
|------|---------|
| `rgba(255,255,255,0.03)` (input backgrounds) | `var(--input-bg)` |
| `rgba(201,168,76,0.2)` (input borders) | `var(--input-border)` |
| `rgba(201,168,76,0.12)` (box shadows) | `var(--shadow-gold)` |
| `rgba(5,5,5,0.95)` (navbar) | `var(--nav-bg)` |
| `rgba(201,168,76,0.15)` (navbar border) | `var(--nav-border)` |

## Important Exceptions

1. **Hero image overlays** — Keep `rgba(5,5,5,0.65)` or `rgba(5,5,5,0.7)` for hero sections with background images. Do NOT use `var(--hero-overlay)` for hero image overlays so they stay cinematic in both modes.

2. **Footer, Ticker, CTA Banner** — In light mode these stay dark via CSS overrides. Add classes: `footer-section`, `ticker-section`, `cta-banner`.

3. **GoldTextReveal section** — Add class `gold-text-reveal-section`. In light mode it uses `#0f0c05` via override.

4. **Cards in light mode** — Use `var(--bg-card-solid)` for solid card backgrounds (leadership, service, tier cards) in light mode.
