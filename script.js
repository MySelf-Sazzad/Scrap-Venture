/* =========================================================
   Scrap Venture — Eco Marketplace (single-file build)
   script.js — everything: product data layer, router, and
   view rendering for Marketplace, Product Details, and Admin.
   Only market.html needs to be opened; routes are handled
   with the URL hash (#/, #/product/ID, #/admin) so the whole
   site works from one file with no server required.
   ========================================================= */

/* =====================================================
   1. PRODUCT DATA LAYER (ProductStore)
   Single source of truth. Every view reads/writes through
   these functions only — swap localStorage for Firebase or
   a REST API later by editing just this block.
   ===================================================== */

const ProductStore = (function () {
  const STORAGE_KEY = "sv_marketplace_products_v3";
  const EVENT_NAME = "sv:products-updated";

  const CATEGORIES = [
    "Recycled Plastic",
    "Metal Products",
    "Furniture & Outdoor",
    "Biodegradable Bags",
    "Recycled Products",
    "Other",
  ];

  const DEMO_PRODUCTS = [
    {
      id: 1,
      name: "Recycled Plastic Flower Tub",
      image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
      description: "Durable garden flower tub made from 100% recycled post-consumer plastic.",
      fullDescription: "High-grade weather-resistant flower pot crafted from recycled ocean plastic and household scrap. Features built-in drainage holes and anti-UV protection for long-lasting outdoor garden use.",
      price: 350,
      category: "Recycled Plastic",
      features: ["100% Recycled HD Plastic", "UV and Weather Resistant", "Built-in Drainage Tray", "Capacity: 12 Liters"],
      available: true,
      status: "In Stock",
      dateAdded: Date.now() - 1000 * 60 * 60 * 24 * 1,
    },
    {
      id: 2,
      name: "Segregated 3-Compartment Trash Bin",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
      description: "Color-coded segregated recycling bin for plastic, metal, and organic waste.",
      fullDescription: "Heavy-duty 3-slot waste sorting bin manufactured from recycled plastic body with sturdy metal foot pedals. Designed for easy waste segregation in homes, offices, and institutions.",
      price: 1250,
      category: "Recycled Plastic",
      features: ["3 Color-Coded Compartments", "Hands-Free Foot Pedals", "Odour-Lock Lids", "Total Capacity: 45 Liters"],
      available: true,
      status: "In Stock",
      dateAdded: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    {
      id: 3,
      name: "Recycled Plastic & Metal Park Bench",
      image: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80",
      description: "Heavy-duty outdoor bench made from recycled plastic lumber and scrap steel frame.",
      fullDescription: "Weatherproof outdoor park bench built from recycled plastic wood slats and a reinforced scrap metal frame. Will not rot, splinter, or rust over time, replacing traditional timber benches.",
      price: 4500,
      category: "Furniture & Outdoor",
      features: ["Recycled Plastic Slats", "Powder-Coated Steel Frame", "Seats 3 Adults", "Rust & Weatherproof"],
      available: true,
      status: "In Stock",
      dateAdded: Date.now() - 1000 * 60 * 60 * 24 * 3,
    },
    {
      id: 4,
      name: "Biodegradable Plastic Bags (Pack of 50)",
      image: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80",
      description: "100% compostable and biodegradable heavy-duty trash and grocery bags.",
      fullDescription: "Eco-friendly biodegradable bags made from plant-based polymers (PBAT + PLA cornstarch). Completely breaks down in soil within 180 days without leaving microplastics behind.",
      price: 280,
      category: "Biodegradable Bags",
      features: ["100% Plant-Based PLA", "180-Day Home Compostable", "Leak-Proof Bottom Seal", "Pack of 50 Bags"],
      available: true,
      status: "In Stock",
      dateAdded: Date.now() - 1000 * 60 * 60 * 24 * 4,
    },
    {
      id: 5,
      name: "Recycled Metal & Plastic Garden Chair",
      image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",
      description: "Ergonomic patio chair crafted from recycled plastic mesh and iron scrap frame.",
      fullDescription: "A stylish and comfortable garden seating chair constructed with woven recycled plastic strips over an upcycled iron pipe frame. Resistant to sun exposure and rainwater.",
      price: 1850,
      category: "Furniture & Outdoor",
      features: ["Upcycled Scrap Metal Frame", "Woven Recycled Plastic Seat", "Ergonomic Back Support", "Stackable Design"],
      available: true,
      status: "In Stock",
      dateAdded: Date.now() - 1000 * 60 * 60 * 24 * 5,
    },
    {
      id: 6,
      name: "Heavy-Duty Metal Recycling Dustbin",
      image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80",
      description: "Commercial-grade stainless metal dustbin with removable plastic inner bucket.",
      fullDescription: "Premium metal dustbin crafted from recycled stainless steel sheets. Features a foot-operated lid, anti-fingerprint coating, and a removable internal bin made of recycled plastic.",
      price: 2100,
      category: "Metal Products",
      features: ["Recycled Stainless Steel", "Removable Inner Plastic Bucket", "Anti-Fingerprint Coating", "Capacity: 20 Liters"],
      available: true,
      status: "In Stock",
      dateAdded: Date.now() - 1000 * 60 * 60 * 24 * 6,
    },
    {
      id: 7,
      name: "Biodegradable Garbage Bag Rolls",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      description: "Large biodegradable waste disposal bags on convenient tear-off rolls.",
      fullDescription: "Extra thick 30-liter waste disposal bags engineered for heavy household and commercial waste. Fully certified EN 13432 biodegradable.",
      price: 320,
      category: "Biodegradable Bags",
      features: ["EN 13432 Certified Compostable", "Extra Thick 25 Micron", "Convenient Roll Packaging", "Fits Standard 30L Bins"],
      available: true,
      status: "In Stock",
      dateAdded: Date.now() - 1000 * 60 * 60 * 24 * 7,
    },
    {
      id: 8,
      name: "Recycled Plastic Hanging Flower Tub",
      image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=800&q=80",
      description: "Lightweight hanging planter pot made from molded recycled plastic bottles.",
      fullDescription: "Perfect for balcony and indoor greenery, this hanging tub is molded from 100% recycled PET plastic bottles and comes with a durable metal hanging chain.",
      price: 220,
      category: "Recycled Plastic",
      features: ["Molded Recycled PET Plastic", "Includes Metal Chain & Hook", "Self-Watering Reservoir", "UV Protection"],
      available: true,
      status: "In Stock",
      dateAdded: Date.now() - 1000 * 60 * 60 * 24 * 8,
    },
    {
      id: 9,
      name: "Metal Scrap Utility Storage Bin",
      image: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=800&q=80",
      description: "Industrial metal wire mesh storage basket made from upcycled iron scrap.",
      fullDescription: "Multi-purpose heavy-duty storage crate manufactured from upcycled scrap metal wire. Perfect for organizing workshop tools, scrap materials, or outdoor equipment.",
      price: 1600,
      category: "Metal Products",
      features: ["100% Upcycled Scrap Metal", "Industrial Powder Coating", "Side Carry Handles", "Heavy Load Capacity"],
      available: true,
      status: "In Stock",
      dateAdded: Date.now() - 1000 * 60 * 60 * 24 * 9,
    },
    {
      id: 10,
      name: "Recycled Plastic Outdoor Table & Chair Set",
      image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
      description: "4-seater dining patio table and chair set made from recycled plastic lumber.",
      fullDescription: "A complete outdoor dining furniture set featuring 1 table and 4 chairs built from high-density recycled plastic (HDPE). Weather-proof, maintenance-free, and termite-resistant.",
      price: 8500,
      category: "Furniture & Outdoor",
      features: ["High-Density HDPE Plastic", "Includes 1 Table + 4 Chairs", "Maintenance Free", "Termite & Rust Proof"],
      available: true,
      status: "In Stock",
      dateAdded: Date.now() - 1000 * 60 * 60 * 24 * 10,
    },
  ];

  function safeParse(json) {
    try {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : null;
    } catch (err) {
      return null;
    }
  }

  function init() {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_PRODUCTS));
    }
  }

  function notifyUpdated() {
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  }

  function getAll() {
    init();
    return safeParse(localStorage.getItem(STORAGE_KEY)) || [];
  }

  function getById(id) {
    return getAll().find((p) => String(p.id) === String(id)) || null;
  }

  function save(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    notifyUpdated();
  }

  function add(product) {
    const products = getAll();
    const nextId = products.length > 0 ? Math.max(...products.map((p) => Number(p.id) || 0)) + 1 : 1;
    const newProduct = Object.assign(
      { id: nextId, dateAdded: Date.now(), status: product.available === false ? "Out of Stock" : "In Stock" },
      product,
      { id: nextId, dateAdded: Date.now() }
    );
    products.push(newProduct);
    save(products);
    return newProduct;
  }

  function update(id, updates) {
    const products = getAll();
    const index = products.findIndex((p) => String(p.id) === String(id));
    if (index === -1) return null;
    const merged = Object.assign({}, products[index], updates, { id: products[index].id, dateAdded: products[index].dateAdded });
    products[index] = merged;
    save(products);
    return merged;
  }

  function remove(id) {
    save(getAll().filter((p) => String(p.id) !== String(id)));
  }

  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) notifyUpdated();
  });

  return { EVENT_NAME, CATEGORIES, getAll, getById, add, update, remove };
})();

/* =====================================================
   2. SHARED HELPERS
   ===================================================== */

function currencyFormat(amount) {
  return "৳" + Number(amount).toLocaleString("en-BD");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

/* =====================================================
   3. CART & CHECKOUT
   Cart and completed orders are retained in this browser.
   ===================================================== */
const Cart = (function () {
  const STORAGE_KEY = "sv_marketplace_cart_v1";
  const ORDER_KEY = "sv_marketplace_orders_v1";
  let wired = false;

  function getItems() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
  }
  function save(items) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); render(); }
  function detailedItems() { return getItems().map((item) => ({ ...item, product: ProductStore.getById(item.id) })).filter((item) => item.product); }
  function totalQuantity() { return getItems().reduce((sum, item) => sum + item.quantity, 0); }
  function totalPrice() { return detailedItems().reduce((sum, item) => sum + item.product.price * item.quantity, 0); }
  function add(product) {
    const items = getItems(); const existing = items.find((item) => String(item.id) === String(product.id));
    if (existing) existing.quantity += 1; else items.push({ id: product.id, quantity: 1 });
    save(items); showToast(`${product.name} added to your cart`);
  }
  function update(id, quantity) { save(getItems().map((item) => String(item.id) === String(id) ? { ...item, quantity } : item).filter((item) => item.quantity > 0)); }
  function closeCart() { document.getElementById("cartOverlay").classList.remove("open"); }
  function render() {
    const items = detailedItems(); const count = totalQuantity();
    document.getElementById("cartBadge").textContent = count;
    document.getElementById("cartBadge").classList.toggle("is-empty", count === 0);
    document.getElementById("cartDrawerCount").textContent = count;
    document.getElementById("cartTotalPrice").textContent = currencyFormat(totalPrice());
    document.getElementById("proceedCheckoutBtn").disabled = items.length === 0;
    document.getElementById("cartItemsList").innerHTML = items.length ? items.map(({ id, quantity, product }) => `
      <article class="cart-item"><img src="${product.image}" alt="${product.name}" /><div class="cart-item__info"><h4>${product.name}</h4><p>${currencyFormat(product.price)}</p><div class="cart-quantity"><button data-cart-action="decrease" data-id="${id}" aria-label="Decrease quantity">−</button><span>${quantity}</span><button data-cart-action="increase" data-id="${id}" aria-label="Increase quantity">+</button><button class="cart-remove" data-cart-action="remove" data-id="${id}">Remove</button></div></div><strong>${currencyFormat(product.price * quantity)}</strong></article>`).join("") : `<div class="cart-empty"><span>🛒</span><p>Your cart is empty.</p><small>Add a product to continue.</small></div>`;
  }
  function openCheckout() {
    const items = detailedItems(); if (!items.length) return;
    document.getElementById("checkoutSummaryList").innerHTML = items.map(({ product, quantity }) => `<div class="checkout-item"><span>${product.name} × ${quantity}</span><strong>${currencyFormat(product.price * quantity)}</strong></div>`).join("");
    document.getElementById("checkoutTotalAmount").textContent = currencyFormat(totalPrice());
    closeCart(); document.getElementById("checkoutModalOverlay").classList.add("open");
  }
  function placeOrder(event) {
    event.preventDefault(); const items = detailedItems(); if (!items.length) return;
    const order = { id: `SV-${Date.now().toString().slice(-8)}`, createdAt: new Date().toISOString(), status: "Pending", items: items.map(({ id, quantity, product }) => ({ id, name: product.name, price: product.price, quantity })), total: totalPrice(), customer: { name: document.getElementById("custName").value.trim(), phone: document.getElementById("custPhone").value.trim(), email: document.getElementById("custEmail").value.trim(), city: document.getElementById("custCity").value.trim(), address: document.getElementById("custAddress").value.trim(), payment: document.querySelector('input[name="paymentMethod"]:checked').value } };
    let orders; try { orders = JSON.parse(localStorage.getItem(ORDER_KEY)) || []; } catch { orders = []; }
    orders.unshift(order); localStorage.setItem(ORDER_KEY, JSON.stringify(orders)); window.dispatchEvent(new CustomEvent("sv:orders-updated")); localStorage.removeItem(STORAGE_KEY); render();
    document.getElementById("checkoutModalOverlay").classList.remove("open"); event.target.reset(); showToast(`Order ${order.id} placed successfully!`);
  }
  function mount() {
    render(); if (wired) return; wired = true;
    document.getElementById("openCartBtn").addEventListener("click", () => document.getElementById("cartOverlay").classList.add("open"));
    document.getElementById("closeCartBtn").addEventListener("click", closeCart);
    document.getElementById("cartOverlay").addEventListener("click", (e) => { if (e.target.id === "cartOverlay") closeCart(); });
    document.getElementById("cartItemsList").addEventListener("click", (e) => { const button = e.target.closest("button[data-cart-action]"); if (!button) return; const item = getItems().find((entry) => String(entry.id) === button.dataset.id); if (!item) return; if (button.dataset.cartAction === "increase") update(item.id, item.quantity + 1); if (button.dataset.cartAction === "decrease") update(item.id, item.quantity - 1); if (button.dataset.cartAction === "remove") update(item.id, 0); });
    document.getElementById("proceedCheckoutBtn").addEventListener("click", openCheckout);
    document.getElementById("closeCheckoutModal").addEventListener("click", () => document.getElementById("checkoutModalOverlay").classList.remove("open"));
    document.getElementById("cancelCheckoutBtn").addEventListener("click", () => document.getElementById("checkoutModalOverlay").classList.remove("open"));
    document.getElementById("checkoutModalOverlay").addEventListener("click", (e) => { if (e.target.id === "checkoutModalOverlay") e.currentTarget.classList.remove("open"); });
    document.getElementById("checkoutForm").addEventListener("submit", placeOrder);
  }
  return { add, mount };
})();

/* =====================================================
   4. MARKETPLACE VIEW
   ===================================================== */

const Marketplace = (function () {
  const ALL_LABEL = "All Products";
  const state = { category: ALL_LABEL, sort: "default", query: "" };
  let wired = false;

  function buildCategoryChips() {
    const chipsContainer = document.getElementById("categoryChips");
    const categories = [ALL_LABEL, ...ProductStore.CATEGORIES];
    chipsContainer.innerHTML = categories
      .map((cat) => `<button type="button" class="chip${cat === state.category ? " active" : ""}" data-category="${cat}">${cat}</button>`)
      .join("");

    chipsContainer.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        state.category = chip.dataset.category;
        buildCategoryChips();
        render();
      });
    });
  }

  function applyFilters(products) {
    let result = products.slice();

    if (state.category !== ALL_LABEL) {
      result = result.filter((p) => p.category === state.category);
    }
    if (state.query.trim() !== "") {
      const q = state.query.trim().toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    switch (state.sort) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "newest": result.sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0)); break;
    }
    return result;
  }

  function productCard(product) {
    const outOfStock = product.available === false;
    return `
      <article class="product-card" data-product-id="${product.id}" tabindex="0" role="link" aria-label="View details for ${product.name}">
        <div class="product-card__image">
          ${outOfStock ? '<span class="product-card__badge out">Out of Stock</span>' : ""}
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
        </div>
        <div class="product-card__body">
          <span class="product-card__category">${product.category}</span>
          <h3 class="product-card__name">${product.name}</h3>
          <p class="product-card__desc">${product.description}</p>
          <div class="product-card__footer">
            <span class="product-card__price">${currencyFormat(product.price)}</span>
            <a class="product-card__btn" href="#/product/${product.id}">View Details</a>
          </div>
        </div>
      </article>`;
  }

  function emptyState() {
    return `
      <div class="state-message">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="7"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <p>No sustainable products found. Try a different search or category.</p>
      </div>`;
  }

  function render() {
    const grid = document.getElementById("productGrid");
    const resultsMeta = document.getElementById("resultsMeta");
    const filtered = applyFilters(ProductStore.getAll());

    grid.innerHTML = filtered.length === 0 ? emptyState() : filtered.map(productCard).join("");
    resultsMeta.textContent = `${filtered.length} product${filtered.length === 1 ? "" : "s"} found`;
  }

  function wireEvents() {
    if (wired) return;
    wired = true;

    document.getElementById("searchForm").addEventListener("submit", (e) => {
      e.preventDefault();
      state.query = document.getElementById("searchInput").value;
      render();
    });
    document.getElementById("searchInput").addEventListener("input", (e) => {
      state.query = e.target.value;
      render();
    });
    document.getElementById("sortSelect").addEventListener("change", (e) => {
      state.sort = e.target.value;
      render();
    });
    document.getElementById("productGrid").addEventListener("click", (e) => {
      if (e.target.closest("a, button")) return;
      const card = e.target.closest("[data-product-id]");
      if (card) window.location.hash = `#/product/${card.dataset.productId}`;
    });
    document.getElementById("productGrid").addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-product-id]")) { e.preventDefault(); window.location.hash = `#/product/${e.target.dataset.productId}`; }
    });
    window.addEventListener(ProductStore.EVENT_NAME, render);
  }

  function mount() {
    wireEvents();
    buildCategoryChips();
    render();
  }

  return { mount };
})();

/* =====================================================
   4. PRODUCT DETAILS VIEW
   ===================================================== */

const ProductDetails = (function () {
  let currentId = null;
  let wired = false;

  function notFoundState() {
    document.getElementById("detailsRoot").innerHTML = `
      <div class="state-message" style="padding:80px 0;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>We couldn't find that product. It may have been removed.</p>
        <p style="margin-top:14px;">
          <a class="btn-secondary" href="#/" data-route="market">Back to Marketplace</a>
        </p>
      </div>`;
  }

  function renderProduct(product) {
    document.getElementById("pageTitle").textContent = "Scrap Venture";
    document.getElementById("breadcrumbName").textContent = product.name;

    const outOfStock = product.available === false;
    const features = (product.features || [])
      .map((f) => `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>${f}</li>`)
      .join("");

    document.getElementById("detailsRoot").innerHTML = `
      <div class="details-grid">
        <div class="details-image">
          <img src="${product.image}" alt="${product.name}" />
        </div>
        <div>
          <div class="details-category">${product.category}</div>
          <h1 class="details-name">${product.name}</h1>
          <div class="details-price">${currencyFormat(product.price)}</div>
          <span class="details-status${outOfStock ? " out" : ""}">${product.status || (outOfStock ? "Out of Stock" : "In Stock")}</span>
          <p class="details-desc">${product.fullDescription || product.description}</p>
          ${features ? `<ul class="details-features">${features}</ul>` : ""}
          <div class="details-actions">
            <button class="btn-primary" id="addToCartBtn" ${outOfStock ? "disabled" : ""}>
              ${outOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
            <a class="btn-secondary" href="#/" data-route="market">Continue Browsing</a>
          </div>
        </div>
      </div>`;

    const addToCartBtn = document.getElementById("addToCartBtn");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => Cart.add(product));
    }
  }

  function reload() {
    if (currentId == null) return;
    const product = ProductStore.getById(currentId);
    if (!product) {
      notFoundState();
      return;
    }
    renderProduct(product);
  }

  function wireEvents() {
    if (wired) return;
    wired = true;
    window.addEventListener(ProductStore.EVENT_NAME, reload);
  }

  function mount(id) {
    currentId = id;
    wireEvents();
    reload();
  }

  return { mount };
})();

/* =====================================================
   5. ADMIN VIEW
   ===================================================== */

const Admin = (function () {
  const adminState = { query: "", category: "All", orderFilter: "All", view: "dashboard" };
  const ORDER_KEY = "sv_marketplace_orders_v1";
  const REGISTRATIONS_KEY = "sv_campus_ambassador_registrations_v1";
  let pendingDeleteId = null;
  let wired = false;

  function populateCategoryOptions() {
    const categoryField = document.getElementById("productCategory");
    const categoryFilter = document.getElementById("adminCategoryFilter");

    categoryField.innerHTML = ProductStore.CATEGORIES.map((cat) => `<option value="${cat}">${cat}</option>`).join("");
    categoryFilter.innerHTML =
      `<option value="All">All Categories</option>` +
      ProductStore.CATEGORIES.map((cat) => `<option value="${cat}">${cat}</option>`).join("");
  }

  function getOrders() {
    try { return JSON.parse(localStorage.getItem(ORDER_KEY)) || []; } catch { return []; }
  }

  function saveOrders(orders) {
    localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent("sv:orders-updated"));
  }

  function getRegistrations() {
    try { return JSON.parse(localStorage.getItem(REGISTRATIONS_KEY)) || []; } catch { return []; }
  }

  function saveRegistrations(registrations) {
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));
    window.dispatchEvent(new CustomEvent("sv:registrations-updated"));
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  }

  function renderStats() {
    const products = ProductStore.getAll();
    const active = products.filter((p) => p.available !== false).length;
    const orders = getOrders();
    const sales = orders.filter((order) => order.status !== "Cancelled").reduce((total, order) => total + Number(order.total || 0), 0);
    const pending = orders.filter((order) => (order.status || "Pending") === "Pending").length;

    const cards = [
      { label: "Total Products", value: products.length },
      { label: "Active Products", value: active },
      { label: "Total Orders", value: orders.length },
      { label: "Sales Revenue", value: currencyFormat(sales), detail: `${pending} pending order${pending === 1 ? "" : "s"}` },
    ];

    document.getElementById("statsGrid").innerHTML = cards
      .map(
        (c) => `
        <div class="stat-card">
          <div class="stat-card__label">${c.label}</div>
          <div class="stat-card__value" style="${typeof c.value === "string" && c.value.length > 14 ? "font-size:1.05rem;" : ""}">${c.value}</div>${c.detail ? `<div class="stat-card__detail">${c.detail}</div>` : ""}
        </div>`
      )
      .join("");
  }

  function getFilteredProducts() {
    let products = ProductStore.getAll();
    if (adminState.category !== "All") {
      products = products.filter((p) => p.category === adminState.category);
    }
    if (adminState.query.trim() !== "") {
      const q = adminState.query.trim().toLowerCase();
      products = products.filter((p) => p.name.toLowerCase().includes(q));
    }
    return products.sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0));
  }

  function renderTable() {
    const tableBody = document.getElementById("adminTableBody");
    const products = getFilteredProducts();

    if (products.length === 0) {
      tableBody.innerHTML = `<tr class="empty-row"><td colspan="5">No products match your search or filter.</td></tr>`;
      return;
    }

    tableBody.innerHTML = products
      .map((p) => {
        const outOfStock = p.available === false;
        return `
        <tr data-id="${p.id}">
          <td>
            <div class="table-product">
              <img src="${p.image}" alt="${p.name}" />
              <span class="table-product__name">${p.name}</span>
            </div>
          </td>
          <td>${p.category}</td>
          <td>${currencyFormat(p.price)}</td>
          <td><span class="status-pill${outOfStock ? " out" : ""}">${p.status || (outOfStock ? "Out of Stock" : "In Stock")}</span></td>
          <td>
            <div class="row-actions">
              <button class="icon-btn" data-action="edit" data-id="${p.id}">Edit</button>
              <button class="icon-btn danger" data-action="delete" data-id="${p.id}">Delete</button>
            </div>
          </td>
        </tr>`;
      })
      .join("");
  }

  function renderOrders() {
    const orderBody = document.getElementById("adminOrdersBody");
    const allOrders = getOrders();
    document.getElementById("adminOrderCount").textContent = allOrders.filter((order) => (order.status || "Pending") === "Pending").length;
    const orders = allOrders.filter((order) => adminState.orderFilter === "All" || (order.status || "Pending") === adminState.orderFilter).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (!orders.length) { orderBody.innerHTML = `<tr class="empty-row"><td colspan="6">No ${adminState.orderFilter === "All" ? "orders" : adminState.orderFilter.toLowerCase() + " orders"} yet.</td></tr>`; return; }
    orderBody.innerHTML = orders.map((order) => {
      const status = order.status || "Pending";
      const items = (order.items || []).map((item) => `${item.name} × ${item.quantity}`).join("<br>");
      const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
      const customer = order.customer || {};
      return `<tr><td><strong>${order.id}</strong><br><span class="order-date">${date}</span></td><td><strong>${customer.name || "—"}</strong><br><span class="order-customer">${customer.phone || ""}<br>${customer.email || ""}<br>${customer.city || ""} — ${customer.address || ""}</span></td><td class="order-items">${items}</td><td>${customer.payment || "—"}</td><td><strong>${currencyFormat(order.total)}</strong></td><td><select class="order-status-select" data-order-id="${order.id}" aria-label="Status for ${order.id}">${["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((item) => `<option value="${item}" ${item === status ? "selected" : ""}>${item}</option>`).join("")}</select></td></tr>`;
    }).join("");
  }

  function renderRegistrations() {
    const body = document.getElementById("adminRegistrationsBody");
    const registrations = getRegistrations().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    document.getElementById("adminRegistrationCount").textContent = registrations.length;
    if (!registrations.length) {
      body.innerHTML = `<tr class="empty-row"><td colspan="6">No student registrations yet.</td></tr>`;
      return;
    }
    body.innerHTML = registrations.map((registration) => {
      const submitted = registration.createdAt ? new Date(registration.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
      return `<tr>
        <td><div class="registration-student"><img src="${registration.photo}" alt="${escapeHtml(registration.studentName)}" /><strong>${escapeHtml(registration.studentName)}</strong></div></td>
        <td>${escapeHtml(registration.studentId)}</td>
        <td>${escapeHtml(registration.studentClass)}</td>
        <td>${escapeHtml(registration.schoolName)}</td>
        <td>${submitted}</td>
        <td><button class="icon-btn danger" type="button" data-registration-action="delete" data-registration-id="${registration.id}">Remove</button></td>
      </tr>`;
    }).join("");
  }

  function setView(view) {
    adminState.view = view;
    document.getElementById("adminDashboardPanel").style.display = view === "dashboard" ? "block" : "none";
    document.getElementById("adminProductsPanel").style.display = view === "products" ? "block" : "none";
    document.getElementById("adminOrdersPanel").style.display = view === "orders" ? "block" : "none";
    document.getElementById("adminRegistrationsPanel").style.display = view === "registrations" ? "block" : "none";
    document.getElementById("adminSettingsPanel").style.display = view === "settings" ? "block" : "none";
    document.querySelectorAll("[data-admin-view]").forEach((link) => link.classList.toggle("active", link.dataset.adminView === view));
    document.querySelector(".admin-topbar h1").textContent = view === "orders" ? "Order Management" : view === "products" ? "Product Management" : view === "registrations" ? "Student Registrations" : view === "settings" ? "Admin Settings" : "Marketplace Dashboard";
    document.querySelector(".admin-topbar p").textContent = view === "orders" ? "Track customer orders and update delivery status." : view === "products" ? "Add, edit, and manage products in your marketplace." : view === "registrations" ? "Review Campus Ambassador Program applications." : view === "settings" ? "Change the ID and password used to access this panel." : "A clear overview of products, orders, and sales.";
  }

  function renderDashboard() {
    const orders = getOrders().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
    document.getElementById("adminRecentOrders").innerHTML = orders.length ? orders.map((order) => `<div class="recent-order"><div><strong>${order.id}</strong><span>${order.customer?.name || "Customer"}</span></div><div><strong>${currencyFormat(order.total)}</strong><span class="recent-order__status">${order.status || "Pending"}</span></div></div>`).join("") : `<div class="admin-empty-state">No orders yet. New customer orders will appear here.</div>`;
  }

  function renderAll() {
    renderStats();
    renderTable();
    renderOrders();
    renderRegistrations();
    renderDashboard();
  }

  function setProductImagePreview(src) {
    const preview = document.getElementById("productImagePreview");
    const image = document.getElementById("productImagePreviewImg");
    image.src = src || "";
    preview.hidden = !src;
  }

  function imageFileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Unable to read this image."));
      reader.onload = () => {
        const image = new Image();
        image.onerror = () => reject(new Error("This file is not a valid image."));
        image.onload = () => {
          const maxSize = 800;
          const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale);
          canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.75));
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function openModalForAdd() {
    const productModalOverlay = document.getElementById("productModalOverlay");
    document.getElementById("productModalTitle").textContent = "Add Product";
    document.getElementById("saveProductBtn").textContent = "Add Product";
    document.getElementById("productForm").reset();
    document.getElementById("productId").value = "";
    document.getElementById("productAvailable").checked = true;
    setProductImagePreview("");
    productModalOverlay.classList.add("open");
    document.getElementById("productName").focus();
  }

  function openModalForEdit(id) {
    const product = ProductStore.getById(id);
    if (!product) return;

    document.getElementById("productModalTitle").textContent = "Edit Product";
    document.getElementById("saveProductBtn").textContent = "Update Product";
    document.getElementById("productId").value = product.id;
    document.getElementById("productName").value = product.name || "";
    document.getElementById("productImage").value = product.image || "";
    document.getElementById("productImageFile").value = "";
    setProductImagePreview(product.image || "");
    document.getElementById("productDescription").value = product.description || "";
    document.getElementById("productFullDescription").value = product.fullDescription || "";
    document.getElementById("productPrice").value = product.price != null ? product.price : "";
    document.getElementById("productCategory").value = product.category || ProductStore.CATEGORIES[0];
    document.getElementById("productFeatures").value = (product.features || []).join(", ");
    document.getElementById("productAvailable").checked = product.available !== false;

    document.getElementById("productModalOverlay").classList.add("open");
    document.getElementById("productName").focus();
  }

  function closeProductModal() {
    document.getElementById("productModalOverlay").classList.remove("open");
  }

  async function handleProductFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById("productId").value;
    const available = document.getElementById("productAvailable").checked;
    const imageField = document.getElementById("productImage");
    const upload = document.getElementById("productImageFile").files[0];
    if (upload) {
      try { imageField.value = await imageFileToDataUrl(upload); } catch (error) { showToast(error.message); return; }
    }
    if (!imageField.value.trim()) { showToast("Please paste an image URL or upload an image."); return; }

    const payload = {
      name: document.getElementById("productName").value.trim(),
      image: document.getElementById("productImage").value.trim(),
      description: document.getElementById("productDescription").value.trim(),
      fullDescription: document.getElementById("productFullDescription").value.trim() || document.getElementById("productDescription").value.trim(),
      price: Number(document.getElementById("productPrice").value) || 0,
      category: document.getElementById("productCategory").value,
      features: document.getElementById("productFeatures").value.split(",").map((f) => f.trim()).filter(Boolean),
      available,
      status: available ? "In Stock" : "Out of Stock",
    };

    if (id) {
      ProductStore.update(id, payload);
      showToast("Product updated");
    } else {
      ProductStore.add(payload);
      showToast("Product added");
    }
    closeProductModal();
  }

  function openDeleteModal(id) {
    pendingDeleteId = id;
    document.getElementById("deleteModalOverlay").classList.add("open");
  }

  function closeDeleteModal() {
    pendingDeleteId = null;
    document.getElementById("deleteModalOverlay").classList.remove("open");
  }

  function confirmDelete() {
    if (pendingDeleteId != null) {
      ProductStore.remove(pendingDeleteId);
      showToast("Product deleted");
    }
    closeDeleteModal();
  }

  function removeRegistration(id) {
    const password = window.prompt("Enter the admin password to remove this registration:");
    if (password === null) return;
    if (!Auth.verifyPassword(password)) {
      showToast("Incorrect admin password.");
      return;
    }
    saveRegistrations(getRegistrations().filter((registration) => registration.id !== id));
    showToast("Registration removed.");
  }

  function wireEvents() {
    if (wired) return;
    wired = true;

    document.getElementById("openAddModal").addEventListener("click", openModalForAdd);
    document.getElementById("closeProductModal").addEventListener("click", closeProductModal);
    document.getElementById("cancelProductModal").addEventListener("click", closeProductModal);
    document.getElementById("productModalOverlay").addEventListener("click", (e) => {
      if (e.target.id === "productModalOverlay") closeProductModal();
    });
    document.getElementById("productForm").addEventListener("submit", handleProductFormSubmit);
    document.getElementById("productImageFile").addEventListener("change", async (e) => {
      const file = e.target.files[0]; if (!file) return;
      try { const imageData = await imageFileToDataUrl(file); document.getElementById("productImage").value = imageData; setProductImagePreview(imageData); } catch (error) { showToast(error.message); e.target.value = ""; }
    });
    document.getElementById("productImage").addEventListener("change", (e) => { if (e.target.value.trim()) setProductImagePreview(e.target.value.trim()); });
    document.getElementById("clearProductImage").addEventListener("click", () => { document.getElementById("productImage").value = ""; document.getElementById("productImageFile").value = ""; setProductImagePreview(""); });

    document.getElementById("cancelDeleteModal").addEventListener("click", closeDeleteModal);
    document.getElementById("confirmDeleteBtn").addEventListener("click", confirmDelete);
    document.getElementById("deleteModalOverlay").addEventListener("click", (e) => {
      if (e.target.id === "deleteModalOverlay") closeDeleteModal();
    });

    document.getElementById("adminTableBody").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const id = btn.dataset.id;
      if (btn.dataset.action === "edit") openModalForEdit(id);
      if (btn.dataset.action === "delete") openDeleteModal(id);
    });

    document.getElementById("adminSearch").addEventListener("input", (e) => {
      adminState.query = e.target.value;
      renderTable();
    });
    document.getElementById("adminCategoryFilter").addEventListener("change", (e) => {
      adminState.category = e.target.value;
      renderTable();
    });
    document.getElementById("adminOrderFilter").addEventListener("change", (e) => {
      adminState.orderFilter = e.target.value;
      renderOrders();
    });
    document.getElementById("adminOrdersBody").addEventListener("change", (e) => {
      const select = e.target.closest("select[data-order-id]");
      if (!select) return;
      const orders = getOrders();
      const order = orders.find((item) => item.id === select.dataset.orderId);
      if (!order) return;
      order.status = select.value;
      saveOrders(orders);
      showToast(`Order ${order.id} updated to ${order.status}`);
    });
    document.getElementById("adminRegistrationsBody").addEventListener("click", (e) => {
      const button = e.target.closest("button[data-registration-action]");
      if (button?.dataset.registrationAction === "delete") removeRegistration(button.dataset.registrationId);
    });
    document.querySelectorAll("[data-admin-view]").forEach((link) => {
      link.addEventListener("click", (e) => { e.preventDefault(); setView(link.dataset.adminView); });
    });
    document.querySelectorAll("[data-dashboard-link]").forEach((button) => {
      button.addEventListener("click", () => setView(button.dataset.dashboardLink));
    });
    document.getElementById("adminSettingsForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("settingsUsername").value;
      const currentPassword = document.getElementById("settingsCurrentPassword").value;
      const newPassword = document.getElementById("settingsNewPassword").value;
      const confirmPassword = document.getElementById("settingsConfirmPassword").value;
      const message = document.getElementById("adminSettingsMessage");
      if (newPassword !== confirmPassword) { message.textContent = "New password and confirmation do not match."; message.className = "admin-settings-message error"; return; }
      const result = Auth.updateCredentials(username, currentPassword, newPassword);
      message.textContent = result.message; message.className = `admin-settings-message ${result.ok ? "success" : "error"}`;
      if (result.ok) { document.getElementById("settingsCurrentPassword").value = ""; document.getElementById("settingsNewPassword").value = ""; document.getElementById("settingsConfirmPassword").value = ""; showToast("Admin login settings saved"); }
    });

    document.getElementById("sidebarToggle").addEventListener("click", () => {
      document.getElementById("adminSidebar").classList.toggle("open");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeProductModal();
        closeDeleteModal();
      }
    });

    window.addEventListener(ProductStore.EVENT_NAME, renderAll);
    window.addEventListener("sv:orders-updated", renderAll);
    window.addEventListener("sv:registrations-updated", renderAll);
  }

  function mount() {
    document.getElementById("pageTitle").textContent = "Scrap Venture";
    wireEvents();
    populateCategoryOptions();
    document.getElementById("settingsUsername").value = Auth.credentials().username;
    renderAll();
    setView(adminState.view);
  }

  return { mount };
})();

/* =====================================================
   6. ADMIN AUTHENTICATION
   ===================================================== */

const Auth = (function () {
  const AUTH_KEY = "sv_admin_auth";
  const CREDENTIALS_KEY = "sv_admin_credentials";

  function credentials() {
    try { return JSON.parse(localStorage.getItem(CREDENTIALS_KEY)) || { username: "admin", password: "admin123" }; } catch { return { username: "admin", password: "admin123" }; }
  }

  function isLoggedIn() {
    return sessionStorage.getItem(AUTH_KEY) === "true";
  }

  function login(username, password) {
    const saved = credentials();
    if (username.trim() === saved.username && password.trim() === saved.password) {
      sessionStorage.setItem(AUTH_KEY, "true");
      return true;
    }
    return false;
  }

  function verifyPassword(password) {
    return password === credentials().password;
  }

  function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    window.location.hash = "#/";
  }

  function updateCredentials(username, currentPassword, newPassword) {
    const saved = credentials();
    if (currentPassword !== saved.password) return { ok: false, message: "Your current password is incorrect." };
    if (username.trim().length < 3) return { ok: false, message: "Admin ID must be at least 3 characters." };
    if (newPassword.length < 6) return { ok: false, message: "New password must be at least 6 characters." };
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify({ username: username.trim(), password: newPassword }));
    return { ok: true, message: "Admin login settings updated successfully." };
  }

  return { isLoggedIn, login, logout, credentials, updateCredentials, verifyPassword };
})();

/* =====================================================
   7. TEAM MEMBERS VIEW
   ===================================================== */
const TeamMembers = (function () {
  const members = [
    { name: "Motaleb Hossain Emon", designation: "Founder & CEO", image: "assets/team/member-1.png" },
    { name: "MD Ebrahim", designation: "Co-Founder & COO", image: "assets/team/member-2.png" },
    { name: "Md Ariful Islam Arif", designation: "Stakeholder & CBO", image: "assets/team/CBO.png" },
    { name: "Eng. Md Safaet Hossain", designation: "Advisor", image: "assets/team/advisor.png" },
    { name: "Sharmin Akter Ema", designation: "HR & Administration", image: "assets/team/HR.png" },
    { name: "Md Rakib", designation: "Technical Lead Engineer", image: "assets/team/technical.png" },
    { name: "Farhana Mehezabin Tusti", designation: "CTO", image: "assets/team/CTO.png" },
  ];
  let mounted = false;

  function mount() {
    if (mounted) return;
    document.getElementById("teamGrid").innerHTML = members.map((member) => `
      <article class="team-member-card">
        <div class="team-member-image"><img src="${member.image}" alt="${member.name}, ${member.designation}" loading="lazy" decoding="async" /></div>
        <div class="team-member-info"><h3>${member.name}</h3><p>${member.designation}</p></div>
      </article>`).join("");
    mounted = true;
  }
  return { mount };
})();

/* =====================================================
   8. ROUTER & APP INITIALIZATION
   Reads location.pathname / location.hash and shows:
   Marketplace, Product Details, Admin Login, or Admin Dashboard.
   ===================================================== */

(function () {
  const siteChrome = document.getElementById("siteChrome");
  const viewMarket = document.getElementById("view-market");
  const viewTeam = document.getElementById("view-team");
  const viewProduct = document.getElementById("view-product");
  const viewRegistration = document.getElementById("view-registration");
  const viewAdmin = document.getElementById("view-admin");
  const viewAdminLogin = document.getElementById("view-admin-login");
  const navLinks = document.getElementById("navLinks");
  const navToggle = document.getElementById("navToggle");

  const adminLoginForm = document.getElementById("adminLoginForm");
  const adminLoginError = document.getElementById("adminLoginError");
  const adminLogoutBtn = document.getElementById("adminLogoutBtn");

  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const u = document.getElementById("adminUsername").value;
      const p = document.getElementById("adminPassword").value;

      if (Auth.login(u, p)) {
        adminLoginError.style.display = "none";
        adminLoginForm.reset();
        router();
      } else {
        adminLoginError.textContent = "Invalid username or password. Please try again.";
        adminLoginError.style.display = "block";
      }
    });
  }

  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener("click", () => {
      Auth.logout();
    });
  }

  function setActiveNav(routeName) {
    document.querySelectorAll("[data-route]").forEach((el) => {
      el.classList.toggle("active", el.dataset.route === routeName);
    });
  }

  function closeMobileNav() {
    if (navLinks) navLinks.classList.remove("open");
  }

  function router() {
    const hash = window.location.hash || "#/";
    const path = window.location.pathname || "";
    const search = window.location.search || "";

    if (!window.location.hash && (path === "/" || path.endsWith("/index.html"))) {
      window.location.hash = "#/team";
      return;
    }
    const productMatch = hash.match(/^#\/product\/(.+)$/) || path.match(/\/product\/(.+)$/);

    closeMobileNav();

    const isAdminRoute =
      hash === "#/admin" ||
      hash === "#admin" ||
      path.endsWith("/admin") ||
      path.endsWith("/admin/") ||
      path.includes("/admin") ||
      search.includes("admin");

    if (isAdminRoute) {
      siteChrome.classList.remove("team-active");
      siteChrome.style.display = "none";

      if (Auth.isLoggedIn()) {
        viewAdminLogin.style.display = "none";
        viewAdmin.style.display = "grid";
        setActiveNav("admin");
        document.getElementById("pageTitle").textContent = "Scrap Venture";
        Admin.mount();
      } else {
        viewAdmin.style.display = "none";
        viewAdminLogin.style.display = "flex";
        document.getElementById("pageTitle").textContent = "Scrap Venture";
      }
    } else if (productMatch) {
      siteChrome.classList.remove("team-active");
      siteChrome.style.display = "block";
      viewAdmin.style.display = "none";
      viewAdminLogin.style.display = "none";
      viewRegistration.style.display = "none";
      viewTeam.style.display = "none";
      viewProduct.style.display = "block";
      viewMarket.style.display = "none";
      setActiveNav("market");
      document.getElementById("pageTitle").textContent = "Scrap Venture";
      ProductDetails.mount(decodeURIComponent(productMatch[1]));
      window.scrollTo(0, 0);
    } else if (hash === "#/registration" || hash === "#registration") {
      siteChrome.classList.remove("team-active");
      siteChrome.style.display = "block";
      viewAdmin.style.display = "none";
      viewAdminLogin.style.display = "none";
      viewProduct.style.display = "none";
      viewMarket.style.display = "none";
      viewTeam.style.display = "none";
      viewRegistration.style.display = "block";
      setActiveNav("registration");
      document.getElementById("pageTitle").textContent = "Scrap Venture";
      window.scrollTo(0, 0);
    } else if (hash === "#/team" || hash === "#team") {
      siteChrome.classList.add("team-active");
      siteChrome.style.display = "block";
      viewAdmin.style.display = "none";
      viewAdminLogin.style.display = "none";
      viewProduct.style.display = "none";
      viewMarket.style.display = "none";
      viewRegistration.style.display = "none";
      viewTeam.style.display = "block";
      setActiveNav("team");
      document.getElementById("pageTitle").textContent = "Scrap Venture";
      TeamMembers.mount();
      window.scrollTo(0, 0);
    } else {
      siteChrome.classList.remove("team-active");
      siteChrome.style.display = "block";
      viewAdmin.style.display = "none";
      viewAdminLogin.style.display = "none";
      viewProduct.style.display = "none";
      viewTeam.style.display = "none";
      viewRegistration.style.display = "none";
      viewMarket.style.display = "block";
      setActiveNav("market");
      document.getElementById("pageTitle").textContent = "Scrap Venture";
      Marketplace.mount();
    }

    siteChrome.classList.remove("app-loading");
  }

  document.querySelectorAll(".sv-nav__brand").forEach((brandEl) => {
    brandEl.addEventListener("click", (e) => {
      if (window.location.hash === "#/" || window.location.hash === "" || window.location.hash === "#") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });

  Cart.mount();

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  window.addEventListener("hashchange", () => {
    router();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  window.addEventListener("popstate", router);
  window.addEventListener("DOMContentLoaded", router);
})();
