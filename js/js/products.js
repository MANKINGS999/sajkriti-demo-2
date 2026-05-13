/* =============================================
   SAJKRIITI — PRODUCTS & SHOP LOGIC
   Google Sheets JSON endpoint + WhatsApp ordering
   ============================================= */

/* ─────────────────────────────────────────────
   🔧 CONFIGURATION — edit these two lines only
   ─────────────────────────────────────────────
   HOW TO CONNECT GOOGLE SHEET:
   1. Open your Google Sheet
   2. Go to File → Share → Publish to web
   3. Select your sheet tab, choose "Comma-separated values (.csv)"
      OR use the JSON endpoint below:
   4. Your sheet JSON URL format:
      https://opensheet.elk.sh/SPREADSHEET_ID/SHEET_NAME
      (opensheet.elk.sh is a free proxy that returns clean JSON from public Google Sheets)
   5. Paste the URL below in GOOGLE_SHEET_URL
   6. Your sheet columns should be:
      id | name | desc | price | category | image | whatsapp_msg
   ──────────────────────────────────────────── */

const GOOGLE_SHEET_URL = '';
// Example: 'https://opensheet.elk.sh/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/Products'

const WHATSAPP_NUMBER = '919876543210'; // Your WhatsApp number with country code, no + or spaces

/* ─────────────────────────────────────────────
   STATIC FALLBACK PRODUCTS
   Shown when Google Sheet is not connected yet.
   Remove or keep as backup — up to you.
   ─────────────────────────────────────────────*/
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: "10 Sunflower Bouquet",
    desc: "Grand sunflower bouquet collection ideal for festive gifting and statement floral decor.",
    price: "₹1,200",
    category: "bouquets",
    image: "",
    badge: "Bestseller",
  },
  {
    id: 2,
    name: "Teddy Gift Hamper",
    desc: "Cute teddy gift perfect for surprise hampers, birthday gifting and cozy room aesthetics.",
    price: "₹3,000",
    category: "giftboxes",
    image: "",
    badge: "Popular",
  },
  {
    id: 3,
    name: "Hot Wheels Bouquet",
    desc: "Creative Hot Wheels themed bouquet designed for car lovers, collectors and unique gifting.",
    price: "₹400",
    category: "birthdays",
    image: "",
    badge: "",
  },
  {
    id: 4,
    name: "Photo Bouquet",
    desc: "Personalised photo bouquet crafted to turn memories into aesthetic keepsake gifts.",
    price: "₹500",
    category: "bouquets",
    image: "",
    badge: "Custom",
  },
  {
    id: 5,
    name: "Teddy Bouquet",
    desc: "Adorable teddy bouquet combining soft plush charm with luxury bouquet styling.",
    price: "₹799",
    category: "birthdays",
    image: "",
    badge: "",
  },
  {
    id: 6,
    name: "Keychains",
    desc: "Minimal handcrafted keychains designed for everyday style, gifting and cute accessories.",
    price: "₹199",
    category: "giftboxes",
    image: "",
    badge: "",
  },
  {
    id: 7,
    name: "Stranger Things Hair Clips",
    desc: "Stranger Things inspired aesthetic hair clips for fans of retro and pop culture fashion.",
    price: "₹299",
    category: "giftboxes",
    image: "",
    badge: "Collab",
  },
  {
    id: 8,
    name: "Haldi Kunku Palette",
    desc: "Elegant haldi kunku palette designed for festive celebrations, pooja rituals and traditional gifting.",
    price: "₹349",
    category: "homedecor",
    image: "",
    badge: "",
  },
  {
    id: 9,
    name: "Bridal Bouquet",
    desc: "Luxurious handcrafted bridal bouquet featuring premium silk florals, perfect for wedding ceremonies.",
    price: "₹2,500",
    category: "weddings",
    image: "",
    badge: "Premium",
  },
  {
    id: 10,
    name: "Rose Resin Frame",
    desc: "Beautiful preserved rose petals set in crystal-clear resin, a timeless keepsake art piece.",
    price: "₹899",
    category: "homedecor",
    image: "",
    badge: "",
  },
  {
    id: 11,
    name: "Anniversary Gift Box",
    desc: "Romantic anniversary gift box with silk roses, chocolates and personalised love note.",
    price: "₹1,599",
    category: "giftboxes",
    image: "",
    badge: "Romantic",
  },
  {
    id: 12,
    name: "Birthday Wreath",
    desc: "Cheerful floral wreath adorned with pastel blooms, perfect for birthday wall décor.",
    price: "₹699",
    category: "birthdays",
    image: "",
    badge: "",
  },
];

/* ─────────────────────────────────────────────
   CATEGORY CONFIG
   ─────────────────────────────────────────────*/
const CATEGORY_EMOJI = {
  bouquets:  '💐',
  giftboxes: '🎁',
  birthdays: '🎂',
  homedecor: '🏡',
  weddings:  '💍',
};

const PLACEHOLDER_COLORS = {
  bouquets:  '#fce8ed',
  giftboxes: '#fef3e2',
  birthdays: '#e8f5e9',
  homedecor: '#e8eaf6',
  weddings:  '#fce4ec',
};

/* ─────────────────────────────────────────────
   HELPERS
   ─────────────────────────────────────────────*/
function getPlaceholderSVG(emoji, color) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='400' height='300' fill='${color}'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='80'>${emoji}</text></svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

function getProductImage(product) {
  if (product.image && product.image.trim() !== '') return product.image.trim();
  const cat = (product.category || 'bouquets').toLowerCase().trim();
  return getPlaceholderSVG(CATEGORY_EMOJI[cat] || '🌸', PLACEHOLDER_COLORS[cat] || '#fce8ed');
}

function buildWhatsAppText(product) {
  // Use custom whatsapp_msg from sheet if available, else build default
  if (product.whatsapp_msg && product.whatsapp_msg.trim() !== '') return product.whatsapp_msg.trim();
  return `Hi Sajkriiti! 🌸 I'd like to place an order for:\n\n*${product.name}*\nPrice: ${product.price}\n\nPlease share availability and delivery details. Thank you! 😊`;
}

function openWhatsApp(product) {
  const msg = encodeURIComponent(buildWhatsAppText(product));
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
}

/* ─────────────────────────────────────────────
   GOOGLE SHEETS FETCH
   ─────────────────────────────────────────────*/
async function fetchFromGoogleSheet() {
  if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL.trim() === '') return null;
  try {
    const res = await fetch(GOOGLE_SHEET_URL);
    if (!res.ok) throw new Error('Sheet fetch failed');
    const data = await res.json();
    // Normalize keys to lowercase
    return data.map((row, i) => ({
      id: row.id || row.ID || i + 1,
      name: row.name || row.Name || '',
      desc: row.desc || row.description || row.Description || '',
      price: row.price || row.Price || '',
      category: (row.category || row.Category || 'bouquets').toLowerCase().trim(),
      image: row.image || row.Image || row.image_url || '',
      badge: row.badge || row.Badge || '',
      whatsapp_msg: row.whatsapp_msg || row.whatsapp || '',
    })).filter(p => p.name.trim() !== '');
  } catch (e) {
    console.warn('Google Sheet fetch failed, using fallback products:', e.message);
    return null;
  }
}

/* ─────────────────────────────────────────────
   RENDER CARD
   ─────────────────────────────────────────────*/
function renderCard(p) {
  const cat = (p.category || 'bouquets').toLowerCase().trim();
  const imgSrc = getProductImage(p);
  const fallbackImg = getPlaceholderSVG(CATEGORY_EMOJI[cat] || '🌸', PLACEHOLDER_COLORS[cat] || '#fce8ed');
  const badge = p.badge ? `<div class="product-badge">${p.badge}</div>` : '';

  return `
    <div class="product-card">
      <div class="product-img-wrap">
        ${badge}
        <img
          src="${imgSrc}"
          alt="${p.name}"
          loading="lazy"
          onerror="this.src='${fallbackImg}'"
        />
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <span class="product-price">${p.price}</span>
          <button
            class="btn-whatsapp-order"
            onclick="orderOnWhatsApp(${p.id})"
            aria-label="Order ${p.name} on WhatsApp"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.122 1.524 5.854L.057 23.882a.5.5 0 0 0 .611.611l6.029-1.467A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.878 9.878 0 0 1-5.032-1.378l-.36-.214-3.732.908.924-3.645-.236-.374A9.869 9.869 0 0 1 2.118 12C2.118 6.532 6.532 2.118 12 2.118S21.882 6.532 21.882 12 17.468 21.882 12 21.882z"/></svg>
            Order on WhatsApp
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ─────────────────────────────────────────────
   RENDER GRID
   ─────────────────────────────────────────────*/
let ALL_PRODUCTS = [];
let activeCategory = 'bouquets';

function renderProducts(cat) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const filtered = cat === 'all'
    ? ALL_PRODUCTS
    : ALL_PRODUCTS.filter(p => (p.category || '').toLowerCase().trim() === cat);

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="no-products">No products in this category yet — check back soon! 🌸</div>';
    return;
  }

  grid.innerHTML = filtered.map(renderCard).join('');
}

/* ─────────────────────────────────────────────
   WHATSAPP ORDER HANDLER
   ─────────────────────────────────────────────*/
window.orderOnWhatsApp = function(id) {
  const product = ALL_PRODUCTS.find(p => String(p.id) === String(id));
  if (!product) return;
  openWhatsApp(product);
};

/* ─────────────────────────────────────────────
   CATEGORY FILTER
   ─────────────────────────────────────────────*/
function initCategoryFilter() {
  const items = document.querySelectorAll('.cat-icon[data-cat]');
  items.forEach(item => {
    item.addEventListener('click', function () {
      items.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      activeCategory = this.dataset.cat;
      renderProducts(activeCategory);
    });
  });
}

/* ─────────────────────────────────────────────
   INIT
   ─────────────────────────────────────────────*/
document.addEventListener('DOMContentLoaded', async function () {
  const loader = document.getElementById('shopLoader');

  // Try Google Sheet first
  const sheetData = await fetchFromGoogleSheet();

  if (sheetData && sheetData.length > 0) {
    ALL_PRODUCTS = sheetData;
    if (loader) loader.style.display = 'none';
  } else {
    ALL_PRODUCTS = FALLBACK_PRODUCTS;
    if (loader) loader.style.display = 'none';
  }

  // Hide the dev notice if sheet is connected
  const notice = document.getElementById('sheetNotice');
  if (notice) {
    if (GOOGLE_SHEET_URL && GOOGLE_SHEET_URL.trim() !== '' && sheetData && sheetData.length > 0) {
      notice.style.display = 'none';
    }
  }

  initCategoryFilter();
  renderProducts(activeCategory);
});
