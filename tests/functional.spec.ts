import { test, expect } from "@playwright/test";

// TC-NAV-001
test("nav links scroll to sections", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  // Only desktop nav links (ul > li > a), skip logo (#top has no section to check)
  const navLinks = page.locator("nav ul a[href^='#']");
  const count = await navLinks.count();
  for (let i = 0; i < count; i++) {
    const href = await navLinks.nth(i).getAttribute("href");
    if (!href) continue;
    const id = href.slice(1);
    if (id === "top") continue;
    await navLinks.nth(i).click();
    // Wait for smooth scroll to settle (up to 2s)
    await page.waitForFunction(
      (sectionId) => {
        const el = document.getElementById(sectionId);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      },
      id,
      { timeout: 2000 }
    );
  }
});

// TC-NAV-003
test("nav is sticky during scroll", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 2000));
  await page.waitForTimeout(300);
  const nav = page.locator("nav").first();
  const box = await nav.boundingBox();
  expect(box?.y).toBeLessThanOrEqual(10); // still at top of viewport
});

// TC-HERO-001 (regression)
test("hero renders without crash", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1[aria-label='KIDZ THESE DAYS']")).toBeAttached();
});

// TC-MEMBERS-001 — each card has an h3 with member name
test("members section renders cards", async ({ page }) => {
  await page.goto("/");
  await page.locator("#members").scrollIntoViewIfNeeded();
  const count = await page.locator("#members h3").count();
  expect(count).toBeGreaterThan(0);
});

// TC-MUSIC-001 — AlbumCarousel renders a focusable div + prev/next buttons
test("music section renders carousel", async ({ page }) => {
  await page.goto("/");
  await page.locator("#music").scrollIntoViewIfNeeded();
  // Carousel container has tabIndex=0; prev/next buttons also present
  const carousel = page.locator("#music [tabindex='0']");
  await expect(carousel.first()).toBeAttached();
  const buttons = await page.locator("#music button").count();
  expect(buttons).toBeGreaterThanOrEqual(2); // prev + next
});

// TC-SHOWS-001
test("shows section renders without crash", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#shows")).toBeAttached();
  // section exists — empty or populated, must not error
  const sectionHeight = await page.locator("#shows").evaluate((el) => el.offsetHeight);
  expect(sectionHeight).toBeGreaterThan(0);
});

// TC-MERCH-001 — each merch card has an h3 with product name
test("merch section renders items", async ({ page }) => {
  await page.goto("/");
  await page.locator("#merch").scrollIntoViewIfNeeded();
  const count = await page.locator("#merch h3").count();
  expect(count).toBeGreaterThan(0);
});

// TC-CONTACT-002
test("contact form client validation — empty submit blocked", async ({ page }) => {
  await page.goto("/");
  await page.locator("#contact button[type='submit']").click();
  // Native validation prevents submit — no network request
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.waitForTimeout(500);
  const formspreeRequests = requests.filter((u) => u.includes("formspree"));
  expect(formspreeRequests).toHaveLength(0);
});

// TC-A11Y-001
test("all images have alt attribute", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  const missing = await page.$$eval(
    "img:not([alt])",
    (imgs) => imgs.map((i) => (i as HTMLImageElement).src)
  );
  expect(missing).toHaveLength(0);
});

// TC-A11Y-002
test("only one h1 on page", async ({ page }) => {
  await page.goto("/");
  const h1s = await page.locator("h1").count();
  expect(h1s).toBe(1);
});

// TC-RESP-001
test("no horizontal overflow at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(390);
});

// TC-SEC-004
test("no server-side env vars in __NEXT_DATA__", async ({ page }) => {
  await page.goto("/");
  const nextData = await page.evaluate(
    () => JSON.stringify((window as Record<string, unknown>).__NEXT_DATA__ ?? {})
  );
  // Should not contain anything that looks like a secret key pattern
  expect(nextData).not.toMatch(/sk[-_][A-Za-z0-9]{20,}/); // Stripe / generic secret key pattern
  expect(nextData).not.toMatch(/password/i);
});

// TC-SEC-007
test("external links have noopener", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  const badLinks = await page.$$eval(
    "a[target='_blank']",
    (links) =>
      links
        .filter((a) => {
          const rel = a.getAttribute("rel") ?? "";
          return !rel.includes("noopener");
        })
        .map((a) => a.href)
  );
  expect(badLinks).toHaveLength(0);
});

// TC-PERF-001
test("page load under 5s (dev)", async ({ page }) => {
  await page.goto("/");
  const timing = await page.evaluate(() => ({
    load: performance.timing.loadEventEnd - performance.timing.navigationStart,
  }));
  expect(timing.load).toBeLessThan(5000);
});
