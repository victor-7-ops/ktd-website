# KTD Website — Security Test Cases (OWASP Top 10)

**Project**: KIDZ THESE DAYS (ktd-website)  
**Spec version**: 1.0 — 2026-06-17  
**Scope**: Static Next.js site + contact form (Formspree) + newsletter embed (Mailchimp)

---

## TC-SEC-001 · P1 · A03: XSS — Contact form inputs not reflected unsanitized
**Arrange**: Contact form at `#contact`  
**Act**: Enter `<script>alert('xss')</script>` in name field; submit  
**Assert**: No alert executes; React escapes input on display; no DOM injection

### TC-SEC-002 · P2 · A03: XSS — URL params not reflected
**Arrange**: Navigate to `/?q=<img src=x onerror=alert(1)>`  
**Act**: Observe page  
**Assert**: No alert; no raw HTML injection in DOM

### TC-SEC-003 · P2 · A05: Security headers present
**Arrange**: Fetch page headers from production URL or via Vercel preview  
**Act**: Inspect response headers  
**Assert**:
- `X-Content-Type-Options: nosniff` present
- `X-Frame-Options: DENY` or `Content-Security-Policy: frame-ancestors 'none'` present
- `Referrer-Policy` present

### TC-SEC-004 · P1 · A05: No sensitive env vars exposed client-side
**Arrange**: Open browser devtools → Application → window object  
**Act**: Check `window.__NEXT_DATA__` and page source  
**Assert**: No API keys, secrets, or non-`NEXT_PUBLIC_` env vars present

### TC-SEC-005 · P2 · A08: Subresource integrity for external scripts
**Arrange**: View page source  
**Act**: Find any `<script src="https://...">` tags  
**Assert**: Either absent OR have `integrity` + `crossorigin` attributes

### TC-SEC-006 · P3 · A05: No server version disclosure
**Arrange**: Check response headers  
**Act**: Look for `Server`, `X-Powered-By`  
**Assert**: Neither header reveals server software version (Vercel strips these ✓)

### TC-SEC-007 · P2 · A07: Social links use rel="noopener noreferrer"
**Arrange**: Page loaded  
**Act**: Query all `a[target="_blank"]`  
**Assert**: Every external link has `rel` containing `noopener` AND `noreferrer`

### TC-SEC-008 · P2 · A05: Contact form POST goes only to Formspree
**Arrange**: Open DevTools network panel  
**Act**: Submit contact form with valid data  
**Assert**: Only one POST request fires; URL is `https://formspree.io/*`; no third-party beacons

### TC-SEC-009 · P3 · A09: No console.log of sensitive data in production build
**Arrange**: `npm run build && npm start`; open browser console  
**Act**: Load page; scroll through all sections  
**Assert**: No sensitive data logged (API endpoints, user data, config values)

### TC-SEC-010 · P3 · A05: HTTPS enforced (production)
**Arrange**: Access production URL via HTTP (if applicable)  
**Act**: Observe redirect  
**Assert**: Redirected to HTTPS; HSTS header present
