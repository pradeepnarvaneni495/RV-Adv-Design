/* ==========================================================================
   RV ADVENTURE DESIGN - DARK LUXURY API INTEGRATION & SPA ENGINE
   ========================================================================== */

// 1. CONFIGURATION & BACKEND API ENDPOINTS
const API_CONFIG = {
  primaryUrl: "https://backend.rvadventureaustralia.com.au/api",
  localUrl: "http://localhost:5000/api",
  clientHeader: "USER_PANEL"
};

let currentApiUrl = API_CONFIG.primaryUrl;

// Bulletproof Image Resolver Helper
function resolveImage(imgSrc, fallback = 'assets/cat_tent.jpg') {
  if (!imgSrc) return fallback;
  if (typeof imgSrc === 'object') {
    imgSrc = imgSrc.image || imgSrc.url || imgSrc.imageUrl || '';
  }
  if (!imgSrc || typeof imgSrc !== 'string') return fallback;
  if (imgSrc.startsWith('http://') || imgSrc.startsWith('https://') || imgSrc.startsWith('assets/')) {
    return imgSrc;
  }
  if (imgSrc.startsWith('/')) {
    return `https://backend.rvadventureaustralia.com.au${imgSrc}`;
  }
  return fallback;
}

function getCategoryImage(cat) {
  const name = (cat.name || cat.identifier || '').toLowerCase();
  if (name.includes('4wd') || name.includes('4x4')) return 'assets/cat_tent.jpg';
  if (name.includes('camping')) return 'assets/rooftop_tent.jpg';
  if (name.includes('caravan')) return 'assets/cat_roofrack.jpg';
  if (name.includes('electric') || name.includes('solar') || name.includes('power')) return 'assets/solar_generator.jpg';
  if (name.includes('boat') || name.includes('marine')) return 'assets/cat_kitchen.jpg';
  if (name.includes('tent') || name.includes('shelter')) return 'assets/cat_tent.jpg';
  if (name.includes('recovery') || name.includes('expedition') || name.includes('winch')) return 'assets/cat_recovery.jpg';
  if (name.includes('kitchen') || name.includes('cook')) return 'assets/cat_kitchen.jpg';
  if (name.includes('rack') || name.includes('roof')) return 'assets/cat_roofrack.jpg';
  return 'assets/cat_tent.jpg';
}

// Fallback Mock Data Store
const mockData = {
  categories: [
    { _id: "c1", identifier: "4wd", name: "4WD", image: "assets/cat_tent.jpg" },
    { _id: "c2", identifier: "camping", name: "CAMPING RV", image: "assets/rooftop_tent.jpg" },
    { _id: "c3", identifier: "caravan", name: "CARAVAN RV", image: "assets/cat_roofrack.jpg" },
    { _id: "c4", identifier: "electrical", name: "ELECTRICAL", image: "assets/solar_generator.jpg" },
    { _id: "c5", identifier: "marine", name: "BOAT & MARINE", image: "assets/cat_kitchen.jpg" }
  ],
  suppliers: [
    { _id: "s1", identifier: "aurora-overland", name: "Aurora Overland" },
    { _id: "s2", identifier: "apex-tents", name: "Apex Expedition" },
    { _id: "s3", identifier: "ecoflow", name: "EcoFlow Power" },
    { _id: "s4", identifier: "dometic", name: "Dometic Outdoor" },
    { _id: "s5", identifier: "arb", name: "ARB 4x4 Accessories" }
  ],
  products: [
    {
      id: 1,
      _id: "p1",
      identifier: "apex-ii-rooftop-tent",
      name: "Apex II Hard-Shell Rooftop Tent",
      category: "tents",
      categoryLabel: "Tents & Shelters",
      price: 3450,
      originalPrice: 3800,
      rating: 4.9,
      reviewsCount: 84,
      badge: "Top Seller",
      specs: ["Carbon Shell", "2-Min Setup", "3-Season Heavy Duty"],
      image: "assets/cat_tent.jpg",
      supplier: "Apex Expedition",
      description: "Aerodynamic carbon-composite hard shell rooftop tent with integrated ambient LED lighting, memory foam mattress, and high-density rainfly."
    },
    {
      id: 2,
      _id: "p2",
      identifier: "aurora-x1-solar-station",
      name: "Aurora X1 2400W Solar Station",
      category: "power",
      categoryLabel: "Off-Grid Power",
      price: 1890,
      originalPrice: 2190,
      rating: 5.0,
      reviewsCount: 128,
      badge: "Off-Grid Ready",
      specs: ["2400W Continuous", "LiFePO4 Cell", "400W Solar In"],
      image: "assets/solar_generator.jpg",
      supplier: "EcoFlow Power",
      description: "Military-grade portable lithium energy station. Charges from 0-80% in 45 minutes via folding solar panels or vehicle alternator."
    },
    {
      id: 3,
      _id: "p3",
      identifier: "stealth-roof-rack",
      name: "Stealth Modular Roof Rack System",
      category: "expedition",
      categoryLabel: "Expedition Gear",
      price: 820,
      originalPrice: 950,
      rating: 4.8,
      reviewsCount: 42,
      badge: "New Arrival",
      specs: ["T6 Aluminum", "600 lbs Load", "Low Wind Drag"],
      image: "assets/cat_roofrack.jpg",
      supplier: "Aurora Overland",
      description: "Custom laser-cut aluminum roof rack with slotted t-tracks for mounting solar panels, traction boards, and auxiliary lights."
    },
    {
      id: 4,
      _id: "p4",
      identifier: "titanium-camp-kitchen",
      name: "Expedition Titanium Outdoor Kitchen",
      category: "kitchen",
      categoryLabel: "Kitchen & Living",
      price: 1250,
      originalPrice: 1400,
      rating: 4.9,
      reviewsCount: 67,
      badge: "Staff Pick",
      specs: ["Slide-Out Bay", "Dual Burner", "Integrated Sink"],
      image: "assets/cat_kitchen.jpg",
      supplier: "Dometic Outdoor",
      description: "Compact dual-burner stainless stove unit with collapsible sink basin, spice rack, and teak wood prep cutting board."
    },
    {
      id: 5,
      _id: "p5",
      identifier: "traction-recovery-boards",
      name: "All-Terrain Traction Recovery Boards",
      category: "expedition",
      categoryLabel: "Expedition Gear",
      price: 340,
      originalPrice: 390,
      rating: 4.7,
      reviewsCount: 95,
      badge: "Essential",
      specs: ["10-Ton Rating", "UV Stabilized", "Nylon Composite"],
      image: "assets/cat_recovery.jpg",
      supplier: "ARB 4x4 Accessories",
      description: "Extreme duty recovery tracks engineered to rescue heavy adventure vans and 4x4 rigs from mud, deep sand, and snow."
    },
    {
      id: 6,
      _id: "p6",
      identifier: "5kwh-lithium-powerpack",
      name: "5kWh Modular Lithium Powerpack",
      category: "power",
      categoryLabel: "Off-Grid Power",
      price: 3200,
      originalPrice: 3500,
      rating: 5.0,
      reviewsCount: 31,
      badge: "Pro Series",
      specs: ["Smart Bluetooth BMS", "6000+ Cycles", "Heating Element"],
      image: "assets/solar_generator.jpg",
      supplier: "EcoFlow Power",
      description: "High-density 12V 400Ah LiFePO4 battery pack equipped with internal self-heating technology for sub-zero winter expedition camping."
    }
  ],
  reviews: [
    { userName: "Captain Mark Vance", rating: 5, comment: "The 5kWh Lithium Powerpack powered our Sprinter van heater and fridge for 5 days in the Australian outback without breaking a sweat!", location: "Tasmania Expedition" },
    { userName: "Elena Rostova", rating: 5, comment: "The Apex II tent setup takes literally 90 seconds. Best overland investment we've ever made.", location: "High Country NSW" },
    { userName: "Marcus Brody", rating: 4.9, comment: "Aurora X1 solar generator recharges insanely fast from our rooftop solar setup. Premium dark obsidian build quality.", location: "Kimberley Overland" }
  ]
};

// Application State
let state = {
  categories: [],
  suppliers: [],
  products: [],
  reviews: [],
  cart: [{ productId: 1, quantity: 1 }],
  user: null,
  activeView: "home"
};

// 2. API REQUEST HELPER WITH FALLBACK
async function fetchFromApi(endpoint, params = {}) {
  const urlParams = new URLSearchParams(params).toString();
  const fullUrl = `${currentApiUrl}/${endpoint}${urlParams ? '?' + urlParams : ''}`;
  
  try {
    const token = sessionStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      "X-App-Client": API_CONFIG.clientHeader
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(fullUrl, { method: "GET", headers });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const result = await response.json();
    return result.data || result;
  } catch (err) {
    console.warn(`API call to ${endpoint} failed. Using dark luxury mock store fallback.`, err);
    return null;
  }
}

// 3. INITIALIZATION & DATA LOADING
document.addEventListener("DOMContentLoaded", async () => {
  setupRouting();
  await loadInitialData();
  renderHomeCategories();
  renderProducts(state.products);
  renderCustomerReviews();
  renderBrandLogos();
  updateCartUI();
  setupEventListeners();
});

async function loadInitialData() {
  const config = await fetchFromApi("config", { carouselPics: 1, displayableCategories: 0, suppliers: 1 });
  
  if (config && config.displayableCategories && config.displayableCategories.length > 0) {
    state.categories = config.displayableCategories;
  } else {
    state.categories = mockData.categories;
  }

  if (config && config.suppliers && config.suppliers.length > 0) {
    state.suppliers = config.suppliers;
  } else {
    state.suppliers = mockData.suppliers;
  }

  state.products = mockData.products;
  state.reviews = mockData.reviews;
}

// 4. SPA HASH ROUTING CONTROLLER
function setupRouting() {
  window.addEventListener("hashchange", handleHashChange);
  handleHashChange();
}

function handleHashChange() {
  const hash = window.location.hash.replace("#", "") || "home";
  
  let targetView = "home";
  let param = "";
  
  if (hash.includes("/")) {
    const parts = hash.split("/");
    targetView = parts[0];
    param = parts[1];
  } else {
    targetView = hash;
  }

  document.querySelectorAll(".spa-view").forEach(v => v.classList.remove("active"));

  const activeEl = document.getElementById(`view-${targetView}`);
  if (activeEl) {
    activeEl.classList.add("active");
    state.activeView = targetView;
    window.scrollTo(0, 0);
  } else {
    document.getElementById("view-home")?.classList.add("active");
  }

  document.querySelectorAll(".nav-link").forEach(link => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === `#${targetView}`);
  });

  if (targetView === "product" && param) renderProductDetailsView(param);
  if (targetView === "category" && param) renderCategoryView(param);
  if (targetView === "brand" && param) renderBrandView(param);
}

// 5. HOME PAGE COMPONENT RENDERERS
function renderHomeCategories() {
  const container = document.getElementById("categories-scroll-row");
  container.innerHTML = state.categories.map(cat => {
    const imgSrc = getCategoryImage(cat);
    return `
      <div class="category-card" onclick="window.location.hash='#category/${cat.identifier || cat._id}'">
        <div style="width: 84px; height: 84px; border-radius: 50%; overflow: hidden; margin: 0 auto 12px; border: 2px solid var(--accent-primary); box-shadow: 0 0 16px rgba(255, 158, 44, 0.35); background: var(--bg-secondary);">
          <img src="${imgSrc}" class="category-card-img" alt="${cat.name}" style="width: 100%; height: 100%; object-fit: cover;" onError="this.onerror=null; this.src='assets/cat_tent.jpg';" />
        </div>
        <div class="category-card-title">${cat.name}</div>
      </div>
    `;
  }).join('');
}

function renderBrandLogos() {
  const container = document.getElementById("brand-grid");
  if (!container) return;

  container.innerHTML = state.suppliers.map(sup => `
    <div class="brand-card" onclick="window.location.hash='#brand/${sup.identifier || sup._id}'">
      <div style="font-size: 1.2rem; font-family: var(--font-heading);">${sup.name}</div>
      <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Verified Expedition Outfitter</div>
    </div>
  `).join('');
}

function renderCustomerReviews() {
  const container = document.getElementById("reviews-grid");
  if (!container) return;

  container.innerHTML = state.reviews.map(rev => `
    <div class="review-slider-card">
      <div style="color: var(--accent-primary); font-size: 1.1rem; margin-bottom: 8px;">★★★★★</div>
      <p style="font-style: italic; color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 16px;">"${rev.comment}"</p>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 700; font-size: 0.9rem;">${rev.userName}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${rev.location}</div>
        </div>
        <span style="color: #10b981; font-size: 0.8rem; font-weight: 700;">✓ Verified Buyer</span>
      </div>
    </div>
  `).join('');
}

// 6. PRODUCT CATALOG & MATRIX RENDERER
function renderProducts(productList, containerId = "product-grid") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = productList.map(prod => {
    const imgSrc = resolveImage(prod.image, 'assets/cat_tent.jpg');
    return `
      <div class="product-card" data-category="${prod.category}">
        <div class="product-img-wrap">
          <img src="${imgSrc}" alt="${prod.name}" class="product-img" loading="lazy" onError="this.onerror=null; this.src='assets/cat_tent.jpg';" />
          ${prod.badge ? `<span class="product-badge">${prod.badge}</span>` : ''}
          <div class="quick-view-overlay">
            <button class="quick-btn" onclick="openQuickView('${prod.identifier || prod.id}')">Quick View</button>
          </div>
        </div>
        <div class="product-details">
          <span class="product-category">${prod.categoryLabel || prod.category}</span>
          <h3 class="product-name" onclick="window.location.hash='#product/${prod.identifier || prod.id}'" style="cursor: pointer;">${prod.name}</h3>
          <div class="spec-chips">
            ${(prod.specs || []).map(s => `<span class="chip">${s}</span>`).join('')}
          </div>
          <div class="product-footer">
            <div>
              <span class="product-price">$${prod.price.toLocaleString()}</span>
            </div>
            <button class="add-cart-btn" onclick="addToCart(${prod.id || 1})">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 7. VIEW SPECIFIC PAGE LOADERS
function renderCategoryView(catId) {
  const cat = state.categories.find(c => c.identifier === catId || c._id === catId);
  const catTitleEl = document.getElementById("cat-view-title");
  if (catTitleEl) catTitleEl.innerText = cat ? cat.name : "Category Products";

  const filtered = state.products.filter(p => p.category === catId || catId === "all");
  renderProducts(filtered.length ? filtered : state.products, "category-product-grid");
}

function renderBrandView(brandId) {
  const brandTitleEl = document.getElementById("brand-view-title");
  if (brandTitleEl) brandTitleEl.innerText = `Brand Collection: ${brandId.toUpperCase()}`;
  renderProducts(state.products, "brand-product-grid");
}

function renderProductDetailsView(prodId) {
  const p = state.products.find(prod => prod.identifier === prodId || String(prod.id) === prodId);
  const container = document.getElementById("product-detail-container");
  if (!container || !p) return;

  const imgSrc = resolveImage(p.image, 'assets/cat_tent.jpg');

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; margin-top: 30px;">
      <div>
        <img src="${imgSrc}" alt="${p.name}" onError="this.onerror=null; this.src='assets/cat_tent.jpg';" style="width: 100%; border-radius: var(--radius-lg); border: 1px solid var(--border-color); box-shadow: var(--card-shadow);" />
      </div>
      <div>
        <span class="product-category">${p.categoryLabel}</span>
        <h1 style="font-size: 2.2rem; margin-bottom: 12px;">${p.name}</h1>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
          <span style="font-size: 1.8rem; font-weight: 800; color: var(--accent-primary);">$${p.price.toLocaleString()}</span>
          <span style="color: var(--text-muted); text-decoration: line-through;">$${p.originalPrice ? p.originalPrice.toLocaleString() : ''}</span>
          <span style="background: var(--badge-bg); color: var(--badge-color); font-weight: 800; font-size: 0.75rem; padding: 2px 8px; border-radius: var(--radius-pill);">IN STOCK</span>
        </div>
        <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 1.05rem; line-height: 1.7;">${p.description}</p>
        
        <div style="margin-bottom: 28px;">
          <h4 style="font-size: 0.9rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px;">Hardware Specifications</h4>
          <div class="spec-chips">
            ${p.specs.map(s => `<span class="chip" style="font-size: 0.85rem; padding: 6px 14px;">${s}</span>`).join('')}
          </div>
        </div>

        <div style="display: flex; gap: 16px;">
          <button class="btn-primary" style="flex-grow: 1; justify-content: center;" onclick="addToCart(${p.id})">Add To Rig Cart</button>
          <button class="btn-secondary" onclick="window.location.hash='#checkout'">Instant Checkout</button>
        </div>
      </div>
    </div>
  `;
}

// 8. CART & CHECKOUT CONTROLLER
function addToCart(productId) {
  const existing = state.cart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ productId, quantity: 1 });
  }
  updateCartUI();
  showToast("Added item to your Rig Cart!");
  openCartDrawer();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.productId !== productId);
  updateCartUI();
}

function updateCartUI() {
  const countEl = document.getElementById("cart-count");
  const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  if (countEl) countEl.innerText = totalCount;
  
  const bodyEl = document.getElementById("cart-body");
  const totalEl = document.getElementById("cart-total");
  
  if (!bodyEl) return;
  
  if (state.cart.length === 0) {
    bodyEl.innerHTML = `<p style="text-align: center; color: var(--text-muted); margin-top: 40px;">Your cart is empty. Add adventure gear to get started.</p>`;
    if (totalEl) totalEl.innerText = "$0";
    return;
  }
  
  let totalPrice = 0;
  bodyEl.innerHTML = state.cart.map(item => {
    const p = state.products.find(prod => prod.id === item.productId);
    if (!p) return '';
    const itemTotal = p.price * item.quantity;
    totalPrice += itemTotal;
    const imgSrc = resolveImage(p.image, 'assets/cat_tent.jpg');
    return `
      <div class="cart-item">
        <img src="${imgSrc}" alt="${p.name}" class="cart-item-img" onError="this.onerror=null; this.src='assets/cat_tent.jpg';" />
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">$${p.price.toLocaleString()} x ${item.quantity}</div>
        </div>
        <button onclick="removeFromCart(${p.id})" style="color: var(--text-muted); font-size: 1.2rem;">&times;</button>
      </div>
    `;
  }).join('');
  
  if (totalEl) totalEl.innerText = `$${totalPrice.toLocaleString()}`;
}

function openCartDrawer() {
  document.getElementById("cart-drawer")?.classList.add("open");
}

function closeCartDrawer() {
  document.getElementById("cart-drawer")?.classList.remove("open");
}

// 9. QUICK VIEW & TOAST SYSTEM
function openQuickView(productId) {
  const p = state.products.find(prod => prod.identifier === productId || String(prod.id) === String(productId));
  if (!p) return;
  
  const modal = document.getElementById("quick-view-modal");
  const modalContent = document.getElementById("modal-body-content");
  
  if (!modal || !modalContent) return;
  
  const imgSrc = resolveImage(p.image, 'assets/cat_tent.jpg');

  modalContent.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: center;">
      <img src="${imgSrc}" alt="${p.name}" onError="this.onerror=null; this.src='assets/cat_tent.jpg';" style="border-radius: var(--radius-md); width: 100%; height: 350px; object-fit: cover;" />
      <div>
        <span class="product-category">${p.categoryLabel}</span>
        <h2 style="font-size: 1.8rem; margin-bottom: 12px;">${p.name}</h2>
        <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent-primary); margin-bottom: 16px;">$${p.price.toLocaleString()}</div>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">${p.description}</p>
        <div class="spec-chips" style="margin-bottom: 24px;">
          ${p.specs.map(s => `<span class="chip">${s}</span>`).join('')}
        </div>
        <button class="btn-primary" onclick="addToCart(${p.id}); closeModal();">
          Add To Rig Cart
        </button>
      </div>
    </div>
  `;
  modal.classList.add("open");
}

function closeModal() {
  document.getElementById("quick-view-modal")?.classList.remove("open");
  document.getElementById("login-modal")?.classList.remove("open");
}

function openLoginModal() {
  document.getElementById("login-modal")?.classList.add("open");
}

function showToast(message) {
  let toast = document.getElementById("global-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "global-toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

function filterCategory(category, btnElement) {
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  if (btnElement) btnElement.classList.add("active");
  
  if (category === "all") {
    renderProducts(state.products);
  } else {
    const filtered = state.products.filter(p => p.category === category);
    renderProducts(filtered);
  }
}

function sortProducts(sortType) {
  let sorted = [...state.products];
  if (sortType === "price-low") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortType === "price-high") {
    sorted.sort((a, b) => b.price - a.price);
  } else if (sortType === "rating") {
    sorted.sort((a, b) => b.rating - a.rating);
  }
  renderProducts(sorted);
}

function setupEventListeners() {
  const searchInput = document.getElementById("live-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (!query) {
        renderProducts(state.products);
        return;
      }
      const filtered = state.products.filter(p => p.name.toLowerCase().includes(query) || p.specs.some(s => s.toLowerCase().includes(query)));
      renderProducts(filtered);
    });
  }
}
