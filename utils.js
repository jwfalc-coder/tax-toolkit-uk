/* ============================================================
   TAX TOOLKIT UK — Global Utilities (utils.js)
   Shared formatting, nav behaviour, chart helpers, FAQ, animations
   ============================================================ */

'use strict';

/* ============================================================
   CURRENCY & NUMBER FORMATTERS
   ============================================================ */

/**
 * Format a number as UK sterling: £1,234.56
 * @param {number} n
 * @param {number} [decimals=2]
 */
function formatCurrency(n, decimals = 2) {
  if (isNaN(n) || n === null || n === undefined) return '£0.00';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

/**
 * Format a number as UK sterling, no pence (for large values): £12,345
 * @param {number} n
 */
function formatCurrencyWhole(n) {
  return formatCurrency(n, 0);
}

/**
 * Format as a percentage string: 23.5%
 * @param {number} n - value as a percentage (e.g. 23.5 not 0.235)
 * @param {number} [decimals=1]
 */
function formatPercent(n, decimals = 1) {
  if (isNaN(n)) return '0%';
  return n.toFixed(decimals) + '%';
}

/**
 * Format a plain number with thousand separators: 1,234,567
 * @param {number} n
 * @param {number} [decimals=0]
 */
function formatNumber(n, decimals = 0) {
  if (isNaN(n)) return '0';
  return new Intl.NumberFormat('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

/**
 * Parse a currency/number input string to float (strips £, commas, spaces)
 * @param {string} str
 */
function parseCurrency(str) {
  if (typeof str !== 'string') str = String(str);
  const cleaned = str.replace(/[£,\s]/g, '');
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}

/**
 * Clamp a number between min and max
 */
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Round to n decimal places
 */
function round(val, dp = 2) {
  return Math.round(val * Math.pow(10, dp)) / Math.pow(10, dp);
}


/* ============================================================
   UK TAX HELPERS — 2025/26
   ============================================================ */

const TAX_YEAR = '2025/26';

const TAX_BANDS_ENGLAND = [
  { name: 'Personal allowance', min: 0,      max: 12570,  rate: 0.00 },
  { name: 'Basic rate',         min: 12570,  max: 50270,  rate: 0.20 },
  { name: 'Higher rate',        min: 50270,  max: 125140, rate: 0.40 },
  { name: 'Additional rate',    min: 125140, max: Infinity, rate: 0.45 },
];

const TAX_BANDS_SCOTLAND = [
  { name: 'Personal allowance', min: 0,      max: 12570,  rate: 0.00 },
  { name: 'Starter rate',       min: 12570,  max: 14876,  rate: 0.19 },
  { name: 'Basic rate',         min: 14876,  max: 26561,  rate: 0.20 },
  { name: 'Intermediate rate',  min: 26561,  max: 43662,  rate: 0.21 },
  { name: 'Higher rate',        min: 43662,  max: 75000,  rate: 0.42 },
  { name: 'Advanced rate',      min: 75000,  max: 125140, rate: 0.45 },
  { name: 'Top rate',           min: 125140, max: Infinity, rate: 0.48 },
];

/**
 * Calculate adjusted personal allowance (tapered above £100k)
 * @param {number} income
 */
function getPersonalAllowance(income) {
  const BASE_PA = 12570;
  if (income <= 100000) return BASE_PA;
  const taper = Math.floor((income - 100000) / 2);
  return Math.max(0, BASE_PA - taper);
}

/**
 * Calculate income tax for a given gross income (England/Wales/NI)
 * Returns an object with { totalTax, effectiveRate, bands[] }
 * @param {number} income
 * @param {boolean} [scotland=false]
 */
function calcIncomeTax(income, scotland = false) {
  const pa = getPersonalAllowance(income);
  const taxableIncome = Math.max(0, income - pa);
  const bands = scotland ? TAX_BANDS_SCOTLAND : TAX_BANDS_ENGLAND;

  let totalTax = 0;
  const breakdown = [];

  // Build adjusted bands with PA taken into account
  const adjustedBands = bands.map(b => ({
    ...b,
    min: Math.max(0, b.min - pa),
    max: b.max === Infinity ? Infinity : Math.max(0, b.max - pa),
  })).filter(b => b.rate > 0);

  adjustedBands.forEach(band => {
    if (taxableIncome <= band.min) return;
    const bandIncome = Math.min(taxableIncome, band.max) - band.min;
    if (bandIncome <= 0) return;
    const tax = bandIncome * band.rate;
    totalTax += tax;
    breakdown.push({
      name: band.name,
      income: bandIncome,
      rate: band.rate,
      tax,
    });
  });

  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;
  return { totalTax, effectiveRate, breakdown, personalAllowance: pa };
}

/**
 * Calculate employee NI (Class 1) for 2025/26
 * @param {number} grossSalary
 */
function calcEmployeeNI(grossSalary) {
  const PT = 12570;  // Primary threshold
  const UEL = 50270; // Upper earnings limit
  let ni = 0;
  if (grossSalary > PT) {
    const mainBand = Math.min(grossSalary, UEL) - PT;
    ni += mainBand * 0.08;
  }
  if (grossSalary > UEL) {
    ni += (grossSalary - UEL) * 0.02;
  }
  return Math.max(0, ni);
}

/**
 * Calculate employer NI (Class 1) for 2025/26
 * Secondary threshold: £5,000/year
 * @param {number} grossSalary
 */
function calcEmployerNI(grossSalary) {
  const ST = 5000;
  if (grossSalary <= ST) return 0;
  return (grossSalary - ST) * 0.15;
}

/**
 * Calculate Class 4 NI (self-employed) for 2025/26
 * @param {number} profit
 */
function calcClass4NI(profit) {
  const LPL = 12570;
  const UPL = 50270;
  let ni = 0;
  if (profit > LPL) {
    ni += (Math.min(profit, UPL) - LPL) * 0.06;
  }
  if (profit > UPL) {
    ni += (profit - UPL) * 0.02;
  }
  return Math.max(0, ni);
}

/**
 * Calculate dividend tax for 2025/26
 * Requires knowing the taxpayer's income tax band
 * @param {number} dividends - gross dividend income
 * @param {number} otherIncome - employment/self-employment income
 * @param {boolean} scotland
 */
function calcDividendTax(dividends, otherIncome, scotland = false) {
  const ALLOWANCE = 500;
  const taxableDiv = Math.max(0, dividends - ALLOWANCE);
  if (taxableDiv <= 0) return { tax: 0, breakdown: [] };

  // Determine where dividends sit in the tax bands
  const pa = getPersonalAllowance(otherIncome + dividends);
  const taxableOther = Math.max(0, otherIncome - pa);

  // Dividend tax rates (same regardless of Scottish income tax residency — dividends are UK-wide)
  const BASIC_LIMIT = 50270 - Math.max(0, otherIncome - pa) - pa;
  const HIGHER_LIMIT = 125140;

  let tax = 0;
  const breakdown = [];
  let remaining = taxableDiv;

  // How much basic rate band is left after other income?
  const basicBandUsed = Math.max(0, Math.min(taxableOther, 37700)); // 50270 - 12570
  const basicBandLeft = Math.max(0, 37700 - basicBandUsed);

  // Dividends at basic rate (8.75%)
  const atBasic = Math.min(remaining, basicBandLeft);
  if (atBasic > 0) {
    const t = atBasic * 0.0875;
    tax += t;
    breakdown.push({ band: 'Basic rate', income: atBasic, rate: 0.0875, tax: t });
    remaining -= atBasic;
  }

  // Dividends at higher rate (33.75%)
  const higherBandCapacity = Math.max(0, 125140 - 50270);
  const atHigher = Math.min(remaining, higherBandCapacity);
  if (atHigher > 0) {
    const t = atHigher * 0.3375;
    tax += t;
    breakdown.push({ band: 'Higher rate', income: atHigher, rate: 0.3375, tax: t });
    remaining -= atHigher;
  }

  // Additional rate (39.35%)
  if (remaining > 0) {
    const t = remaining * 0.3935;
    tax += t;
    breakdown.push({ band: 'Additional rate', income: remaining, rate: 0.3935, tax: t });
  }

  return { tax, breakdown, allowanceUsed: Math.min(dividends, ALLOWANCE) };
}

/**
 * Calculate Capital Gains Tax for 2025/26
 * @param {number} gain - net gain after costs
 * @param {number} otherIncome - to determine taxpayer's band
 * @param {'shares'|'property'|'other'} assetType
 */
function calcCGT(gain, otherIncome, assetType = 'shares') {
  const EXEMPT = 3000;
  const taxableGain = Math.max(0, gain - EXEMPT);
  if (taxableGain <= 0) return { tax: 0, breakdown: [] };

  // Post-Oct 2024: residential property same as other assets (18/24%)
  const pa = getPersonalAllowance(otherIncome);
  const taxableOtherIncome = Math.max(0, otherIncome - pa);
  const basicBandRemaining = Math.max(0, 37700 - taxableOtherIncome);

  let tax = 0;
  const breakdown = [];
  let remaining = taxableGain;

  const atBasic = Math.min(remaining, basicBandRemaining);
  if (atBasic > 0) {
    const t = atBasic * 0.18;
    tax += t;
    breakdown.push({ band: 'Basic rate', gain: atBasic, rate: 0.18, tax: t });
    remaining -= atBasic;
  }

  if (remaining > 0) {
    const t = remaining * 0.24;
    tax += t;
    breakdown.push({ band: 'Higher rate', gain: remaining, rate: 0.24, tax: t });
  }

  return { tax, breakdown, taxableGain, exemptAmount: Math.min(gain, EXEMPT) };
}


/* ============================================================
   NAVIGATION
   ============================================================ */

/**
 * Initialise sticky nav scroll shadow
 */
function initNav() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mark active nav link based on current page
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(el => {
    const href = el.getAttribute('href');
    if (!href) return;
    const hrefPage = href.split('/').pop().split('#')[0];
    if (hrefPage === path) el.classList.add('active');
  });
}


/* ============================================================
   FAQ ACCORDION
   ============================================================ */

function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = btn.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-question.open').forEach(b => {
        b.classList.remove('open');
        b.closest('.faq-item').querySelector('.faq-answer').classList.remove('open');
      });

      // Open this one if it was closed
      if (!isOpen) {
        btn.classList.add('open');
        answer.classList.add('open');
      }
    });
  });
}


/* ============================================================
   INTERSECTION OBSERVER (fade-in animations)
   ============================================================ */

function initAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings by index
        const siblings = Array.from(entry.target.parentElement?.querySelectorAll('.fade-in') || []);
        const siblingIndex = siblings.indexOf(entry.target);
        const delay = Math.min(siblingIndex * 60, 240);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  elements.forEach(el => observer.observe(el));
}


/* ============================================================
   NUMBER INPUT HELPERS
   ============================================================ */

/**
 * Attach live currency formatting to a text input
 * Updates on blur, allows raw typing
 */
function initCurrencyInput(inputEl) {
  if (!inputEl) return;

  inputEl.addEventListener('blur', () => {
    const val = parseCurrency(inputEl.value);
    if (val > 0) {
      // Don't format, just clean up stray symbols — keep it editable
      inputEl.value = val.toFixed(0);
    }
  });

  inputEl.addEventListener('focus', () => {
    // Select all on focus for easy replacement
    inputEl.select();
  });
}

/**
 * Read a numeric input safely
 */
function readInput(id, fallback = 0) {
  const el = document.getElementById(id);
  if (!el) return fallback;
  const val = parseCurrency(el.value);
  return isNaN(val) ? fallback : val;
}

/**
 * Read a select value
 */
function readSelect(id, fallback = '') {
  const el = document.getElementById(id);
  return el ? el.value : fallback;
}

/**
 * Set text content of an element safely
 */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/**
 * Show or hide an element by id
 */
function setVisible(id, visible) {
  const el = document.getElementById(id);
  if (el) el.style.display = visible ? '' : 'none';
}

/**
 * Toggle a class on an element
 */
function toggleClass(el, cls, force) {
  if (typeof el === 'string') el = document.getElementById(el);
  if (el) el.classList.toggle(cls, force);
}


/* ============================================================
   CHART RENDERER (lightweight bar chart via SVG)
   For breakdown visualisations — no Chart.js dependency
   ============================================================ */

/**
 * Render a simple horizontal bar chart into a container
 * @param {HTMLElement} container
 * @param {Array<{label: string, value: number, color: string}>} data
 * @param {object} [opts]
 */
function renderBarChart(container, data, opts = {}) {
  if (!container || !data.length) return;

  const max = Math.max(...data.map(d => d.value));
  if (max === 0) return;

  const { showValues = true, formatter = formatCurrency } = opts;

  container.innerHTML = '';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '10px';

  data.forEach(item => {
    if (item.value <= 0) return;

    const pct = (item.value / max) * 100;
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.flexDirection = 'column';
    row.style.gap = '4px';

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';

    const label = document.createElement('span');
    label.style.fontSize = '0.8125rem';
    label.style.color = 'var(--text-secondary)';
    label.style.fontWeight = '500';
    label.textContent = item.label;

    const value = document.createElement('span');
    value.style.fontFamily = "'JetBrains Mono', monospace";
    value.style.fontSize = '0.875rem';
    value.style.fontWeight = '600';
    value.style.color = 'var(--text-primary)';
    value.textContent = formatter(item.value);

    header.appendChild(label);
    if (showValues) header.appendChild(value);

    const track = document.createElement('div');
    track.style.height = '8px';
    track.style.background = 'var(--border)';
    track.style.borderRadius = '4px';
    track.style.overflow = 'hidden';

    const fill = document.createElement('div');
    fill.style.height = '100%';
    fill.style.width = '0%';
    fill.style.background = item.color || 'var(--accent)';
    fill.style.borderRadius = '4px';
    fill.style.transition = 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)';

    track.appendChild(fill);
    row.appendChild(header);
    row.appendChild(track);
    container.appendChild(row);

    // Animate bar width after paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fill.style.width = pct + '%';
      });
    });
  });
}

/**
 * Render a donut chart into a canvas element
 * Pure canvas, no dependencies
 * @param {HTMLCanvasElement} canvas
 * @param {Array<{label: string, value: number, color: string}>} data
 */
function renderDonutChart(canvas, data, opts = {}) {
  if (!canvas) return;
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const size = opts.size || 160;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(dpr, dpr);

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 8;
  const innerR = outerR * 0.62;
  const gap = 0.025;

  let startAngle = -Math.PI / 2;

  data.forEach(segment => {
    if (segment.value <= 0) return;
    const slice = (segment.value / total) * (2 * Math.PI);
    const endAngle = startAngle + slice - gap;

    ctx.beginPath();
    ctx.moveTo(cx + innerR * Math.cos(startAngle + gap / 2), cy + innerR * Math.sin(startAngle + gap / 2));
    ctx.arc(cx, cy, outerR, startAngle + gap / 2, endAngle);
    ctx.arc(cx, cy, innerR, endAngle, startAngle + gap / 2, true);
    ctx.closePath();
    ctx.fillStyle = segment.color;
    ctx.fill();

    startAngle += slice;
  });

  // Centre text
  if (opts.centreLabel) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#111827';
    ctx.font = `600 ${Math.floor(size * 0.13)}px 'JetBrains Mono', monospace`;
    ctx.fillText(opts.centreLabel, cx, cy - size * 0.04);
    if (opts.centreSubLabel) {
      ctx.font = `500 ${Math.floor(size * 0.085)}px 'Plus Jakarta Sans', sans-serif`;
      ctx.fillStyle = '#6b7280';
      ctx.fillText(opts.centreSubLabel, cx, cy + size * 0.1);
    }
  }
}


/* ============================================================
   RANGE SLIDER DISPLAY
   ============================================================ */

/**
 * Bind a range input to a display element
 * @param {string} sliderId
 * @param {string} displayId
 * @param {function} [formatter]
 */
function bindRange(sliderId, displayId, formatter) {
  const slider = document.getElementById(sliderId);
  const display = document.getElementById(displayId);
  if (!slider || !display) return;

  const fmt = formatter || (v => v);

  const update = () => { display.textContent = fmt(slider.value); };
  slider.addEventListener('input', update);
  update(); // Set initial value
}


/* ============================================================
   COPY TO CLIPBOARD
   ============================================================ */

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    if (btn) {
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = original; }, 1800);
    }
  });
}


/* ============================================================
   INIT ON DOM READY
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initFAQ();
  initAnimations();
});
