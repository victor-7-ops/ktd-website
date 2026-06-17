# KTD Website — Functional Test Cases

**Project**: KIDZ THESE DAYS (ktd-website)  
**Spec version**: 1.0 — 2026-06-17  
**Coverage**: All 11 sections, nav, performance, accessibility basics

Priority scale: P0 = blocker | P1 = critical | P2 = high | P3 = medium | P4 = low

---

## TC-NAV — Navigation

### TC-NAV-001 · P1 · Nav links scroll to correct sections
**Arrange**: Desktop viewport 1440×900, page loaded at `/`  
**Act**: Click each nav link (About, Members, Music, Shows, Merch, Contact)  
**Assert**: Page scrolls so matching `#id` section is visible in viewport within 1 s

### TC-NAV-002 · P2 · Mobile nav opens/closes
**Arrange**: Viewport 390×844 (iPhone 14)  
**Act**: Tap hamburger icon → verify menu opens; tap again or tap overlay  
**Assert**: Menu toggles open/closed; no overflow beyond viewport width

### TC-NAV-003 · P2 · Nav is sticky during scroll
**Arrange**: Desktop 1440×900  
**Act**: Scroll page to 2000 px  
**Assert**: Nav bar remains fixed at top of viewport

### TC-NAV-004 · P3 · No dead hash links
**Arrange**: Page loaded  
**Act**: Query all `a[href="#"]`  
**Assert**: Count === 0  (already in smoke suite — keep as regression)

---

## TC-HERO — Hero Section

### TC-HERO-001 · P0 · Hero renders without crash
**Arrange**: Desktop 1440×900  
**Act**: Navigate to `/`; wait for `DOMContentLoaded`  
**Assert**: `h1[aria-label='KIDZ THESE DAYS']` is attached

### TC-HERO-002 · P1 · Video plays on desktop
**Arrange**: Desktop 1440×900, motion not reduced  
**Act**: Navigate to `/`; wait 4 s  
**Assert**: `video` element exists; `video.readyState >= 3` (HAVE_FUTURE_DATA)

### TC-HERO-003 · P1 · 3D fallback loads on mobile (no video)
**Arrange**: Viewport 390×844  
**Act**: Navigate to `/`; wait 3 s  
**Assert**: `canvas` element is attached (React Three Fiber rendered)

### TC-HERO-004 · P2 · Reduced motion shows static amber wash
**Arrange**: Enable `prefers-reduced-motion: reduce` via `page.emulateMedia`  
**Act**: Navigate to `/`  
**Assert**: No `<video>` autoplay; no `<canvas>`; hero section has amber background visible

### TC-HERO-005 · P2 · Hero CTA button present and clickable
**Arrange**: Desktop, page loaded  
**Act**: Locate CTA button in hero, click it  
**Assert**: Page scrolls or navigates to target section without JS error

---

## TC-ABOUT — About Section

### TC-ABOUT-001 · P2 · Section renders with heading
**Arrange**: Page loaded  
**Act**: Scroll to `#about`  
**Assert**: Section heading contains text (non-empty)

### TC-ABOUT-002 · P3 · Bio text is readable (contrast)
**Arrange**: Desktop  
**Act**: Inspect body text color vs background  
**Assert**: Text uses `var(--warm-white)` or `var(--amber)`, not `#fff` or pure black

---

## TC-MEMBERS — Members Section

### TC-MEMBERS-001 · P1 · All members render
**Arrange**: Page loaded; `lib/data/members.ts` count = N  
**Act**: Scroll to `#members`; count member cards  
**Assert**: Card count === N

### TC-MEMBERS-002 · P2 · Member cards show name and role
**Arrange**: `#members` section visible  
**Act**: Inspect first member card  
**Assert**: Name and role text both non-empty

### TC-MEMBERS-003 · P3 · Member images load (no broken img)
**Arrange**: `#members` visible  
**Act**: Get all `<img>` inside `#members`; check `naturalWidth > 0`  
**Assert**: All images loaded (no broken src)

---

## TC-MUSIC — Music / Discography Section

### TC-MUSIC-001 · P1 · Discography items render
**Arrange**: Page loaded  
**Act**: Scroll to `#music`; count release cards  
**Assert**: Count ≥ 1

### TC-MUSIC-002 · P2 · Play/link buttons present on each release
**Arrange**: `#music` visible  
**Act**: Inspect each release card for interactive element (link or button)  
**Assert**: Every card has ≥ 1 interactive element

### TC-MUSIC-003 · P3 · Release titles non-empty
**Arrange**: `#music` visible  
**Act**: Read text content of each release title element  
**Assert**: No empty strings

---

## TC-ACHIEVE — Achievements Section

### TC-ACHIEVE-001 · P2 · Achievement items render
**Arrange**: Page loaded  
**Act**: Scroll to `#achievements`; count items  
**Assert**: Count ≥ 1

### TC-ACHIEVE-002 · P3 · Numbers / stats visible
**Arrange**: `#achievements` visible  
**Act**: Locate stat figures (big numbers)  
**Assert**: Text matches numeric pattern (digits / commas)

---

## TC-MEDIA — Media Section

### TC-MEDIA-001 · P1 · Media embeds or thumbnails render
**Arrange**: Page loaded  
**Act**: Scroll to `#media`  
**Assert**: ≥ 1 image, iframe, or video element inside `#media`

### TC-MEDIA-002 · P2 · No CORS / mixed-content console errors from embeds
**Arrange**: Capture console errors  
**Act**: Scroll to `#media`, wait 2 s  
**Assert**: Zero errors containing "blocked" or "CORS"

---

## TC-SHOWS — Shows / Tour Section

### TC-SHOWS-001 · P1 · Shows list renders
**Arrange**: Page loaded  
**Act**: Scroll to `#shows`; count show items  
**Assert**: Count ≥ 0 (empty state must render gracefully, not crash)

### TC-SHOWS-002 · P2 · Ticket links present when shows exist
**Arrange**: `lib/data/shows.ts` has ≥ 1 entry  
**Act**: Locate ticket links inside `#shows`  
**Assert**: Links have `href` pointing to non-empty external URL

### TC-SHOWS-003 · P3 · Empty state message shown when no shows
**Arrange**: `lib/data/shows.ts` is empty []  
**Act**: View `#shows`  
**Assert**: Fallback "no upcoming shows" text visible (not blank)

---

## TC-MERCH — Merch Section

### TC-MERCH-001 · P1 · Merch items render
**Arrange**: Page loaded  
**Act**: Scroll to `#merch`; count merch cards  
**Assert**: Count ≥ 1

### TC-MERCH-002 · P2 · Merch images load
**Arrange**: `#merch` visible  
**Act**: Check `<img>` naturalWidth inside `#merch`  
**Assert**: All > 0

### TC-MERCH-003 · P3 · Price / label text present
**Arrange**: `#merch` visible  
**Act**: Inspect first merch card for price text  
**Assert**: Non-empty (number or "FREE")

---

## TC-SOCIAL — Social Section

### TC-SOCIAL-001 · P2 · Social links present
**Arrange**: `#social` visible  
**Act**: Count social icon links  
**Assert**: Count ≥ 1

### TC-SOCIAL-002 · P2 · Social links open in new tab
**Arrange**: Inspect `<a>` inside `#social`  
**Act**: Check `target` attribute  
**Assert**: `target="_blank"` + `rel` contains `noopener`

### TC-SOCIAL-003 · P3 · Newsletter embed renders (if configured)
**Arrange**: `NEXT_PUBLIC_MAILCHIMP_URL` is set  
**Act**: View `#social`  
**Assert**: Mailchimp iframe or form present

---

## TC-CONTACT — Contact Form

### TC-CONTACT-001 · P0 · Form fields render
**Arrange**: Page loaded (already in smoke suite)  
**Act**: Locate `#contact` form fields  
**Assert**: name, email, message inputs + submit button all attached

### TC-CONTACT-002 · P1 · Client-side validation — empty submit
**Arrange**: `#contact` section visible  
**Act**: Click submit without filling any field  
**Assert**: Browser shows native validation or custom error; no network request fired

### TC-CONTACT-003 · P1 · Client-side validation — invalid email
**Arrange**: Fill name; fill invalid email (`notanemail`); fill message  
**Act**: Submit form  
**Assert**: Email field shows validation error; form not submitted

### TC-CONTACT-004 · P1 · Successful submission feedback
**Arrange**: `NEXT_PUBLIC_FORMSPREE_ID` set; fill all valid fields  
**Act**: Submit form  
**Assert**: Success message visible; no JS error; form resets or disabled

### TC-CONTACT-005 · P2 · Form accessible via keyboard
**Arrange**: Page loaded  
**Act**: Tab through form fields; press Enter on submit  
**Assert**: All fields reachable by keyboard; focus ring visible

---

## TC-STORY — Story / StoryMap Section

### TC-STORY-001 · P2 · Section renders
**Arrange**: Page loaded  
**Act**: Scroll to `#story`  
**Assert**: Section heading and content visible

### TC-STORY-002 · P3 · Timeline items in order
**Arrange**: `#story` visible  
**Act**: Read year/date text from each timeline item  
**Assert**: Dates are ascending (or correct chronological order per data)

---

## TC-PERF — Performance

### TC-PERF-001 · P1 · Page load < 5 s (dev server)
**Arrange**: Fresh page load, dev server running  
**Act**: `performance.timing` — measure `loadEventEnd - navigationStart`  
**Assert**: < 5000 ms

### TC-PERF-002 · P2 · No layout shift > 0.1 CLS (prod build)
**Arrange**: Production build (`npm run build && npm start`)  
**Act**: Load page with Playwright; measure CLS via `PerformanceObserver`  
**Assert**: CLS score < 0.1

### TC-PERF-003 · P2 · Hero video does not block interactivity
**Arrange**: Desktop, dev server  
**Act**: Navigate to `/`; measure TTI  
**Assert**: Interactive within 3 s (video loads async, does not block)

---

## TC-A11Y — Accessibility

### TC-A11Y-001 · P1 · All images have alt text
**Arrange**: Page loaded  
**Act**: Query `img:not([alt])` and `img[alt=""]`  
**Assert**: Count = 0 (decorative imgs use `alt=""` intentionally — count those separately)

### TC-A11Y-002 · P1 · Heading hierarchy valid
**Arrange**: Page loaded  
**Act**: Collect all heading tags; verify order (h1 → h2 → h3, no skips)  
**Assert**: Only 1 h1 (`KIDZ THESE DAYS`); h2s appear before h3s

### TC-A11Y-003 · P2 · Colour contrast for body text
**Arrange**: Check `--warm-white` (#F0EDE6) on `--base` (#0A0A0F)  
**Act**: Calculate contrast ratio  
**Assert**: Ratio ≥ 7:1 (WCAG AA large, AAA normal text) — expected ~16:1 ✓

### TC-A11Y-004 · P2 · Custom cursor hidden on touch devices
**Arrange**: Set `pointer: coarse` via `page.emulateMedia`  
**Act**: Load page  
**Assert**: `.custom-cursor` element is `display: none` or has `opacity: 0`

### TC-A11Y-005 · P3 · Keyboard focus ring visible
**Arrange**: Tab through interactive elements  
**Act**: Observe focus ring CSS (`:focus-visible`)  
**Assert**: Focus ring present and ≥ 2 px outline

---

## TC-RESP — Responsive / Cross-Viewport

### TC-RESP-001 · P1 · No horizontal overflow at 390 px
**Arrange**: Viewport 390×844  
**Act**: Load page; check `document.documentElement.scrollWidth`  
**Assert**: scrollWidth ≤ 390

### TC-RESP-002 · P2 · All sections visible at 768 px (tablet)
**Arrange**: Viewport 768×1024  
**Act**: Scroll through page; check each section ID attached  
**Assert**: All 11 `#id` selectors attached and `offsetHeight > 0`

### TC-RESP-003 · P2 · Text does not overflow cards at 390 px
**Arrange**: Viewport 390×844  
**Act**: Inspect member cards, merch cards, show items  
**Assert**: No `overflow: hidden` clipping of meaningful text; no text wider than container
