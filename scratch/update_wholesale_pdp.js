const fs = require('fs');

const filePath = 'snippets/wholesale-pdp.liquid';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Delivery Card Replacement
const oldDeliveryCard = `      <!-- 6. Interactive PIN Code Delivery Estimator Card -->
      <div class="samyak-pdp-pin-card">
        <div class="samyak-pin-card-header">
          <div class="samyak-pin-truck-badge" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="3" width="15" height="13"/>
              <polygon points="16 8 20 8 23 11 23 16 16 16 8"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
          </div>
          <div class="samyak-pin-header-text">
            <span class="samyak-pin-eyebrow">ESTIMATED DELIVERY</span>
            <span class="samyak-pin-dates-display" id="samyak-pin-dates-display">Mon, 23 Nov – Fri, 27 Nov</span>
          </div>
        </div>

        <div class="samyak-pin-input-group">
          <label for="samyak-pin-input" class="samyak-pin-field-label">📍 CHECK DELIVERY TO YOUR PIN</label>
          <div class="samyak-pin-input-row">
            <input
              type="text"
              id="samyak-pin-input"
              class="samyak-pin-input"
              placeholder="Enter your 6-digit PIN code"
              maxlength="6"
              inputmode="numeric"
              pattern="[0-9]{6}"
              autocomplete="postal-code"
            >
            <button type="button" class="samyak-pin-btn" id="samyak-pin-btn">Check</button>
          </div>
          <div class="samyak-pin-feedback" id="samyak-pin-feedback" style="display: none;"></div>
        </div>
      </div>`;

const newDeliveryCard = `      <!-- 6. Honest Wholesale Shipping & Delivery Advisory Card -->
      <div class="samyak-pdp-pin-card">
        <div class="samyak-pin-card-header">
          <div class="samyak-pin-truck-badge" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="3" width="15" height="13"/>
              <polygon points="16 8 20 8 23 11 23 16 16 16 8"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
          </div>
          <div class="samyak-pin-header-text">
            <span class="samyak-pin-eyebrow">WHOLESALE DISPATCH ADVISORY</span>
            <span class="samyak-pin-dates-display">Dispatches in 24–48h from Central Delhi</span>
          </div>
        </div>

        <div class="samyak-pin-transit-matrix">
          <div class="samyak-transit-row">
            <span class="samyak-transit-badge">Delhi NCR: 1–2 Days</span>
            <span class="samyak-transit-badge">Metros: 2–3 Days</span>
            <span class="samyak-transit-badge">Rest of India: 3–5 Days</span>
          </div>
          <p class="samyak-transit-couriers">
            Carriers: <strong>Delhivery Express</strong>, <strong>Bluedart</strong>, <strong>DTDC</strong> &amp; <strong>Surface Cargo</strong>.
          </p>
        </div>

        <div class="samyak-pin-input-group">
          <label for="samyak-pin-input" class="samyak-pin-field-label">📍 ESTIMATE TRANSIT TO YOUR PIN CODE</label>
          <div class="samyak-pin-input-row">
            <input
              type="text"
              id="samyak-pin-input"
              class="samyak-pin-input"
              placeholder="Enter 6-digit Indian PIN (e.g. 110006)"
              maxlength="6"
              inputmode="numeric"
              pattern="[0-9]{6}"
              autocomplete="postal-code"
            >
            <button type="button" class="samyak-pin-btn" id="samyak-pin-btn">Estimate</button>
          </div>
          <div class="samyak-pin-feedback" id="samyak-pin-feedback" style="display: none;"></div>
        </div>
      </div>`;

// Normalize line endings for replacement
content = content.replace(oldDeliveryCard.replace(/\r\n/g, '\n'), newDeliveryCard.replace(/\r\n/g, '\n'));

// 2. Accordions & Additional Blocks Replacement
const oldAccordions = `      <!-- 7. Collapsible Product Details Accordions -->
      <div class="samyak-pdp-accordions-section">
        <span class="samyak-pdp-accordions-eyebrow">PRODUCT DETAILS</span>
        <div class="samyak-pdp-accordions-container">
          <!-- Accordion 1: Material & Finish Details (Open by default) -->
          <details class="samyak-pdp-accordion-item" open>
            <summary class="samyak-pdp-accordion-header">
              <span class="samyak-accordion-title">
                <span class="samyak-acc-icon">🏷️</span> Material & Finish Details
              </span>
              <span class="samyak-accordion-toggle" aria-hidden="true">−</span>
            </summary>
            <div class="samyak-pdp-accordion-content">
              <ul>
                <li><strong>Material:</strong> Premium Korean virgin acrylic resin & high-density polycarbonate.</li>
                <li><strong>Mechanism:</strong> Industrial-grade electroplated internal steel spring (rust-resistant).</li>
                <li><strong>Finish:</strong> Ultra-smooth high-gloss finish with precision rounded teeth for zero hair breakage.</li>
                <li><strong>Comfort:</strong> Ergonomic curved design engineered for secure, all-day hold without scalp pressure.</li>
              </ul>
            </div>
          </details>

          <!-- Accordion 2: Pack & Wholesale Specifications -->
          <details class="samyak-pdp-accordion-item">
            <summary class="samyak-pdp-accordion-header">
              <span class="samyak-accordion-title">
                <span class="samyak-acc-icon">📐</span> Pack & Wholesale Specifications
              </span>
              <span class="samyak-accordion-toggle" aria-hidden="true">+</span>
            </summary>
            <div class="samyak-pdp-accordion-content">
              <ul>
                <li><strong>Pack Size:</strong> 12 Pieces per master wholesale sealed pack.</li>
                <li><strong>Color Mix:</strong> Curated assortment of trending pastel, gloss, and neutral classic tones.</li>
                <li><strong>Average Weight:</strong> Approx. 32g per piece (~385g gross weight per master pack).</li>
                <li><strong>Wholesale Packaging:</strong> Individually carded with barcode tag in clear protective poly sleeves.</li>
              </ul>
            </div>
          </details>

          <!-- Accordion 3: Key Features -->
          <details class="samyak-pdp-accordion-item">
            <summary class="samyak-pdp-accordion-header">
              <span class="samyak-accordion-title">
                <span class="samyak-acc-icon">✨</span> Key Features
              </span>
              <span class="samyak-accordion-toggle" aria-hidden="true">+</span>
            </summary>
            <div class="samyak-pdp-accordion-content">
              <ul>
                <li>High-margin quick turnover item for retail accessory shops, gift boutiques, and online sellers.</li>
                <li>Reinforced central hinge joint tested for 1,000+ continuous flex cycles without snapping.</li>
                <li>High social media demand matching trending Korean hair claw styles seen on Instagram & Pinterest.</li>
                <li>Flexible MOQ: mix-and-match across our catalog to meet the ₹2,000 store minimum order value.</li>
              </ul>
            </div>
          </details>

          <!-- Accordion 4: Storage & Care Instructions -->
          <details class="samyak-pdp-accordion-item">
            <summary class="samyak-pdp-accordion-header">
              <span class="samyak-accordion-title">
                <span class="samyak-acc-icon">🧼</span> Storage & Care Instructions
              </span>
              <span class="samyak-accordion-toggle" aria-hidden="true">+</span>
            </summary>
            <div class="samyak-pdp-accordion-content">
              <ul>
                <li>Store in wholesale display trays, clear acrylic bins, or original packaging to prevent surface scratches.</li>
                <li>Avoid prolonged direct exposure to intense heat, open sunlight, or chemical hair solvents.</li>
                <li>Wipe gently with a soft dry microfiber cloth before customer presentation.</li>
              </ul>
            </div>
          </details>
        </div>
      </div>
    </div>`;

const newAccordions = `      <!-- 7. Collapsible Product Details Accordions (Dynamic Category-Aware Specifications) -->
      <div class="samyak-pdp-accordions-section">
        <span class="samyak-pdp-accordions-eyebrow">PRODUCT DETAILS</span>
        <div class="samyak-pdp-accordions-container">
          <!-- Accordion 1: Material & Finish Details (Open by default) -->
          <details class="samyak-pdp-accordion-item" open>
            <summary class="samyak-pdp-accordion-header">
              <span class="samyak-accordion-title">
                <span class="samyak-acc-icon">🏷️</span> Material &amp; Finish Details
              </span>
              <span class="samyak-accordion-toggle" aria-hidden="true">−</span>
            </summary>
            <div class="samyak-pdp-accordion-content">
              <ul>
                {% if product.metafields.custom.material != blank %}
                  <li><strong>Material:</strong> {{ product.metafields.custom.material }}</li>
                {% elsif is_scrunchie %}
                  <li><strong>Material:</strong> Premium Mulberry Satin, Velvet &amp; Organza with durable elastic inner core.</li>
                  <li><strong>Finish:</strong> Silky soft, anti-frizz, snag-free finish designed to protect hair from creasing and breakage.</li>
                  <li><strong>Elasticity:</strong> High-rebound premium elastic band engineered for 500+ stretches without sagging.</li>
                  <li><strong>Comfort:</strong> Featherlight, gentle on scalp, and comfortable for all-day and overnight wear.</li>
                {% elsif is_hairband %}
                  <li><strong>Material:</strong> Flexible high-resilience comfort band with padded velvet/satin lining and secure grip tips.</li>
                  <li><strong>Embellishment:</strong> Lustrous faux pearls, premium acrylic resin, or crystal rhinestones securely set.</li>
                  <li><strong>Finish:</strong> Smooth rounded comfort tips engineered to eliminate headache and pressure behind the ears.</li>
                  <li><strong>Comfort:</strong> Ergonomic flexible arch conforming comfortably to all head shapes and hair volumes.</li>
                {% elsif is_hairpin %}
                  <li><strong>Material:</strong> High-grade electroplated alloy with anti-tarnish protective coating.</li>
                  <li><strong>Mechanism:</strong> Precision tension grip with rounded ball-tips to prevent hair snagging.</li>
                  <li><strong>Finish:</strong> Long-lasting mirror luster in classic gold, silver, and trending pastel enamel tones.</li>
                  <li><strong>Comfort:</strong> Firm, slip-free grip that holds fine, medium, and thick hair sections securely.</li>
                {% elsif is_jewelry %}
                  <li><strong>Material:</strong> Hypoallergenic fashion jewelry alloy with high-grade electroplated luster.</li>
                  <li><strong>Finish:</strong> Anti-tarnish polished finish with lead and nickel-safe craftsmanship.</li>
                  <li><strong>Details:</strong> Fine craftsmanship with secure clasps and high-clarity simulated stone embellishments.</li>
                  <li><strong>Wearability:</strong> Lightweight statement designs perfect for festive, bridal, and daily western wear.</li>
                {% else %}
                  <li><strong>Material:</strong> Premium Korean virgin acrylic resin &amp; high-density impact-resistant polymers.</li>
                  <li><strong>Mechanism:</strong> Industrial-grade electroplated internal steel spring (rust-resistant).</li>
                  <li><strong>Finish:</strong> Ultra-smooth high-gloss finish with precision rounded teeth for zero hair breakage.</li>
                  <li><strong>Comfort:</strong> Ergonomic curved contour engineered for secure, all-day hold without scalp pressure.</li>
                {% endif %}
              </ul>
            </div>
          </details>

          <!-- Accordion 2: Pack & Wholesale Specifications -->
          <details class="samyak-pdp-accordion-item">
            <summary class="samyak-pdp-accordion-header">
              <span class="samyak-accordion-title">
                <span class="samyak-acc-icon">📐</span> Pack &amp; Wholesale Specifications
              </span>
              <span class="samyak-accordion-toggle" aria-hidden="true">+</span>
            </summary>
            <div class="samyak-pdp-accordion-content">
              <ul>
                {% if product.metafields.custom.pack_specification != blank %}
                  <li><strong>Wholesale Pack Size:</strong> {{ product.metafields.custom.pack_specification }}</li>
                {% else %}
                  <li><strong>Wholesale Pack Size:</strong>
                    {% if is_scrunchie %}12–24 Pieces assorted wholesale master bundle.
                    {% elsif is_hairband %}6–12 Pieces carded display master pack.
                    {% elsif is_hairpin %}12–24 Carded sets per wholesale master sleeve.
                    {% elsif is_jewelry %}12 Pieces individual gift-ready wholesale carding.
                    {% else %}12 Pieces per master wholesale sealed pack.
                    {% endif %}
                  </li>
                  <li><strong>Color &amp; Finish Mix:</strong> Curated assortment of trending pastel, neutral, and classic high-turnover shades.</li>
                  <li><strong>Packaging:</strong> Individually carded or protective poly-sleeved with retail-ready barcode tags.</li>
                  <li><strong>Wholesale Grade:</strong> Factory-direct imported wholesale quality inspected for salon, retail, and boutique resale.</li>
                {% endif %}
              </ul>
            </div>
          </details>

          <!-- Accordion 3: Product Description & Key Features -->
          <details class="samyak-pdp-accordion-item">
            <summary class="samyak-pdp-accordion-header">
              <span class="samyak-accordion-title">
                <span class="samyak-acc-icon">✨</span> Key Wholesale Features
              </span>
              <span class="samyak-accordion-toggle" aria-hidden="true">+</span>
            </summary>
            <div class="samyak-pdp-accordion-content">
              {% if product.description != blank %}
                <div class="samyak-pdp-description-content" style="margin-bottom: 12px; line-height: 1.6; color: #3A403D;">
                  {{ product.description }}
                </div>
              {% endif %}
              <ul>
                <li>High-margin, quick-turnover inventory curated specifically for retail accessory shops, salons, and online sellers.</li>
                <li>Direct importer pricing guaranteeing competitive profit margins for wholesale resellers.</li>
                <li>Trending catalog updated weekly with social-media viral designs matching Instagram &amp; Pinterest fashion trends.</li>
                <li><strong>Flexible Wholesale MOQ:</strong> Mix and match any products across our catalog to meet the ₹2,000 store minimum order value.</li>
              </ul>
            </div>
          </details>

          <!-- Accordion 4: Storage & Care Instructions -->
          <details class="samyak-pdp-accordion-item">
            <summary class="samyak-pdp-accordion-header">
              <span class="samyak-accordion-title">
                <span class="samyak-acc-icon">🧼</span> Storage &amp; Care Instructions
              </span>
              <span class="samyak-accordion-toggle" aria-hidden="true">+</span>
            </summary>
            <div class="samyak-pdp-accordion-content">
              <ul>
                <li>Store in dry wholesale display trays, acrylic bins, or original protective sleeves to prevent surface scratches.</li>
                <li>Avoid direct exposure to extreme heat, open moisture, perfumes, and chemical hair styling sprays.</li>
                <li>Wipe gently with a clean, dry microfiber cloth before retail display to maintain showroom luster.</li>
              </ul>
            </div>
          </details>
        </div>
      </div>

      {% if additional_blocks != blank %}
        <!-- 8. Theme Editor App Blocks & Merchant Widgets -->
        <div class="samyak-pdp-additional-blocks-wrapper" data-theme-editor-blocks>
          {{ additional_blocks }}
        </div>
      {% endif %}
    </div>`;

content = content.replace(oldAccordions.replace(/\r\n/g, '\n'), newAccordions.replace(/\r\n/g, '\n'));

// 3. Add CSS for new matrix & additional blocks
const oldCssAnchor = `  .samyak-pin-dates-display {
    font-size: 13.5px;
    font-weight: 700;
    color: #181A19;
  }`;

const newCssBlock = `  .samyak-pin-dates-display {
    font-size: 13.5px;
    font-weight: 700;
    color: #181A19;
  }

  .samyak-pin-transit-matrix {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px dashed #E4E0D6;
  }

  .samyak-transit-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .samyak-transit-badge {
    background: #F1ECE1;
    color: #113B32;
    font-size: 10px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 4px;
    letter-spacing: 0.3px;
  }

  .samyak-transit-couriers {
    margin: 8px 0 0;
    font-size: 10.5px;
    color: #5C615E;
    line-height: 1.4;
  }

  .samyak-pdp-additional-blocks-wrapper {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid #E4E0D6;
    width: 100%;
  }`;

content = content.replace(oldCssAnchor.replace(/\r\n/g, '\n'), newCssBlock.replace(/\r\n/g, '\n'));

// 4. Update JS for Honest Postal Zone Transit Estimation
const oldJsBlock = `    // 1. Dynamic Delivery Date Calculation
    function initEstimatedDates() {
      var display = document.getElementById('samyak-pin-dates-display');
      if (!display) return;

      var now = new Date();
      // Start date: +3 days, End date: +6 days
      var start = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
      var end = new Date(now.getTime() + (6 * 24 * 60 * 60 * 1000));

      var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      var startStr = days[start.getDay()] + ', ' + start.getDate() + ' ' + months[start.getMonth()];
      var endStr = days[end.getDay()] + ', ' + end.getDate() + ' ' + months[end.getMonth()];

      display.textContent = startStr + ' – ' + endStr;
    }

    // 2. Interactive PIN Code Checker
    function initPinChecker() {
      var input = document.getElementById('samyak-pin-input');
      var btn = document.getElementById('samyak-pin-btn');
      var feedback = document.getElementById('samyak-pin-feedback');
      if (!input || !btn || !feedback) return;

      function checkPin() {
        var val = input.value.trim();
        if (/^\\d{6}$/.test(val)) {
          feedback.className = 'samyak-pin-feedback is-valid';
          feedback.innerHTML = '✓ Express wholesale dispatch available for <strong>' + val + '</strong> (2–4 Business Days via Bluedart / Delhivery).';
          feedback.style.display = 'block';
        } else {
          feedback.className = 'samyak-pin-feedback is-invalid';
          feedback.textContent = 'Please enter a valid 6-digit Indian PIN code.';
          feedback.style.display = 'block';
        }
      }

      btn.addEventListener('click', checkPin);
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          checkPin();
        }
      });
    }`;

const newJsBlock = `    // 2. Honest Postal Zone Transit Estimator
    function initPinChecker() {
      var input = document.getElementById('samyak-pin-input');
      var btn = document.getElementById('samyak-pin-btn');
      var feedback = document.getElementById('samyak-pin-feedback');
      if (!input || !btn || !feedback) return;

      function checkPin() {
        var val = input.value.trim();
        if (!/^\\d{6}$/.test(val)) {
          feedback.className = 'samyak-pin-feedback is-invalid';
          feedback.textContent = 'Please enter a valid 6-digit Indian PIN code.';
          feedback.style.display = 'block';
          return;
        }

        var firstDigit = parseInt(val.charAt(0), 10);
        // Valid Indian civilian postal zones are 1 through 8
        if (firstDigit < 1 || firstDigit > 8) {
          feedback.className = 'samyak-pin-feedback is-invalid';
          feedback.textContent = 'Please enter a valid civilian Indian postal code (starting with digits 1–8).';
          feedback.style.display = 'block';
          return;
        }

        // Zone-based transit guidance
        var zoneText = '2–4 Business Days';
        var hub = 'Central Delhi';
        if (firstDigit === 1) {
          zoneText = '1–2 Business Days (Delhi NCR / Northern Zone)';
        } else if (firstDigit === 2 || firstDigit === 3) {
          zoneText = '2–3 Business Days (North / West Commercial Hubs)';
        } else if (firstDigit === 4 || firstDigit === 5) {
          zoneText = '2–4 Business Days (Western / Southern Metro Corridors)';
        } else {
          zoneText = '3–5 Business Days (Eastern / Special Coverage Zones)';
        }

        feedback.className = 'samyak-pin-feedback is-valid';
        feedback.innerHTML = '✓ Estimated courier transit to PIN <strong>' + val + '</strong>: <strong>' + zoneText + '</strong> via Bluedart / Delhivery / DTDC.<br><small style="font-size:11px; opacity:0.85; display:block; margin-top:4px;">*Orders dispatch within 24–48 hours from ' + hub + '. Tracking link provided automatically via WhatsApp upon shipment.</small>';
        feedback.style.display = 'block';
      }

      btn.addEventListener('click', checkPin);
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          checkPin();
        }
      });
    }`;

content = content.replace(oldJsBlock.replace(/\r\n/g, '\n'), newJsBlock.replace(/\r\n/g, '\n'));

// Remove initEstimatedDates() from initAll()
content = content.replace('      initEstimatedDates();\n', '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated snippets/wholesale-pdp.liquid');
