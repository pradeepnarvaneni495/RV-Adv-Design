/* ==========================================================================
   RV ADVENTURE DESIGN — PURE ORGANIC OUTDOOR ENGINE (FULL SPA APPLICATION)
   ========================================================================== */

const API_CONFIG = {
  primaryUrl: "https://backend.rvadventureaustralia.com.au/api",
  fallbackUrl: "http://localhost:5000/api",
  clientHeader: "USER_PANEL"
};

let currentApiUrl = API_CONFIG.primaryUrl;

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
      category: "camping",
      categoryLabel: "CAMPING RV",
      price: 3450,
      originalPrice: 3890,
      rating: 4.9,
      reviewsCount: 84,
      badge: "Bestseller",
      specs: ["Carbon Shell", "2-Min Setup", "Sub-Zero Rated"],
      image: "assets/cat_tent.jpg",
      supplier: "Apex Expedition",
      description: "Aerodynamic carbon-composite hard shell rooftop tent with integrated ambient LED lighting, memory foam mattress, and high-density rainfly."
    },
    {
      id: 2,
      _id: "p2",
      identifier: "aurora-x1-solar-station",
      name: "Aurora X1 2400W Solar Station",
      category: "electrical",
      categoryLabel: "ELECTRICAL",
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
      category: "caravan",
      categoryLabel: "CARAVAN RV",
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
      category: "marine",
      categoryLabel: "BOAT & MARINE",
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
      category: "4wd",
      categoryLabel: "4WD",
      price: 340,
      originalPrice: 390,
      rating: 4.7,
      reviewsCount: 95,
      badge: "Essential",
      specs: ["10-Ton Rating", "UV Stabilized", "Nylon Composite"],
      image: "assets/cat_recovery.jpg",
      supplier: "ARB 4x4 Accessories",
      description: "Extreme duty recovery tracks engineered to rescue heavy adventure vans and 4x4 rigs from mud, deep sand, and snow."
    }
  ],
  reviews: [
    { userName: "Captain Mark Vance", rating: 5, comment: "The 5kWh Lithium Powerpack powered our Sprinter van heater and fridge for 5 days in the Australian outback without breaking a sweat!", location: "Tasmania Expedition" },
    { userName: "Elena Rostova", rating: 5, comment: "The Apex II tent setup takes literally 90 seconds. Best overland investment we've ever made.", location: "High Country NSW" },
    { userName: "Marcus Brody", rating: 4.9, comment: "Aurora X1 solar generator recharges insanely fast from our rooftop solar setup. Premium build quality.", location: "Kimberley Overland" }
  ]
};

let state = {
  categories: [],
  suppliers: [],
  products: [],
  reviews: [],
  cart: [{ productId: 1, quantity: 1 }],
  activeView: "home"
};

function initTheme() {
  const savedTheme = localStorage.getItem("rv_theme") || "light";
  setTheme(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const newTheme = current === "dark" ? "light" : "dark";
  setTheme(newTheme);
  showToast(`Switched to ${newTheme === "light" ? "Organic Light Mode" : "Dark Luxury Mode"}`);
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("rv_theme", theme);
  const btn = document.getElementById("theme-toggle-btn");
  if (btn) {
    if (theme === "light") {
      btn.innerHTML = `<span class="theme-icon">☀️</span> <span class="theme-text">Light Mode</span>`;
    } else {
      btn.innerHTML = `<span class="theme-icon">🌙</span> <span class="theme-text">Dark Mode</span>`;
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
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
  state.categories = mockData.categories;
  state.suppliers = mockData.suppliers;
  state.products = mockData.products;
  state.reviews = mockData.reviews;
}

// SPA HASH ROUTING CONTROLLER
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

  document.querySelectorAll(".nav-menu a").forEach(link => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === `#${targetView}`);
  });

  if (targetView === "product" && param) renderProductDetailsView(param);
  if (targetView === "category" && param) renderCategoryView(param);
  if (targetView === "brand" && param) renderBrandView(param);
}

// COMPONENT RENDERERS
function renderHomeCategories() {
  const container = document.getElementById("categories-scroll-row");
  if (!container) return;

  container.innerHTML = state.categories.map(cat => `
    <div class="category-card" onclick="window.location.hash='#category/${cat.identifier || cat._id}'">
      <div class="category-thumb-wrap">
        <img src="${cat.image}" alt="${cat.name}" onError="this.onerror=null; this.src='assets/cat_tent.jpg';" />
      </div>
      <div style="font-weight: 800; font-size: 0.95rem;">${cat.name}</div>
    </div>
  `).join('');
}

function renderBrandLogos() {
  const container = document.getElementById("brand-grid");
  if (!container) return;

  container.innerHTML = state.suppliers.map(sup => `
    <div class="category-card" onclick="window.location.hash='#brand/${sup.identifier || sup._id}'" style="padding: 20px;">
      <div style="font-size: 1.15rem; font-family: var(--font-heading); color: var(--accent-primary); font-weight: 800;">${sup.name}</div>
      <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Verified Outfitter</div>
    </div>
  `).join('');
}

function renderCustomerReviews() {
  const container = document.getElementById("reviews-grid");
  if (!container) return;

  container.innerHTML = state.reviews.map(rev => `
    <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 24px;">
      <div style="color: var(--accent-primary); font-size: 1.1rem; margin-bottom: 8px;">★★★★★</div>
      <p style="font-style: italic; color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 16px;">"${rev.comment}"</p>
      <div style="font-weight: 700; font-size: 0.9rem;">${rev.userName} • <span style="color: var(--text-muted);">${rev.location}</span></div>
    </div>
  `).join('');
}

function renderProducts(productList, containerId = "product-grid") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = productList.map(prod => `
    <div class="product-card" data-category="${prod.category}">
      <div class="product-img-wrap">
        <img src="${prod.image}" alt="${prod.name}" class="product-img" onError="this.onerror=null; this.src='assets/cat_tent.jpg';" />
      </div>
      <div class="product-details">
        <span style="font-size: 0.75rem; color: var(--accent-primary); font-weight: 800; text-transform: uppercase;">${prod.categoryLabel || prod.category}</span>
        <h3 class="product-name" onclick="window.location.hash='#product/${prod.identifier || prod.id}'" style="cursor: pointer;">${prod.name}</h3>
        <div class="spec-chips">
          ${(prod.specs || []).map(s => `<span class="chip">${s}</span>`).join('')}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border-color);">
          <span class="product-price">$${prod.price.toLocaleString()}</span>
          <button class="btn-primary" style="padding: 8px 16px; font-size: 0.8rem;" onclick="addToCart(${prod.id})">+ Cart</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderCategoryView(catId) {
  const cat = state.categories.find(c => c.identifier === catId || c._id === catId);
  const titleEl = document.getElementById("cat-view-title");
  if (titleEl) titleEl.innerText = cat ? cat.name : "Category Hardware";

  const filtered = state.products.filter(p => p.category === catId || catId === "all");
  renderProducts(filtered.length ? filtered : state.products, "category-product-grid");
}

function renderBrandView(brandId) {
  const sup = state.suppliers.find(s => s.identifier === brandId || s._id === brandId);
  const titleEl = document.getElementById("brand-view-title");
  if (titleEl) titleEl.innerText = sup ? sup.name : "Verified Outfitter";

  const filtered = state.products.filter(p => p.supplier.toLowerCase().includes(brandId.toLowerCase()));
  renderProducts(filtered.length ? filtered : state.products, "brand-product-grid");
}

function renderProductDetailsView(id) {
  const p = state.products.find(prod => prod.identifier === id || String(prod.id) === String(id));
  const container = document.getElementById("product-details-container");
  if (!container || !p) return;

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start;">
      <img src="${p.image}" alt="${p.name}" style="width: 100%; border-radius: var(--radius-lg); border: 1px solid var(--border-color); box-shadow: var(--card-shadow);" />
      <div>
        <span style="color: var(--accent-primary); font-weight: 800; font-size: 0.8rem; text-transform: uppercase;">${p.categoryLabel}</span>
        <h1 style="font-size: 2.2rem; margin: 8px 0 12px;">${p.name}</h1>
        <div style="font-size: 1.8rem; font-weight: 800; color: var(--accent-primary); margin-bottom: 16px;">$${p.price.toLocaleString()}</div>
        <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 1.05rem; line-height: 1.7;">${p.description}</p>
        <div style="display: flex; gap: 16px;">
          <button class="btn-primary" style="flex-grow: 1; justify-content: center;" onclick="addToCart(${p.id})">Add To Rig Cart</button>
          <button class="btn-secondary" onclick="window.location.hash='#checkout'">Instant Checkout</button>
        </div>
      </div>
    </div>
  `;
}

// CART CONTROLLER
function addToCart(productId) {
  const existing = state.cart.find(item => item.productId === productId);
  if (existing) existing.quantity += 1;
  else state.cart.push({ productId, quantity: 1 });
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
  if (countEl) countEl.innerText = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const bodyEl = document.getElementById("cart-body");
  const totalEl = document.getElementById("cart-total");
  
  if (!bodyEl) return;
  
  if (state.cart.length === 0) {
    bodyEl.innerHTML = `<p style="text-align: center; color: var(--text-muted); margin-top: 40px;">Your cart is empty.</p>`;
    if (totalEl) totalEl.innerText = "$0";
    return;
  }
  
  let totalPrice = 0;
  bodyEl.innerHTML = state.cart.map(item => {
    const p = state.products.find(prod => prod.id === item.productId);
    if (!p) return '';
    totalPrice += p.price * item.quantity;
    return `
      <div style="display: flex; gap: 16px; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
        <img src="${p.image}" style="width: 60px; height: 60px; border-radius: var(--radius-sm); object-fit: cover;" />
        <div style="flex-grow: 1;">
          <div style="font-weight: 700; font-size: 0.9rem;">${p.name}</div>
          <div style="color: var(--accent-primary); font-weight: 800; font-size: 0.85rem;">$${p.price.toLocaleString()} x ${item.quantity}</div>
        </div>
        <button onclick="removeFromCart(${p.id})">&times;</button>
      </div>
    `;
  }).join('');
  
  if (totalEl) totalEl.innerText = `$${totalPrice.toLocaleString()}`;
}

function openCartDrawer() { document.getElementById("cart-drawer")?.classList.add("open"); }
function closeCartDrawer() { document.getElementById("cart-drawer")?.classList.remove("open"); }

function openQuickView(productId) {
  const p = state.products.find(prod => prod.identifier === productId || String(prod.id) === String(productId));
  if (!p) return;
  const modal = document.getElementById("quick-view-modal");
  const modalContent = document.getElementById("modal-body-content");
  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: center;">
      <img src="${p.image}" alt="${p.name}" style="border-radius: var(--radius-md); width: 100%; height: 320px; object-fit: cover;" />
      <div>
        <span style="color: var(--accent-primary); font-weight: 800; font-size: 0.8rem; text-transform: uppercase;">${p.categoryLabel}</span>
        <h2 style="font-size: 1.8rem; margin: 8px 0 12px;">${p.name}</h2>
        <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent-primary); margin-bottom: 16px;">$${p.price.toLocaleString()}</div>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">${p.description}</p>
        <button class="btn-primary" onclick="addToCart(${p.id}); closeQuickViewModal();">Add To Cart</button>
      </div>
    </div>
  `;
  modal.classList.add("open");
}

function closeQuickViewModal() {
  document.getElementById("quick-view-modal")?.classList.remove("open");
  document.getElementById("login-modal")?.classList.remove("open");
}

function openLoginModal() { document.getElementById("login-modal")?.classList.add("open"); }

function filterProducts(cat, btn) {
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  const filtered = cat === "all" ? state.products : state.products.filter(p => p.category === cat);
  renderProducts(filtered);
}

function showToast(msg) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
}

function setupEventListeners() {
  const searchInput = document.getElementById("live-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) { renderProducts(state.products); return; }
      const filtered = state.products.filter(p => p.name.toLowerCase().includes(q) || p.specs.some(s => s.toLowerCase().includes(q)));
      renderProducts(filtered);
    });
  }
}
