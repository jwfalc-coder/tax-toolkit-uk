# Tax Toolkit UK — Claude Code Handover Document

> **For Claude Code sessions:** Read this document fully before touching any file. All conventions, decisions and pending tasks are documented here. Do not deviate from established patterns without updating this file.

---

## 1. Project Overview

Tax Toolkit UK is a free UK tax calculator platform. 14 tools across 4 categories, each on a dedicated HTML page, monetised via Google AdSense. It is the second site in a portfolio of AdSense-monetised UK tool sites, built after ClearCost UK.

**Goal:** Generate passive ad revenue as part of the wider passive income system (trading account -> ISA -> Ltd company incorporation).

**Tech stack:** Self-contained static HTML files. No framework. No build step. No external JS dependencies. Shared design system via `styles.css` and `utils.js`. Deployed via GitHub -> Cloudflare Pages.

**Repository:** `https://github.com/jwfalc-coder/tax-toolkit-uk` (private)

**Live URL:** https://taxtoolkit.uk — deployed via Cloudflare Pages (April 2026). DNS managed by Cloudflare.

---

## 2. Repository Structure

```
tax-toolkit-uk/
├── index.html                              # Homepage (reference file)
├── about.html
├── privacy.html
├── contact.html
├── 404.html
├── styles.css                              # Global shared styles and design system
├── utils.js                                # Shared JS utilities, tax helpers, formatters
├── _template.html                          # Blank page scaffold for new tool pages
├── _redirects                              # Cloudflare/Netlify redirects
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

Deliberately different aesthetic from ClearCost UK. Where ClearCost is dark fintech (navy/charcoal), Tax Toolkit is light editorial (warm off-white, deep indigo). The two sites must feel like different products.

### Colour tokens

```css
--bg-base:          #f4f3ef    /* warm off-white page background */
--bg-surface:       #ffffff    /* card and widget backgrounds */
--accent:           #3730a3    /* deep indigo - primary accent */
--accent-hover:     #312e81
--accent-light:     #eef2ff    /* tint for backgrounds and badges */
--text-primary:     #111827
--text-secondary:   #374151
--text-muted:       #6b7280
--success:          #15803d
--error:            #b91c1c
--warning:          #b45309
--border:           #e5e7eb
```

No dark mode. Light only. This is intentional and must not be changed.

### Typography
- Body: Plus Jakarta Sans (Google Fonts)
- Numbers/outputs: JetBrains Mono
- Loaded via `<link rel="preconnect">` + `<link rel="stylesheet">` in `<head>` on every page

### AI design tells — PROHIBITED
- Gradient text on headings
- Gradient logo marks
- Card/panel gradient overlays
- Emoji as UI icons (SVG only)

---

## 4. What Is Complete

### Infrastructure
- [x] `styles.css`, `utils.js`, `_template.html`
- [x] `index.html`, `about.html`, `privacy.html`, `contact.html`, `404.html`
- [x] `robots.txt`, `sitemap.xml`, `_redirects`, `.nojekyll`

### SEO (completed April 2026)
- [x] Canonical tags on all pages (https://taxtoolkit.uk/...)
- [x] OG tags on all pages
- [x] Meta descriptions trimmed to under 160 chars
- [x] Em dashes removed from all pages
- [x] WebSite schema on index.html
- [x] WebPage schema on supporting pages
- [x] WebApplication schema on all tool pages
- [x] Domain set to taxtoolkit.uk throughout (sitemap, robots.txt, canonicals)

### All 14 Tool Pages Built

**Income Tax & Self Assessment (5)**
- `self-assessment-calculator.html` — all income types, employee NI, Class 4 NI, personal allowance taper, PAYE deduction, payments on account, Scotland toggle
- `dividend-tax-calculator.html` — £500 allowance, all three bands, salary stacking
- `cgt-calculator.html` — shares/property/other, £3,000 exempt amount, 18%/24% post-Oct 2024 rates
- `marriage-allowance-calculator.html` — eligibility check, £1,257 transfer, backdated claim table (4 years)
- `tax-code-checker.html` — full code parser (L/M/N/T/K/S/C/BR/D0/D1/NT/0T/W1/M1)

**Business & Freelance (4)**
- `ir35-checker.html` — 8-question questionnaire, weighted scoring, outside/inside/borderline verdict
- `salary-vs-dividends-calculator.html` — three strategy comparison, CT marginal relief, employer NI
- `vat-threshold-calculator.html` — rolling 12-month calculation, Flat Rate Scheme comparison
- `employer-cost-calculator.html` — 15% employer NI from April 2025, Employment Allowance

**Salary Sacrifice & Benefits (3)**
- `salary-sacrifice-calculator.html` — pension/EV/cycle/childcare, tax + NI savings
- `student-loan-calculator.html` — all five plans with 2025/26 thresholds, year-by-year simulation
- `pension-calculator.html` — three contribution methods, annual allowance check, compound growth

**Property & Capital (2)**
- `inheritance-tax-calculator.html` — nil-rate band, RNRB, 7-year gifts, spouse exemption
- `rental-income-tax-calculator.html` — Section 24 rules, marginal rate, Scotland toggle

---

## 5. What Still Needs Doing

### Before AdSense application
- [ ] Cookie consent banner (needs GA4 measurement ID + AdSense publisher ID)
- [ ] GA4 tracking script on all pages (gated behind consent)
- [ ] `ads.txt` in root (needs AdSense publisher ID)
- [ ] Formspree contact form endpoint (replace placeholder in contact.html)
- [ ] Privacy policy update (once AdSense publisher ID confirmed)

### Content
- [x] FAQPage schema -- all 14 tool pages
- [x] BreadcrumbList schema -- all 14 tool pages
- [x] `llms.txt` file in root

### Performance
- [ ] PageSpeed Insights audit after DNS propagation

---

## 6. Deployment

### Cloudflare Pages (live April 2026)
- Repo: `jwfalc-coder/tax-toolkit-uk` connected to Cloudflare Pages
- Build command: `exit 0`
- Build output directory: root `/`
- Custom domain: `taxtoolkit.uk` - DNS managed by Cloudflare
- Auto-deploys on every push to `main`

```
Edit -> git commit -> git push origin main -> Cloudflare auto-deploys
```

---

## 7. File Naming Conventions

- Tool pages: `[descriptor]-calculator.html` or `[descriptor]-checker.html` (kebab-case)
- Supporting pages: `about.html`, `privacy.html`, `contact.html`, `404.html`
- No spaces. No uppercase. No underscores.

---

## 8. Modifying Existing Pages

Use Python `open()`/`write()` for all HTML edits. Never shell heredocs.

```python
with open('filename.html', 'r') as f: src = f.read()
new_src = src.replace('unique_string_to_find', 'replacement_string')
with open('filename.html', 'w') as f: f.write(new_src)
```

Sanity checks before every push:
```python
import re
with open('filename.html') as f: src = f.read()
assert '\u2014' not in src, 'Em dash found'
assert 'lorem ipsum' not in src.lower(), 'Lorem ipsum found'
assert 'TODO' not in src, 'TODO found'
```

---

## 9. Known Issues & Placeholders

| Item | Status |
|------|--------|
| Cookie consent banner | Pending - needs GA + AdSense IDs |
| GA4 tracking script | Pending - needs measurement ID |
| `ads.txt` | Pending - needs AdSense publisher ID |
| Formspree contact form | Pending - needs Formspree account |
| Privacy policy update | Pending - update once AdSense approved |
| FAQPage schema | Not yet added - high SEO priority |
| BreadcrumbList schema | Not yet added |
| `llms.txt` | Not yet created |

---

## 10. Annual Rate Updates (each April)

Update all rate constants in `utils.js` first, then hardcoded values in individual pages:

- Income tax bands and NI thresholds
- Dividend allowance and rates
- CGT exempt amount and rates
- Corporation tax rates
- Student loan plan thresholds
- VAT registration threshold
- Pension annual allowance
- Employment Allowance
- Auto-enrolment qualifying earnings band
- Marriage Allowance transfer amount

**Sources:** gov.uk, hmrc.gov.uk, thepensionsregulator.gov.uk

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
| Marriage Allowance | https://www.gov.uk/marriage-allowance |
