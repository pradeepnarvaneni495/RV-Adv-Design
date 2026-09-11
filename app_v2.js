/* ==========================================================================
   RV ADVENTURE DESIGN — VERSION 2 (DEMO B ORGANIC OUTDOOR ENGINE)
   ========================================================================== */

const API_CONFIG_V2 = {
  primaryUrl: "https://backend.rvadventureaustralia.com.au/api",
  clientHeader: "USER_PANEL"
};

const v2Categories = [
  { _id: "c1", identifier: "4wd", name: "4WD", image: "assets/cat_tent.jpg" },
  { _id: "c2", identifier: "camping", name: "CAMPING RV", image: "assets/rooftop_tent.jpg" },
  { _id: "c3", identifier: "caravan", name: "CARAVAN RV", image: "assets/cat_roofrack.jpg" },
  { _id: "c4", identifier: "electrical", name: "ELECTRICAL", image: "assets/solar_generator.jpg" },
  { _id: "c5", identifier: "marine", name: "BOAT & MARINE", image: "assets/cat_kitchen.jpg" }
];

const v2Suppliers = [
  { _id: "s1", identifier: "aurora-overland", name: "Aurora Overland" },
  { _id: "s2", identifier: "apex-tents", name: "Apex Expedition" },
  { _id: "s3", identifier: "ecoflow", name: "EcoFlow Power" },
  { _id: "s4", identifier: "dometic", name: "Dometic Outdoor" },
  { _id: "s5", identifier: "arb", name: "ARB 4x4 Accessories" }
];

const v2Products = [
  {
    id: 1,
    identifier: "apex-ii-rooftop-tent",
    name: "Apex II Hard-Shell Rooftop Tent",
    category: "camping",
    categoryLabel: "Camp Shelters",
    price: 3450,
    specs: ["Carbon Shell", "2-Min Setup", "Sub-Zero Rated"],
    image: "assets/cat_tent.jpg",
    supplier: "Apex Expedition",
    description: "Aerodynamic carbon-composite hard shell rooftop tent with integrated ambient LED lighting, memory foam mattress, and high-density rainfly."
  },
  {
    id: 2,
    identifier: "aurora-x1-solar-station",
    name: "Aurora X1 2400W Solar Station",
    category: "electrical",
    categoryLabel: "Off-Grid Power",
    price: 1890,
    specs: ["2400W Peak", "LiFePO4 Cell", "400W Solar In"],
    image: "assets/solar_generator.jpg",
    supplier: "EcoFlow Power",
    description: "Military-grade portable lithium energy station. Charges from 0-80% in 45 minutes via folding solar panels or vehicle alternator."
  },
  {
    id: 3,
    identifier: "stealth-roof-rack",
    name: "Stealth Modular Roof Rack System",
    category: "caravan",
    categoryLabel: "Expedition Racks",
    price: 820,
    specs: ["T6 Aluminum", "600 lbs Load", "Low Wind Drag"],
    image: "assets/cat_roofrack.jpg",
    supplier: "Aurora Overland",
    description: "Custom laser-cut aluminum roof rack with slotted t-tracks for mounting solar panels, traction boards, and auxiliary lights."
  },
  {
    id: 4,
    identifier: "titanium-camp-kitchen",
    name: "Expedition Titanium Outdoor Kitchen",
    category: "marine",
    categoryLabel: "Kitchen Modules",
    price: 1250,
    specs: ["Slide-Out Bay", "Dual Burner", "Teak Wood Prep"],
    image: "assets/cat_kitchen.jpg",
    supplier: "Dometic Outdoor",
    description: "Compact dual-burner stainless stove unit with collapsible sink basin, spice rack, and teak wood prep cutting board."
  },
  {
    id: 5,
    identifier: "traction-recovery-boards",
    name: "All-Terrain Traction Recovery Boards",
    category: "4wd",
    categoryLabel: "Recovery Gear",
    price: 340,
    specs: ["10-Ton Rating", "UV Stabilized", "Nylon Composite"],
    image: "assets/cat_recovery.jpg",
    supplier: "ARB 4x4 Accessories",
    description: "Extreme duty recovery tracks engineered to rescue heavy adventure vans and 4x4 rigs from mud, deep sand, and snow."
  }
];

let v2State = {
  cart: [{ productId: 1, quantity: 1 }],
  rigSelection: {
    chassis: { name: "Mercedes Sprinter 170", price: 68000 },
    pack: { name: "Off-Grid Solar Pack", price: 8500 },
    interior: { name: "Adventure Teak & Leather", price: 12000 }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  setupV2Routing();
  renderV2Categories();
  renderV2Products(v2Products);
  renderV2Brands();
  updateV2CartUI();
  updateV2RigSummary();
  setupV2EventListeners();
});

// SPA HASH ROUTING CONTROLLER V2
function setupV2Routing() {
  window.addEventListener("hashchange", handleV2HashChange);
  handleV2HashChange();
}

function handleV2HashChange() {
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

  document.querySelectorAll(".spa-view-v2").forEach(v => v.classList.remove("active"));

  const activeEl = document.getElementById(`v2-view-${targetView}`);
  if (activeEl) {
    activeEl.classList.add("active");
    window.scrollTo(0, 0);
  } else {
    document.getElementById("v2-view-home")?.classList.add("active");
  }

  if (targetView === "product" && param) renderV2ProductDetails(param);
  if (targetView === "category" && param) renderV2CategoryView(param);
}

// RENDERERS
function renderV2Categories() {
  const container = document.getElementById("v2-categories-row");
  if (!container) return;

  container.innerHTML = v2Categories.map(c => `
    <div class="category-card-v2" onclick="window.location.hash='#category/${c.identifier}'">
      <div class="category-thumb-wrap-v2">
        <img src="${c.image}" alt="${c.name}" onError="this.onerror=null; this.src='assets/cat_tent.jpg';" />
      </div>
      <div style="font-weight: 800; font-size: 0.95rem;">${c.name}</div>
    </div>
  `).join('');
}

function renderV2Brands() {
  const container = document.getElementById("v2-brand-grid");
  if (!container) return;

  container.innerHTML = v2Suppliers.map(s => `
    <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 24px; text-align: center; font-weight: 800;" onclick="showToastV2('Viewing brand: ${s.name}')">
      <div style="font-size: 1.15rem; font-family: var(--font-heading); color: var(--accent-primary);">${s.name}</div>
      <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Verified Outfitter</div>
    </div>
  `).join('');
}

function renderV2Products(list, containerId = "v2-products-matrix") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = list.map(p => `
    <div class="prod-card-v2">
      <div class="prod-img-wrap-v2">
        <img src="${p.image}" alt="${p.name}" class="prod-img-v2" onError="this.onerror=null; this.src='assets/cat_tent.jpg';" />
      </div>
      <div class="prod-body-v2">
        <span style="font-size: 0.75rem; color: var(--accent-primary); font-weight: 800; text-transform: uppercase;">${p.categoryLabel}</span>
        <h3 class="prod-title-v2" onclick="window.location.hash='#product/${p.id}'" style="cursor: pointer;">${p.name}</h3>
        <div style="display: flex; gap: 6px; margin: 10px 0; flex-wrap: wrap;">
          ${p.specs.map(s => `<span style="font-size: 0.7rem; background: var(--bg-primary); padding: 3px 8px; border-radius: var(--radius-pill); font-family: var(--font-mono); border: 1px solid var(--border-color);">${s}</span>`).join('')}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border-color);">
          <span class="prod-price-v2">$${p.price.toLocaleString()}</span>
          <button class="btn-v2-primary" style="padding: 8px 16px; font-size: 0.8rem;" onclick="addV2Cart(${p.id})">+ Cart</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderV2CategoryView(catId) {
  const cat = v2Categories.find(c => c.identifier === catId);
  const titleEl = document.getElementById("v2-cat-title");
  if (titleEl) titleEl.innerText = cat ? cat.name : "Category Equipment";

  const filtered = v2Products.filter(p => p.category === catId || catId === "all");
  renderV2Products(filtered.length ? filtered : v2Products, "v2-category-products");
}

function renderV2ProductDetails(id) {
  const p = v2Products.find(prod => String(prod.id) === String(id));
  const container = document.getElementById("v2-product-detail");
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
          <button class="btn-v2-primary" style="flex-grow: 1; justify-content: center;" onclick="addV2Cart(${p.id})">Add To Rig Cart</button>
          <button class="btn-v2-secondary" onclick="window.location.hash='#checkout'">Checkout</button>
        </div>
      </div>
    </div>
  `;
}

// CART & CHECKOUT
function addV2Cart(id) {
  const existing = v2State.cart.find(i => i.productId === id);
  if (existing) existing.quantity++;
  else v2State.cart.push({ productId: id, quantity: 1 });
  updateV2CartUI();
  showToastV2("Added item to your Version 2 Cart!");
  openV2Cart();
}

function removeV2Cart(id) {
  v2State.cart = v2State.cart.filter(i => i.productId !== id);
  updateV2CartUI();
}

function updateV2CartUI() {
  const countEl = document.getElementById("v2-cart-count");
  if (countEl) countEl.innerText = v2State.cart.reduce((sum, i) => sum + i.quantity, 0);

  const bodyEl = document.getElementById("v2-cart-body");
  const totalEl = document.getElementById("v2-cart-total");
  if (!bodyEl) return;

  if (v2State.cart.length === 0) {
    bodyEl.innerHTML = `<p style="text-align: center; color: var(--text-muted); margin-top: 40px;">Cart is empty.</p>`;
    if (totalEl) totalEl.innerText = "$0";
    return;
  }

  let total = 0;
  bodyEl.innerHTML = v2State.cart.map(item => {
    const p = v2Products.find(prod => prod.id === item.productId);
    if (!p) return '';
    total += p.price * item.quantity;
    return `
      <div style="display: flex; gap: 16px; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
        <img src="${p.image}" style="width: 60px; height: 60px; border-radius: var(--radius-sm); object-fit: cover;" />
        <div style="flex-grow: 1;">
          <div style="font-weight: 700; font-size: 0.9rem;">${p.name}</div>
          <div style="color: var(--accent-primary); font-weight: 800; font-size: 0.85rem;">$${p.price.toLocaleString()} x ${item.quantity}</div>
        </div>
        <button onclick="removeV2Cart(${p.id})">&times;</button>
      </div>
    `;
  }).join('');
  if (totalEl) totalEl.innerText = `$${total.toLocaleString()}`;
}

function openV2Cart() { document.getElementById("v2-cart-drawer")?.classList.add("open"); }
function closeV2Cart() { document.getElementById("v2-cart-drawer")?.classList.remove("open"); }

// INTERACTIVE RIG BUILDER
function selectV2Rig(type, name, price, el) {
  const parent = el.closest(".option-group-v2");
  parent.querySelectorAll(".option-card-v2").forEach(c => c.classList.remove("selected"));
  el.classList.add("selected");
  v2State.rigSelection[type] = { name, price };
  updateV2RigSummary();
}

function updateV2RigSummary() {
  const summaryBox = document.getElementById("v2-rig-summary");
  if (!summaryBox) return;
  const total = v2State.rigSelection.chassis.price + v2State.rigSelection.pack.price + v2State.rigSelection.interior.price;
  summaryBox.innerHTML = `
    <div>
      <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed var(--border-color);"><span>Chassis Base:</span> <strong>${v2State.rigSelection.chassis.name} ($${v2State.rigSelection.chassis.price.toLocaleString()})</strong></div>
      <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed var(--border-color);"><span>Power & Gear:</span> <strong>${v2State.rigSelection.pack.name} ($${v2State.rigSelection.pack.price.toLocaleString()})</strong></div>
      <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed var(--border-color);"><span>Interior Layout:</span> <strong>${v2State.rigSelection.interior.name} ($${v2State.rigSelection.interior.price.toLocaleString()})</strong></div>
    </div>
    <div>
      <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent-primary); margin-top: 20px; display: flex; justify-content: space-between;">
        <span>Total Estimate:</span>
        <span>$${total.toLocaleString()}</span>
      </div>
      <button class="btn-v2-primary" style="width: 100%; margin-top: 20px; justify-content: center;" onclick="showToastV2('Rig Build Saved!')">Save & Reserve Build</button>
    </div>
  `;
}

function openV2QuickView(id) {
  const p = v2Products.find(prod => prod.id === id);
  if (!p) return;
  const modal = document.getElementById("v2-modal");
  const content = document.getElementById("v2-modal-body");
  if (!modal || !content) return;

  content.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: center;">
      <img src="${p.image}" alt="${p.name}" style="border-radius: var(--radius-md); width: 100%; height: 320px; object-fit: cover;" />
      <div>
        <span style="color: var(--accent-primary); font-weight: 800; font-size: 0.8rem; text-transform: uppercase;">${p.categoryLabel}</span>
        <h2 style="font-size: 1.8rem; margin: 8px 0 12px;">${p.name}</h2>
        <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent-primary); margin-bottom: 16px;">$${p.price.toLocaleString()}</div>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">${p.description}</p>
        <button class="btn-v2-primary" onclick="addV2Cart(${p.id}); closeV2Modal();">Add To Cart</button>
      </div>
    </div>
  `;
  modal.classList.add("open");
}

function closeV2Modal() {
  document.getElementById("v2-modal")?.classList.remove("open");
  document.getElementById("v2-login-modal")?.classList.remove("open");
}

function openV2Login() { document.getElementById("v2-login-modal")?.classList.add("open"); }

function filterV2Category(cat, btn) {
  document.querySelectorAll(".tab-btn-v2").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  const filtered = cat === "all" ? v2Products : v2Products.filter(p => p.category === cat);
  renderV2Products(filtered);
}

function showToastV2(msg) {
  let toast = document.getElementById("v2-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "v2-toast";
    toast.className = "toast-v2";
    document.body.appendChild(toast);
  }
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
}

function setupV2EventListeners() {
  const searchInput = document.getElementById("v2-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) { renderV2Products(v2Products); return; }
      const filtered = v2Products.filter(p => p.name.toLowerCase().includes(q) || p.specs.some(s => s.toLowerCase().includes(q)));
      renderV2Products(filtered);
    });
  }
}
