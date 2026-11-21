const fs = require('fs');
let s = fs.readFileSync('snippets/wholesale-pdp.liquid', 'utf8');

const startMarker = '      <!-- 6. Interactive PIN Code Delivery Estimator Card -->';
const endMarker = '      <!-- 7. Collapsible Product Details Accordions';

const startIdx = s.indexOf(startMarker);
const endIdx = s.indexOf(endMarker);
console.log('startIdx:', startIdx, 'endIdx:', endIdx);

if (startIdx !== -1 && endIdx !== -1) {
  const newDeliveryCard = `      <!-- 6. Honest Wholesale Shipping & Delivery Advisory Card -->
      <div class="samyak-pdp-pin-card">
        <div class="samyak-pin-card-header">
          <div class="samyak-pin-truck-badge" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="3" width="15" height="13"/>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
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
      </div>\n\n`;

  s = s.substring(0, startIdx) + newDeliveryCard + s.substring(endIdx);
  fs.writeFileSync('snippets/wholesale-pdp.liquid', s, 'utf8');
  console.log('Successfully replaced delivery card in wholesale-pdp.liquid');
} else {
  console.log('Markers not found!');
}
