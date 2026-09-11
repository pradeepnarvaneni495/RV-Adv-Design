/* ==========================================================================
   RV ADVENTURE DESIGN - VERSION 2 (BEHANCE LIGHT THEME ENGINE)
   ========================================================================== */

const API_CONFIG_V2 = {
  primaryUrl: "https://backend.rvadventureaustralia.com.au/api",
  clientHeader: "USER_PANEL"
};

const v2Products = [
  {
    id: 1,
    name: "Apex II Hard-Shell Rooftop Tent",
    categoryLabel: "Expedition Shelters",
    price: 3450,
    specs: ["Carbon Shell", "2-Min Setup", "Sub-Zero Rated"],
    image: "assets/cat_tent.jpg",
    desc: "Aerodynamic carbon-composite hard shell rooftop tent with integrated ambient LED lighting and high-density memory foam mattress."
  },
  {
    id: 2,
    name: "Aurora X1 2400W Solar Station",
    categoryLabel: "Off-Grid Power Systems",
    price: 1890,
    specs: ["2400W Peak", "LiFePO4 Cell", "400W Solar In"],
    image: "assets/solar_generator.jpg",
    desc: "Military-grade portable lithium energy station. Charges from 0-80% in 45 minutes via folding solar panels or vehicle alternator."
  },
  {
    id: 3,
    name: "Stealth Modular Roof Rack System",
    categoryLabel: "Overland Hardpoints",
    price: 820,
    specs: ["T6 Aluminum", "600 lbs Load", "Low Wind Drag"],
    image: "assets/cat_roofrack.jpg",
    desc: "Custom laser-cut aluminum roof rack with slotted t-tracks for mounting solar panels, traction boards, and auxiliary lights."
  },
  {
    id: 4,
    name: "Expedition Titanium Outdoor Kitchen",
    categoryLabel: "Camp Living Modules",
    price: 1250,
    specs: ["Slide-Out Bay", "Dual Burner", "Teak Wood Prep"],
    image: "assets/cat_kitchen.jpg",
    desc: "Compact dual-burner stainless stove unit with collapsible sink basin, spice rack, and teak wood prep cutting board."
  },
  {
    id: 5,
    name: "All-Terrain Traction Recovery Boards",
    categoryLabel: "Recovery Essentials",
    price: 340,
    specs: ["10-Ton Rating", "UV Stabilized", "Nylon Composite"],
    image: "assets/cat_recovery.jpg",
    desc: "Extreme duty recovery tracks engineered to rescue heavy adventure vans and 4x4 rigs from mud, deep sand, and snow."
  }
];

let v2Cart = [{ productId: 1, quantity: 1 }];

document.addEventListener("DOMContentLoaded", () => {
  initConcept();
  renderV2Products();
  updateV2CartUI();
});

// CONCEPT SWITCHER (Editorial vs Minimalist vs Technical)
function initConcept() {
  const savedConcept = localStorage.getItem("rv_v2_concept") || "editorial";
  setConcept(savedConcept);
}

function setConcept(conceptName) {
  document.documentElement.setAttribute("data-concept", conceptName);
  localStorage.setItem("rv_v2_concept", conceptName);

  document.querySelectorAll(".concept-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-set-concept") === conceptName);
  });

  const titles = {
    editorial: "Concept 1: Alpine Editorial Magazine",
    minimalist: "Concept 2: Scandinavian Neo-Minimalist",
    technical: "Concept 3: Technical Outfitter Blueprint"
  };

  showToastV2(`Activated ${titles[conceptName] || conceptName}`);
}

function renderV2Products() {
  const container = document.getElementById("v2-products-matrix");
  if (!container) return;

  container.innerHTML = v2Products.map(p => `
    <div class="prod-card-v2">
      <img src="${p.image}" alt="${p.name}" class="prod-img-v2" onError="this.onerror=null; this.src='assets/cat_tent.jpg';" />
      <div class="prod-body-v2">
        <span style="font-size: 0.75rem; color: var(--accent-primary); font-weight: 700; text-transform: uppercase;">${p.categoryLabel}</span>
        <h3 class="prod-title-v2">${p.name}</h3>
        <div style="display: flex; gap: 6px; margin: 12px 0;">
          ${p.specs.map(s => `<span style="font-size: 0.7rem; background: var(--bg-secondary); padding: 3px 8px; border-radius: var(--radius-pill); font-family: var(--font-mono);">${s}</span>`).join('')}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px;">
          <span class="prod-price-v2">$${p.price.toLocaleString()}</span>
          <button class="btn-v2-primary" style="padding: 8px 18px; font-size: 0.85rem;" onclick="addV2Cart(${p.id})">+ Quick Add</button>
        </div>
      </div>
    </div>
  `).join('');
}

function addV2Cart(id) {
  const existing = v2Cart.find(i => i.productId === id);
  if (existing) existing.quantity++;
  else v2Cart.push({ productId: id, quantity: 1 });
  updateV2CartUI();
  showToastV2("Added item to your Version 2 Cart!");
}

function updateV2CartUI() {
  const countEl = document.getElementById("v2-cart-count");
  if (countEl) countEl.innerText = v2Cart.reduce((sum, i) => sum + i.quantity, 0);
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
        <span style="color: var(--accent-primary); font-weight: 700; font-size: 0.8rem; text-transform: uppercase;">${p.categoryLabel}</span>
        <h2 style="font-size: 1.8rem; margin: 8px 0 12px;">${p.name}</h2>
        <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent-primary); margin-bottom: 16px;">$${p.price.toLocaleString()}</div>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">${p.desc}</p>
        <button class="btn-v2-primary" onclick="addV2Cart(${p.id}); closeV2Modal();">Add To Cart</button>
      </div>
    </div>
  `;
  modal.classList.add("open");
}

function closeV2Modal() {
  document.getElementById("v2-modal")?.classList.remove("open");
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
