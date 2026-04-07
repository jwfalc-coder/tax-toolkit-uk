# Tax Toolkit UK — Claude Code Handover Document

> **For Claude Code sessions:** Read this document fully before touching any file. All conventions, decisions and pending tasks are documented here. Do not deviate from established patterns without updating this file.

---

## 1. Project Overview

Tax Toolkit UK is a free UK tax calculator platform. 14 tools across 4 categories, each on a dedicated HTML page, monetised via Google AdSense. It is the second site in a portfolio of AdSense-monetised UK tool sites, built after ClearCost UK.

**Goal:** Generate passive ad revenue as part of the wider passive income system (trading account → ISA → Ltd company incorporation).

**Tech stack:** Self-contained static HTML files. No framework. No build step. No external JS dependencies. Shared design system via `styles.css` and `utils.js`. Deployed via GitHub Pages.

**Repository:** `https://github.com/jwfalc-coder/tax-toolkit-uk` (public — required for GitHub Pages free tier)

**Live URL:** `https://jwfalc-coder.github.io/tax-toolkit-uk/` (GitHub Pages, pending custom domain)

---

## 2. Repository Structure

```
tax-toolkit-uk/
├── index.html                              # Homepage (reference file — conventions set here)
├── about.html
├── privacy.html
├── contact.html
├── 404.html
├── styles.css                              # Global shared styles and design system
├── utils.js                                # Shared JS utilities, tax helpers, formatters
├── _template.html                          # Blank page scaffold for new tool pages
├── _redirects                              # Netlify redirects (ready for when domain is live)
├── robots.txt
├── sitemap.xml
│
├── self-assessment-calculator.html         # Income Tax & Self Assessment (5 tools)
├── dividend-tax-calculator.html
├── cgt-calculator.html
├── marriage-allowance-calculator.html
├── tax-code-checker.html
│
├── ir35-checker.html                       # Business & Freelance (4 tools)
├── salary-vs-dividends-calculator.html
├── vat-threshold-calculator.html
├── employer-cost-calculator.html
│
├── salary-sacrifice-calculator.html        # Salary Sacrifice & Benefits (3 tools)
├── student-loan-calculator.html
├── pension-calculator.html
│
├── inheritance-tax-calculator.html         # Property & Capital (2 tools)
└── rental-income-tax-calculator.html
```

**Total: 22 files. 14 tool pages + 4 supporting pages + 4 config/asset files.**

---

## 3. Design System (DO NOT MODIFY WITHOUT GOOD REASON)

This is a deliberately different aesthetic from ClearCost UK. Where ClearCost is dark fintech (navy/charcoal), Tax Toolkit is light editorial (warm off-white, deep indigo). The two sites must feel like different products.

### Colour tokens (CSS custom properties in styles.css)

```css
--bg-base:          #f4f3ef    /* warm off-white page background */
--bg-surface:       #ffffff    /* card and widget backgrounds */
--bg-surface-alt:   #faf9f6    /* subtle alternate surface */
--bg-input:         #f3f2ee    /* input field background */
--accent:           #3730a3    /* deep indigo — primary accent */
--accent-hover:     #312e81
--accent-light:     #eef2ff    /* tint for backgrounds and badges */
--accent-mid:       #6366f1    /* footer logo mark */
--accent-rgb:       55, 48, 163
--text-primary:     #111827
--text-secondary:   #374151
--text-muted:       #6b7280
--text-tertiary:    #9ca3af
--success:          #15803d
--success-bg:       #f0fdf4
--error:            #b91c1c
--error-bg:         #fef2f2
--warning:          #b45309
--warning-bg:       #fffbeb
--border:           #e5e7eb
--border-strong:    #d1d5db
```

No dark mode. No theme toggle. Light only. This is intentional and must not be changed.

### Typography
- Body: Plus Jakarta Sans (Google Fonts)
- Numbers/outputs: JetBrains Mono
- Loaded via `<link rel="preconnect">` + `<link rel="stylesheet">` in `<head>` on every page

### Navigation
- Desktop: logo left, 4 category nav links centre, About CTA right
- Mobile: bottom nav bar with 5 items (Home, Income, Business, Benefits, Property)
- Desktop nav links on tool pages point to `index.html#category-anchor`
- Category anchors in index.html: `#income-tax`, `#business`, `#salary-benefits`, `#property`
- Breadcrumb on every tool page: Home › Category › Tool Name
- `site-nav.scrolled` class added by JS on scroll (adds shadow)

### AI design tells — PROHIBITED
These patterns must never appear anywhere in this codebase:
- Gradient text on headings (no `background-clip: text`)
- Gradient logo marks (solid `--accent` background only)
- Card/panel gradient overlays
- Emoji as UI icons (use Lucide-style inline SVGs only)

### Calculator widget layout
- `.calc-widget` — outer container with `border-radius: var(--radius-xl)`, `box-shadow: var(--shadow-lg)`
- `.calc-header` — indigo header bar with icon + title + subtitle
- `.calc-body` — white body with 28px padding, `display: flex; flex-direction: column; gap: 20px`
- `.results-panel` — hidden by default, shown with `.visible` class after calculation
- `.result-hero` — indigo gradient panel, large JetBrains Mono number, white text
- `.result-breakdown` — bordered table of rows with `.result-row` items
- `.result-value.positive` → green, `.result-value.negative` → red, `.result-value.accent` → indigo

### Page content structure (required for AdSense)
Every tool page must have all five sections in this order:
1. Hero (H1 matching target search query, 150-200 word intro, trust meta items)
2. Calculator widget
3. "How it works" section with numbered steps and rates table
4. "What your results mean" guidance section
5. FAQ (4-6 questions, 400+ words total)
6. Related calculators grid
7. Disclaimer paragraph

---

## 4. What Is Complete

### Infrastructure
- [x] `styles.css` — full design system, all component classes
- [x] `utils.js` — formatters, tax helpers, nav init, FAQ accordion, animations, chart renderers
- [x] `_template.html` — blank scaffold for new tool pages
- [x] `index.html` — homepage with all 14 tools across 4 categories
- [x] `about.html`, `privacy.html`, `contact.html`, `404.html`
- [x] `robots.txt`, `sitemap.xml`, `_redirects`
- [x] `.nojekyll` — required for GitHub Pages to serve static HTML correctly

### All 14 Tool Pages Built

**Income Tax & Self Assessment (5)**
- `self-assessment-calculator.html` — all income types (employment, SE, rental, savings, dividends), employee NI, Class 4 NI, personal allowance taper, PAYE deduction, payments on account logic, Scotland toggle
- `dividend-tax-calculator.html` — £500 allowance, all three bands, salary stacking, live recalculation, contextual band notice
- `cgt-calculator.html` — shares/property/other assets, £3,000 exempt amount, 18%/24% post-Oct 2024 rates, allowable costs, partial exempt amount, basic/higher band split
- `marriage-allowance-calculator.html` — eligibility check with reasons, £1,257 transfer, backdated claim table (4 years), £1,008 potential lump sum
- `tax-code-checker.html` — full code parser (L/M/N/T/K/S/C/BR/D0/D1/NT/0T/W1/M1), allowance calculation, monthly tax estimate, flag badges, action advice

**Business & Freelance (4)**
- `ir35-checker.html` — 8-question guided questionnaire (control, substitution, MOO, financial risk, equipment, integration, exclusivity, hours/location), weighted scoring, outside/inside/borderline verdict with factor breakdown
- `salary-vs-dividends-calculator.html` — three strategy comparison (salary only, optimal £12,570 split, custom), corporation tax marginal relief, employer NI, dividend tax, take-home comparison cards
- `vat-threshold-calculator.html` — rolling 12-month calculation, months to threshold, Flat Rate Scheme comparison, pricing impact notice by customer type
- `employer-cost-calculator.html` — 15% employer NI from April 2025, £5,000 secondary threshold, auto-enrolment on qualifying earnings band, apprenticeship levy, Employment Allowance

**Salary Sacrifice & Benefits (3)**
- `salary-sacrifice-calculator.html` — pension/EV/cycle/childcare schemes, income tax + NI savings, employer NI saving with pass-through option, net cost per £1 sacrificed
- `student-loan-calculator.html` — all five plans (1/2/4/5/postgrad) with 2025/26 thresholds, year-by-year simulation, write-off detection, total repaid, voluntary overpayment warning
- `pension-calculator.html` — three contribution methods (relief at source/net pay/salary sacrifice), annual allowance check, employer match, compound growth projection, effective cost per £1

**Property & Capital (2)**
- `inheritance-tax-calculator.html` — nil-rate band, residence nil-rate band (with taper above £2m), transferred NRB from late spouse, 7-year gifts reducing NRB, spouse exemption mode, net estate after IHT
- `rental-income-tax-calculator.html` — Section 24 rules (no mortgage interest deduction, 20% tax credit), marginal rate calculation, Section 24 higher-rate trap warning, Scotland toggle

---

## 5. What Still Needs Doing

### 5.1 Critical — Required Before AdSense Application

#### Cookie consent banner
Every page needs this before AdSense. A banner must appear on first visit informing users of cookies (AdSense). Must have Accept/Decline. Store preference in `localStorage`.

Implementation approach:
- Inject a `<div id="cookie-banner">` via JS on page load
- On accept: set `localStorage.setItem('ttuk-cookie', 'accepted')` and allow AdSense to load
- On decline: set `localStorage.setItem('ttuk-cookie', 'declined')` and suppress ad scripts
- On subsequent visits: check preference before rendering banner

#### Google AdSense
- `ads.txt` file in root: `google.com, pub-XXXXXXXXXX, DIRECT, f08c47fec0942fa0` (add once publisher ID is issued)
- Ad unit placement on every page: below hero, mid-editorial (between how-it-works and FAQ), above related tools
- Apply immediately once supporting pages are indexed and cookie banner is live
- Expected approval: 2–4 weeks

#### Custom domain
Currently live on `jwfalc-coder.github.io/tax-toolkit-uk/`. Before AdSense approval, set up a custom domain. Options: `taxtoolkituk.co.uk`, `tax-toolkit.co.uk`, or similar.

Once domain is confirmed:
- Update `robots.txt` — uncomment Sitemap line, swap `YOURDOMAIN.co.uk`
- Update `sitemap.xml` — swap all `YOURDOMAIN.co.uk` placeholders (17 occurrences)
- Uncomment `<link rel="canonical">` on every page and add correct URL
- Update Open Graph URL meta tags
- Connect GitHub repo to custom domain in GitHub Pages settings (Settings › Pages › Custom domain)

#### Contact form endpoint
`contact.html` currently intercepts form submission with `preventDefault()`. Before go-live, create a free [Formspree](https://formspree.io) account, get a form endpoint, and add it to the form `action` attribute. Remove the `preventDefault()` JS.

---

### 5.2 SEO — Required for Organic Traffic

#### Canonical tags
Every page has a commented-out canonical tag: `<!-- <link rel="canonical" href=""> add domain before go-live -->`. Once the domain is confirmed, uncomment and populate all of these. It is a find-and-replace task across all HTML files.

#### Open Graph / social tags
Every page has `og:title` and `og:description` already. Add `og:url` once domain is confirmed. Check all `og:description` values are 150–160 characters and keyword-rich.

#### FAQPage schema
Every tool page has an FAQ section. Add `application/ld+json` schema to each:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer text"
      }
    }
  ]
}
```
This is a high-priority SEO task — FAQ schema frequently generates rich results in Google for tax queries.

#### BreadcrumbList schema
Add to every tool page alongside the existing breadcrumb HTML nav:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://DOMAIN/"},
    {"@type": "ListItem", "position": 2, "name": "Category", "item": "https://DOMAIN/#anchor"},
    {"@type": "ListItem", "position": 3, "name": "Tool Name"}
  ]
}
```

#### WebSite schema (homepage only)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Tax Toolkit UK",
  "url": "https://DOMAIN/",
  "description": "Free UK tax calculators for 2025/26"
}
```

#### llms.txt
Create a `llms.txt` in the repo root listing all 14 tools — helps AI crawlers index the site correctly. See ClearCost UK's llms.txt for the format.

#### Meta tags audit
All pages have `<title>` and `<meta name="description">`. Audit against:
- Title: `[Tool Name] UK 2025/26 | Tax Toolkit UK` — under 60 characters
- Description: 150–160 characters, keyword-rich, includes year
- No duplicates

---

### 5.3 Performance

#### Core Web Vitals audit
After deployment on custom domain, run every page through PageSpeed Insights. Target LCP < 2.5s, CLS < 0.1, INP < 200ms.

Current risk areas:
- Google Fonts loading (already has `preconnect` — should pass)
- No images anywhere on the site (CLS risk is minimal)
- All JS inline or in utils.js, no render-blocking scripts

#### Favicon
Add to every page `<head>`:
```html
<link rel="icon" type="image/png" href="/favicon.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```
Create a simple 32×32 favicon: solid indigo square (`#3730a3`) with a small white document icon or "TT" text.

---

### 5.4 Ongoing / Repeating Tasks

#### Annual (each April — new tax year)
All rates in the following files must be verified and updated against HMRC's published figures:

- `utils.js` — `TAX_BANDS_ENGLAND`, `TAX_BANDS_SCOTLAND`, `calcEmployeeNI()`, `calcEmployerNI()`, `calcClass4NI()`, `calcDividendTax()`, `calcCGT()` — all rate constants
- `self-assessment-calculator.html` — payments on account threshold (£1,000), NI rates
- `dividend-tax-calculator.html` — £500 dividend allowance, band rates (8.75%/33.75%/39.35%)
- `cgt-calculator.html` — £3,000 exempt amount, 18%/24% rates
- `marriage-allowance-calculator.html` — personal allowance (£12,570), transfer amount (£1,257), £252 saving
- `tax-code-checker.html` — standard code (1257L), personal allowance
- `salary-vs-dividends-calculator.html` — optimal salary figure, corporation tax rates, dividend tax
- `salary-sacrifice-calculator.html` — NI rates and thresholds
- `student-loan-calculator.html` — all 5 plan thresholds (Plans 1/2/4/5/PG), rates in `PLANS` object
- `pension-calculator.html` — £60,000 annual allowance, tax relief rates
- `inheritance-tax-calculator.html` — nil-rate band (£325,000), RNRB (£175,000), £2m taper threshold
- `rental-income-tax-calculator.html` — income tax bands (via utils.js)
- `employer-cost-calculator.html` — employer NI rate (15%), secondary threshold (£5,000), auto-enrolment qualifying earnings band (£6,240–£50,270), Employment Allowance (£10,500)
- `vat-threshold-calculator.html` — registration threshold (£90,000), deregistration threshold (£88,000)

**Process:** Check gov.uk/hmrc.gov.uk for updated rates in the Autumn Statement and Spring Budget. Update `utils.js` first (all shared functions), then update any hardcoded values in individual tool pages. Batch commit as "Update to [year]/[year+1] tax year rates".

Update the `sitemap.xml` `<lastmod>` dates and "Updated for [year]" eyebrow badges on all pages.

#### Quarterly (January, April, July, October)
No quarterly rate-sensitive tools in this site. All tools use annual tax rates which change once per year.

#### Monthly (ongoing monitoring)
- **Google Search Console:** Impressions, clicks, average position, coverage errors, keyword opportunities
- **Google Analytics (once set up):** Sessions per page, bounce rate, time on page, top-performing tools
- **AdSense RPM:** UK tax tools should achieve £10–£20 RPM. Below £5 suggests content improvement needed.
- **Broken links:** Check all internal links and related tool cross-links still resolve

#### Ad hoc (as needed)
- **New tool addition:** Follow `_template.html` exactly. Add to: `index.html` tool grid, `sitemap.xml`, `llms.txt`, cross-link from 3–4 related tools. Update the tool count in `index.html` hero ("14 free calculators").
- **Schema validation:** After adding structured data, validate via Google Rich Results Test.

---

## 6. Tax Rates Reference (2025/26)

All rates used in the calculators. Verify these each April.

### Income tax — England, Wales, Northern Ireland

| Band | Income | Rate |
|------|--------|------|
| Personal allowance | Up to £12,570 | 0% |
| Basic rate | £12,571–£50,270 | 20% |
| Higher rate | £50,271–£125,140 | 40% |
| Additional rate | Over £125,140 | 45% |

Personal allowance tapers by £1 for every £2 over £100,000. Nil at £125,140.

### Income tax — Scotland

| Band | Income | Rate |
|------|--------|------|
| Personal allowance | Up to £12,570 | 0% |
| Starter | £12,571–£14,876 | 19% |
| Basic | £14,877–£26,561 | 20% |
| Intermediate | £26,562–£43,662 | 21% |
| Higher | £43,663–£75,000 | 42% |
| Advanced | £75,001–£125,140 | 45% |
| Top | Over £125,140 | 48% |

### National Insurance

| Class | Threshold | Rate |
|-------|-----------|------|
| Employee (Class 1) | £12,570–£50,270 | 8% |
| Employee (Class 1) | Above £50,270 | 2% |
| Employer (Class 1) | Above £5,000 | 15% |
| Self-employed (Class 4) | £12,570–£50,270 | 6% |
| Self-employed (Class 4) | Above £50,270 | 2% |

### Dividend tax

| Band | Rate |
|------|------|
| Allowance | £500 (first £500 tax-free) |
| Basic rate | 8.75% |
| Higher rate | 33.75% |
| Additional rate | 39.35% |

### Capital Gains Tax

| Item | Value |
|------|-------|
| Annual exempt amount | £3,000 |
| Basic rate | 18% |
| Higher/additional rate | 24% |
| (Both rates apply to all assets including residential property from Oct 2024) | |

### Corporation tax

| Profit | Rate |
|--------|------|
| Up to £50,000 | 19% |
| £50,001–£250,000 | Marginal relief (~26.5% effective) |
| Over £250,000 | 25% |

### Inheritance tax

| Item | Value |
|------|-------|
| Nil-rate band | £325,000 |
| Residence nil-rate band | £175,000 |
| RNRB taper | £1 per £2 above £2,000,000 |
| Rate above threshold | 40% |
| Spouse exemption | Unlimited |

### Student loan thresholds

| Plan | Annual threshold | Rate | Write-off |
|------|-----------------|------|-----------|
| Plan 1 | £24,990 | 9% | 25 years / age 65 |
| Plan 2 | £27,295 | 9% | 30 years |
| Plan 4 | £31,395 | 9% | 30 years / age 65 |
| Plan 5 | £25,000 | 9% | 40 years |
| Postgraduate | £21,000 | 6% | 30 years |

### Other

| Item | Value |
|------|-------|
| VAT registration threshold | £90,000 |
| VAT deregistration threshold | £88,000 |
| Pension annual allowance | £60,000 |
| Employment Allowance | £10,500 |
| Auto-enrolment qualifying earnings | £6,240–£50,270 |
| Minimum employer pension contribution | 3% |
| Marriage Allowance transfer | £1,257 (10% of PA) |
| Marriage Allowance saving | £252 (20% of £1,257) |

---

## 7. Deployment

### Current setup
GitHub Pages serves the site directly from the `main` branch root. Push to `main` and the site updates within ~60 seconds.

```
Local edit → git commit → git push origin main → GitHub Pages auto-deploys
```

### Moving to custom domain (when ready)
1. Purchase domain (e.g. `taxtoolkituk.co.uk`)
2. In GitHub repo: Settings › Pages › Custom domain — enter domain
3. At DNS provider: add CNAME record pointing to `jwfalc-coder.github.io`
4. GitHub auto-provisions HTTPS (Let's Encrypt)
5. Update all `YOURDOMAIN.co.uk` placeholders in `robots.txt`, `sitemap.xml`, canonical tags, OG URL tags

### Environment variables
None required. All logic is client-side. No API keys or secrets in this codebase.

---

## 8. File Naming Conventions

- Tool pages: `[descriptor]-calculator.html` or `[descriptor]-checker.html` (kebab-case)
- Supporting pages: `about.html`, `privacy.html`, `contact.html`, `404.html`
- No spaces. No uppercase. No underscores.

---

## 9. Modifying Existing Pages

### Safe editing of large files
Python-based string replacement is more reliable than `str_replace` for large HTML files:

```python
with open('filename.html', 'r') as f: src = f.read()
new_src = src.replace('unique_string_to_find', 'replacement_string')
with open('filename.html', 'w') as f: f.write(new_src)
```

Use unique anchor strings rather than closing `</div>` tags which may appear multiple times.

### Batch rate updates
When updating for a new tax year:
1. Update `utils.js` first — all shared tax functions are here
2. Then update hardcoded values in individual pages using a Python batch script
3. Single git commit: "Update to 2026/27 tax year rates"

---

## 10. Known Issues and Placeholders

| Item | Location | Status |
|------|----------|--------|
| Custom domain | All pages (canonical, sitemap, robots) | Pending domain purchase |
| Formspree endpoint | `contact.html` form action | Add Formspree ID before go-live |
| Privacy policy — AdSense ID | `privacy.html` | Update once AdSense publisher ID issued |
| Favicon | All pages | Create 32×32 PNG once domain/branding finalised |
| Cookie consent banner | All pages | Build once AdSense publisher ID confirmed |
| `ads.txt` | Root | Add once AdSense publisher ID issued |
| Canonical tags | All pages (commented out) | Uncomment and populate once domain confirmed |
| Sitemap domain | `sitemap.xml` (17 occurrences) | Replace `YOURDOMAIN.co.uk` once domain confirmed |
| robots.txt sitemap line | `robots.txt` | Uncomment and populate once domain confirmed |
| FAQPage schema | All 14 tool pages | Not yet added — high SEO priority |
| BreadcrumbList schema | All 14 tool pages | Not yet added |
| WebSite schema | `index.html` | Not yet added |
| llms.txt | Root | Not yet created |
| GA4 tracking | All pages | Add once cookie consent banner is built |

---

## 11. Rate Sources

| Data type | Source |
|-----------|--------|
| Income tax / NI rates | https://www.gov.uk/income-tax-rates |
| Scottish income tax | https://www.gov.uk/scottish-income-tax |
| Dividend tax | https://www.gov.uk/tax-on-dividends |
| Capital Gains Tax | https://www.gov.uk/capital-gains-tax/rates |
| Corporation tax | https://www.gov.uk/corporation-tax-rates |
| Student loan thresholds | https://www.gov.uk/repaying-your-student-loan/what-you-pay |
| VAT threshold | https://www.gov.uk/vat-registration/when-to-register |
| Inheritance tax | https://www.gov.uk/inheritance-tax |
| Pension annual allowance | https://www.gov.uk/tax-on-your-private-pension/annual-allowance |
| Employment Allowance | https://www.gov.uk/claim-employment-allowance |
| Auto-enrolment | https://www.thepensionsregulator.gov.uk/en/employers |
| Employer NI | https://www.gov.uk/employers-national-insurance |
| Marriage Allowance | https://www.gov.uk/marriage-allowance |
