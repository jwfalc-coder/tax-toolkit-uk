# Tax Toolkit UK — Claude Code Handover Document

> **For Claude Code sessions:** Read this document fully before touching any file. All conventions, decisions and pending tasks are documented here. Do not deviate from established patterns without updating this file.

---

## 1. Project Overview

Tax Toolkit UK is a free UK tax calculator platform. 14 tools across 4 categories, monetised via Google AdSense. Second site in the portfolio.

**Tech stack:** Self-contained static HTML files. No framework. No build step. Deployed via GitHub -> Cloudflare Pages.

**Repository:** `https://github.com/jwfalc-coder/tax-toolkit-uk` (private)

**Live URL:** https://taxtoolkit.uk -- deployed via Cloudflare Pages (April 2026). DNS managed by Cloudflare.

---

## 2. Current Status (as of 18 April 2026)

- All 18 HTML pages live at taxtoolkit.uk
- Cloudflare Pages auto-deploys on push to main
- Google Analytics 4 (G-NDJM8GSFTM) installed -- gated behind custom cookie consent banner (key: tt-cookie)
- Custom cookie consent banner active -- Accept/Decline, gates GA
- Formspree contact form live (mjgjwgwg)
- Email routing: hello@taxtoolkit.uk -> personal inbox via Cloudflare
- AdSense: NOT YET APPLIED -- pending ClearCost approval first
- Search Console: submit sitemap https://taxtoolkit.uk/sitemap.xml once property verified

---

## 3. Design System (DO NOT MODIFY WITHOUT GOOD REASON)

Light editorial aesthetic -- warm off-white, deep indigo. Deliberately different from ClearCost.

```css
--bg-base:    #f4f3ef   /* warm off-white */
--bg-surface: #ffffff
--accent:     #3730a3   /* deep indigo */
--text-primary: #111827
--text-secondary: #374151
--text-muted: #6b7280
--border:     #e5e7eb
```

No dark mode. Light only. This is intentional.

**Typography:** Plus Jakarta Sans + JetBrains Mono (loaded via non-blocking link tags with preconnect -- @import removed from styles.css)

**AI design tells -- PROHIBITED:** gradient text, gradient logos, emoji icons, em dashes

---

## 4. SEO Status (completed April 2026)

- [x] Canonical tags -- all 18 pages (https://taxtoolkit.uk/...)
- [x] OG tags -- all pages
- [x] Meta descriptions trimmed
- [x] Em dashes removed
- [x] FAQPage schema -- all 14 tool pages
- [x] BreadcrumbList schema -- all 14 tool pages
- [x] WebSite/WebPage/WebApplication schema
- [x] sitemap.xml -- lastmod 2026-04-17
- [x] robots.txt -- clean
- [x] llms.txt
- [x] Google Fonts render blocking fixed

---

## 5. Tax Year Rates (2026/27 -- updated April 2026)

- Dividend tax: 10.75% basic, 35.75% higher, 39.35% additional
- Student loan Plan 1: £26,900 | Plan 2: £29,385 | Plan 4: £33,795 | Plan 5: £25,000 (first repayments)
- All income tax bands, NI, personal allowance: unchanged from 2025/26
- All year label references updated to 2026/27

---

## 6. What Still Needs Doing

- [ ] AdSense application -- pending ClearCost approval first
- [ ] ads.txt -- add once publisher ID issued
- [ ] Privacy policy update -- update once AdSense approved
- [ ] Replace cookie banner with Google CMP once AdSense approved
- [ ] FAQPage schema -- already added to all 14 tool pages
- [ ] BreadcrumbList schema -- already added

---

## 7. Deployment

```
Edit -> git commit -> git push origin main -> Cloudflare auto-deploys
```

Build command: `exit 0` | Output directory: root `/`

---

## 8. Annual Rate Updates (each April)

Update in utils.js first, then individual pages:
- Income tax bands and NI thresholds
- Dividend allowance and rates
- CGT exempt amount and rates
- Corporation tax rates
- Student loan plan thresholds
- VAT registration threshold
- Pension annual allowance
- Employment Allowance
- Marriage Allowance transfer amount
- All year label references

---

## 9. File Writing Conventions

Use Python `open()`/`write()` -- never shell heredocs.
Scan before every push: no em dashes, no lorem ipsum, no TODO, no YOURDOMAIN.
