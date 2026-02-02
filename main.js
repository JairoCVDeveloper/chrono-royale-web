/* Chrono Royale — Carrito + Filtros + Login (localStorage)
   - Carrito funcional en Offcanvas (sumar/restar/eliminar/vaciar)
   - Badge del carrito en navbar
   - Modal lupa: filtros por marca + precio (se guardan y aplican en Colecciones)
   - Login modal: validación simple + sesión simulada
   - Producto: página detalle con carrusel + añadir al carrito
   - NUEVO: Modal "Contactar" desde el carrito con formulario + resumen de carrito
   - NUEVO: Toast premium centrado + backdrop (solo al enviar solicitud, autohide)
*/

const STORAGE_KEYS = {
  CART: "cr_cart",
  FILTERS: "cr_filters",
  SESSION: "cr_session",
};

/* =========================================================
   ASSETS: rutas consistentes entre /index.html y /pages/*
   ========================================================= */
function assetUrl(pathFromRoot) {
  if (!pathFromRoot) return "";
  const inPages = window.location.pathname.includes("/pages/");
  const clean = String(pathFromRoot).replace(/^\/+/, "");
  return (inPages ? "../" : "") + clean;
}

/* =========================================================
   PRODUCTS
   ========================================================= */
const PRODUCTS = [
  // Rolex
  {
    id: "rolex-daytona",
    name: "Cosmograph Daytona",
    brand: "Rolex",
    price: 29500,
    images: ["img/rolex-daytona.jpg"],
  },
  {
    id: "rolex-submariner",
    name: "Submariner Date",
    brand: "Rolex",
    price: 13900,
    images: ["img/rolex-submariner.jpg"],
  },
  {
    id: "rolex-gmt",
    name: "GMT-Master II",
    brand: "Rolex",
    price: 15800,
    images: ["img/rolex-gmt.jpg"],
  },
  {
    id: "rolex-datejust-36",
    name: "Datejust 36",
    brand: "Rolex",
    price: 15200,
    images: ["img/rolex-datejust-36.jpg"],
  },

  // Patek
  {
    id: "patek-nautilus",
    name: "Nautilus",
    brand: "Patek Philippe",
    price: 98000,
    images: ["img/patek-nautilus.jpg"],
  },
  {
    id: "patek-aquanaut",
    name: "Aquanaut",
    brand: "Patek Philippe",
    price: 72000,
    images: ["img/patek-aquanaut.jpg"],
  },
  {
    id: "patek-grandcomp",
    name: "Grand Complications",
    brand: "Patek Philippe",
    price: 165000,
    images: ["img/patek-grandcomp.jpg"],
  },
  {
    id: "patek-perpetual-calendar",
    name: "Perpetual Calendar 5140J",
    brand: "Patek Philippe",
    price: 59500,
    images: ["img/patek-perpetual-calendar.jpg"],
  },

  {
    id: "patek-nautilus-zafiro",
    name: "Nautilus 7118/1451G-001",
    brand: "Patek Philippe",
    price: 505115,
    images: [
      "img/patek-nautilus-zafiro.jpg",
      "img/patek-nautilus-zafiro-2.jpg",
      "img/patek-nautilus-zafiro-3.jpg",
      "img/patek-nautilus-zafiro-4.jpg",
    ],
  },
  {
    id: "patek-nautilus-rubi",
    name: "Nautilus 7118/1452G-001",
    brand: "Patek Philippe",
    price: 505115,
    images: [
      "img/patek-nautilus-rubi.jpg",
      "img/patek-nautilus-rubi-2.jpg",
      "img/patek-nautilus-rubi-3.jpg",
      "img/patek-nautilus-rubi-4.jpg",
    ],
  },
  {
    id: "patek-nautilus-esmeralda",
    name: "Nautilus 7118/1453G-001",
    brand: "Patek Philippe",
    price: 568151,
    images: [
      "img/patek-nautilus-esmeralda.jpg",
      "img/patek-nautilus-esmeralda-2.jpg",
      "img/patek-nautilus-esmeralda-3.jpg",
      "img/patek-nautilus-esmeralda-4.jpg",
    ],
  },

  // Richard Mille
  {
    id: "rm-011",
    name: "RM 011",
    brand: "Richard Mille",
    price: 245000,
    images: ["img/rm-011.jpg"],
  },
  {
    id: "rm-035",
    name: "RM 035",
    brand: "Richard Mille",
    price: 210000,
    images: ["img/rm-035.jpg"],
  },
  {
    id: "rm-055",
    name: "RM 055",
    brand: "Richard Mille",
    price: 275000,
    images: ["img/rm-055.jpg"],
  },
  {
    id: "rm-35-03",
    name: "RM 35-03",
    brand: "Richard Mille",
    price: 415379,
    images: ["img/rm-35-03.jpg"],
  },
  {
    id: "rm-002-V2",
    name: "RM 002 V2",
    brand: "Richard Mille",
    price: 273000,
    images: ["img/rm-002-V2.jpg"],
  },
];

const PRODUCTOSNUEVACOLECCION = [
  {
    id: "patek-nautilus-zafiro",
    name: "Nautilus 7118/1451G-001",
    brand: "Patek Philippe",
    price: 505115,
    images: [
      "img/patek-nautilus-zafiro.jpg",
      "img/patek-nautilus-zafiro-2.jpg",
      "img/patek-nautilus-zafiro-3.jpg",
      "img/patek-nautilus-zafiro-4.jpg",
    ],
  },
  {
    id: "patek-nautilus-rubi",
    name: "Nautilus 7118/1452G-001",
    brand: "Patek Philippe",
    price: 505115,
    images: [
      "img/patek-nautilus-rubi.jpg",
      "img/patek-nautilus-rubi-2.jpg",
      "img/patek-nautilus-rubi-3.jpg",
      "img/patek-nautilus-rubi-4.jpg",
    ],
  },
  {
    id: "patek-nautilus-esmeralda",
    name: "Nautilus 7118/1453G-001",
    brand: "Patek Philippe",
    price: 568151,
    images: [
      "img/patek-nautilus-esmeralda.jpg",
      "img/patek-nautilus-esmeralda-2.jpg",
      "img/patek-nautilus-esmeralda-3.jpg",
      "img/patek-nautilus-esmeralda-4.jpg",
    ],
  },
];

// ---------- Helpers ----------
function formatEUR(value) {
  try {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  } catch {
    return `€${value}`;
  }
}

function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function resolveProductById(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function productMainImage(p) {
  return (p?.images && p.images.length ? p.images[0] : "") || "";
}

// ---------- Toast (genérico: abajo derecha, autohide) ----------
function showToast(message) {
  const toastEl = document.getElementById("globalToast");
  const bodyEl = document.getElementById("globalToastBody");
  if (!toastEl || !bodyEl || !window.bootstrap) return;

  bodyEl.textContent = message;
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, {
    delay: 2400,
    autohide: true,
  });
  toast.show();
}

/* ===========================================================================
   Toast solicitud enviada (solo se muestra al enviar solicitud de consulta)
   - NO se muestra al cargar
   - Autohide (desactivado)
   - Backdrop oscuro mientras está visible
   =========================================================================== */
function showConsultToast(message) {
  const toastEl = document.getElementById("consultToast");
  const bodyEl = document.getElementById("consultToastBody");
  const backdrop = document.getElementById("consultToastBackdrop");
  if (!toastEl || !bodyEl || !window.bootstrap) return;

  // Texto en el mismo color (todo blanco como el resto)
  bodyEl.textContent = message || "";

  // Enciende backdrop
  if (backdrop) backdrop.classList.remove("d-none");

  // Asegura que no se quede visible por HTML accidental
  toastEl.classList.remove("show");
  toastEl.classList.add("hide");

  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, {
    autohide: false, // desactivado para que el usuario pueda leerlo
    delay: 5200, // más tiempo para leer el mensaje premium
  });

  // Cuando se oculte (por tiempo o por la X), apaga backdrop
  toastEl.addEventListener(
    "hidden.bs.toast",
    () => {
      if (backdrop) backdrop.classList.add("d-none");
    },
    { once: true },
  );

  toast.show();
}

// ---------- Session (Login) ----------
function getSession() {
  return readLS(STORAGE_KEYS.SESSION, { isLogged: false, userEmail: "" });
}

function setSession(session) {
  writeLS(STORAGE_KEYS.SESSION, session);
  syncLoginUI();
}

function syncLoginUI() {
  const session = getSession();
  const logoutBtn = document.getElementById("logoutBtn");
  const userBtn = document.getElementById("userBtn");

  if (logoutBtn) logoutBtn.classList.toggle("d-none", !session.isLogged);

  if (userBtn) {
    userBtn.title = session.isLogged
      ? `Sesión: ${session.userEmail} (clic para gestionar)`
      : "Login";
  }
}

// ---------- Filters ----------
function getFilters() {
  return readLS(STORAGE_KEYS.FILTERS, { brand: "", min: "", max: "" });
}

function setFilters(filters) {
  writeLS(STORAGE_KEYS.FILTERS, filters);
}

function applyFiltersToUI() {
  const f = getFilters();
  const brandEl = document.getElementById("filterBrand");
  const minEl = document.getElementById("filterMin");
  const maxEl = document.getElementById("filterMax");

  if (brandEl) brandEl.value = f.brand || "";
  if (minEl) minEl.value = f.min ?? "";
  if (maxEl) maxEl.value = f.max ?? "";
}

// ---------- Cart ----------
function getCart() {
  return readLS(STORAGE_KEYS.CART, []); // [{id, qty}]
}

function saveCart(cart) {
  writeLS(STORAGE_KEYS.CART, cart);
  updateCartBadge();
  updateContactButtonState();
}

function countCartItems(cart) {
  return cart.reduce((acc, it) => acc + (it.qty || 0), 0);
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (!badge) return;

  const cart = getCart();
  const totalQty = countCartItems(cart);
  badge.textContent = totalQty;
  badge.style.display = totalQty > 0 ? "inline-block" : "none";
}

function addToCart(productId) {
  const cart = getCart();
  const found = cart.find((i) => i.id === productId);
  if (found) found.qty += 1;
  else cart.push({ id: productId, qty: 1 });

  saveCart(cart);
  showToast("Añadido al carrito.");
}

function removeFromCart(productId) {
  const cart = getCart().filter((i) => i.id !== productId);
  saveCart(cart);
  renderCartOffcanvas();
}

function setQty(productId, qty) {
  const cart = getCart();
  const it = cart.find((i) => i.id === productId);
  if (!it) return;

  it.qty = Math.max(1, qty);
  saveCart(cart);
  renderCartOffcanvas();
}

function emptyCart() {
  saveCart([]);
  renderCartOffcanvas();
  showToast("Carrito vaciado.");
}

function cartTotals(cart) {
  let subtotal = 0;
  cart.forEach((it) => {
    const p = resolveProductById(it.id);
    if (p) subtotal += p.price * (it.qty || 0);
  });
  return { subtotal, total: subtotal };
}

function cartLines(cart) {
  return cart
    .map((it) => {
      const p = resolveProductById(it.id);
      if (!p) return null;
      return { p, qty: it.qty || 0 };
    })
    .filter(Boolean);
}

function updateContactButtonState() {
  const btn = document.getElementById("contactInquiryBtn");
  if (!btn) return;
  const hasItems = getCart().length > 0;
  btn.disabled = !hasItems;
  btn.setAttribute("aria-disabled", hasItems ? "false" : "true");
}

function renderCartOffcanvas() {
  const itemsEl = document.getElementById("cartItems");
  const subtotalEl = document.getElementById("cartSubtotal");
  const totalEl = document.getElementById("cartTotal");
  if (!itemsEl || !subtotalEl || !totalEl) return;

  const cart = getCart();

  const noticeHTML = `
    <div class="small text-secondary mb-3">
      <i class="bi bi-info-circle me-1"></i>
      Debido al valor y la exclusividad de nuestras piezas de alta joyería, la
      adquisición se gestiona mediante una consulta previa y personalizada para
      confirmar disponibilidad, estado, documentación y condiciones de entrega.
      Añade las piezas de tu interés al carrito y envíanos tu solicitud.
    </div>
  `;

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      ${noticeHTML}
      <div class="text-secondary">
        Tu carrito está vacío.
        <div class="mt-2 small">
          Añade piezas desde <a class="cr-link-gold" href="${assetUrl("pages/colecciones.html")}">Colecciones</a>.
        </div>
      </div>
    `;
    subtotalEl.textContent = formatEUR(0);
    totalEl.textContent = formatEUR(0);
    updateContactButtonState();
    return;
  }

  const lines = cartLines(cart);

  itemsEl.innerHTML =
    noticeHTML +
    lines
      .map(({ p, qty }) => {
        const thumb = productMainImage(p);
        return `
          <div class="d-flex gap-3 align-items-start mb-3">
            <img src="${assetUrl(thumb)}" alt="${p.name}"
                 style="width:72px;height:72px;object-fit:cover;border-radius:14px;border:1px solid rgba(215,177,90,.18)">
            <div class="flex-grow-1">
              <div class="fw-semibold">${p.name}</div>
              <div class="text-secondary small">${p.brand}</div>
              <div class="mt-1 fw-semibold cr-gold">${formatEUR(p.price)}</div>

              <div class="d-flex align-items-center gap-2 mt-2">
                <button class="btn btn-sm cr-btn-outline" data-cr-qty-minus="${p.id}" type="button" aria-label="Restar">−</button>
                <span class="text-secondary small">Cant.</span>
                <span class="fw-semibold">${qty}</span>
                <button class="btn btn-sm cr-btn-outline" data-cr-qty-plus="${p.id}" type="button" aria-label="Sumar">+</button>

                <button class="btn btn-sm btn-link ms-auto cr-link-gold p-0" data-cr-remove="${p.id}" type="button">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

  const { subtotal, total } = cartTotals(cart);
  subtotalEl.textContent = formatEUR(subtotal);
  totalEl.textContent = formatEUR(total);
  updateContactButtonState();

  // Bind actions
  itemsEl.querySelectorAll("[data-cr-qty-minus]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-cr-qty-minus");
      const cartNow = getCart();
      const it = cartNow.find((x) => x.id === id);
      if (!it) return;
      setQty(id, (it.qty || 1) - 1);
    });
  });

  itemsEl.querySelectorAll("[data-cr-qty-plus]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-cr-qty-plus");
      const cartNow = getCart();
      const it = cartNow.find((x) => x.id === id);
      if (!it) return;
      setQty(id, (it.qty || 1) + 1);
    });
  });

  itemsEl.querySelectorAll("[data-cr-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-cr-remove");
      removeFromCart(id);
      showToast("Producto eliminado.");
    });
  });
}

/* =========================================================
   Modal "Contactar / Consultar disponibilidad" desde el carrito
   - Rellena lista de productos del carrito
   - Validación HTML5 + was-validated
   - Toast premium centrado + backdrop (autohide)
   ========================================================= */
function bindContactInquiryModal() {
  const modalEl = document.getElementById("contactInquiryModal");
  const formEl = document.getElementById("contactInquiryForm");
  const listEl = document.getElementById("contactCartSummary");
  const totalEl = document.getElementById("contactCartTotal");
  const hiddenEl = document.getElementById("contactCartHidden");

  if (
    !modalEl ||
    !formEl ||
    !listEl ||
    !totalEl ||
    !hiddenEl ||
    !window.bootstrap
  )
    return;

  // Rellenar al abrir
  modalEl.addEventListener("show.bs.modal", () => {
    const cart = getCart();
    const lines = cartLines(cart);

    if (lines.length === 0) {
      listEl.innerHTML = `
        <li class="list-group-item bg-transparent text-secondary">
          No hay productos en el carrito.
        </li>
      `;
      totalEl.textContent = formatEUR(0);
      hiddenEl.value = "";
      formEl.classList.remove("was-validated");
      return;
    }

    listEl.innerHTML = lines
      .map(
        ({ p, qty }) => `
        <li class="list-group-item bg-transparent text-light d-flex justify-content-between align-items-start gap-3">
          <div>
            <div class="fw-semibold">${p.name}</div>
            <div class="small text-secondary">${p.brand}</div>
            <div class="small text-secondary">Cantidad: ${qty}</div>
          </div>
          <div class="fw-semibold">${formatEUR(p.price * qty)}</div>
        </li>
      `,
      )
      .join("");

    const { total } = cartTotals(cart);
    totalEl.textContent = formatEUR(total);

    hiddenEl.value = lines
      .map(
        ({ p, qty }) =>
          `${p.name} (${p.brand}) x${qty} — ${formatEUR(p.price * qty)}`,
      )
      .join(" | ");

    formEl.classList.remove("was-validated");
  });

  // Submit
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!formEl.checkValidity()) {
      formEl.classList.add("was-validated");
      return;
    }

    // Cierra modal primero (UX más limpia)
    bootstrap.Modal.getOrCreateInstance(modalEl).hide();

    // Toast premium centrado + backdrop (autohide)
    showConsultToast(
      "Solicitud enviada correctamente. Nuestro equipo revisará la disponibilidad de las piezas seleccionadas y se pondrá en contacto a la mayor brevedad posible.",
    );

    formEl.reset();
    formEl.classList.remove("was-validated");
  });
}

// ---------- Colecciones: render productos ----------
function filteredProducts() {
  const f = getFilters();
  const brand = (f.brand || "").trim();
  const min = f.min !== "" && f.min != null ? Number(f.min) : null;
  const max = f.max !== "" && f.max != null ? Number(f.max) : null;

  return PRODUCTS.filter((p) => {
    if (brand && p.brand !== brand) return false;
    if (min != null && !Number.isNaN(min) && p.price < min) return false;
    if (max != null && !Number.isNaN(max) && p.price > max) return false;
    return true;
  });
}

function renderProductsGrid() {
  const grid = document.getElementById("productsGrid");
  const empty = document.getElementById("productsEmpty");
  const countEl = document.getElementById("productsCount");
  if (!grid) return;

  const path = window.location.pathname;
  const isNuevaColeccion = path.includes("nueva-coleccion");
  const list = isNuevaColeccion ? PRODUCTOSNUEVACOLECCION : filteredProducts();

  if (countEl) countEl.textContent = `${list.length} producto(s)`;

  if (list.length === 0) {
    grid.innerHTML = "";
    if (empty) empty.classList.remove("d-none");
    return;
  }
  if (empty) empty.classList.add("d-none");

  const colClass = isNuevaColeccion ? "col-12" : "col-12 col-md-6 col-lg-4";
  const inPages = path.includes("/pages/");
  const productHrefBase = inPages ? "./producto.html" : "producto.html";

  grid.innerHTML = list
    .map((p) => {
      const mainImg = productMainImage(p);
      return `
        <div class="${colClass}">
          <div class="cr-product-card h-100">
            <img src="${assetUrl(mainImg)}" alt="${p.name}" class="cr-product-img">

            <div class="p-4">
              <div class="d-flex justify-content-between align-items-start gap-2">
                <div>
                  <div class="fw-semibold">${p.name}</div>
                  <div class="text-secondary small">${p.brand}</div>
                </div>
                <span class="cr-pill">Premium</span>
              </div>

              <div class="mt-3">
                <div class="d-flex justify-content-between align-items-center gap-2">
                  <div class="cr-price mb-0">${formatEUR(p.price)}</div>

                  <button class="btn cr-btn-gold btn-sm text-nowrap"
                          data-cr-add="${p.id}" type="button">
                    Añadir al carrito
                  </button>
                </div>

                <a class="btn cr-btn-outline btn-sm w-100 mt-3"
                   href="${productHrefBase}?id=${encodeURIComponent(p.id)}">
                  Ver producto
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  grid.querySelectorAll("[data-cr-add]").forEach((btn) => {
    btn.addEventListener("click", () =>
      addToCart(btn.getAttribute("data-cr-add")),
    );
  });
}

// ---------- Quick filters en Home ----------
function bindQuickFilters() {
  document.querySelectorAll("[data-cr-quick-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const brand = btn.getAttribute("data-brand") || "";
      setFilters({ brand, min: "", max: "" });
      window.location.href = "./pages/colecciones.html";
    });
  });
}

// ---------- Filter modal bindings ----------
function bindFilterModal() {
  const applyBtn = document.getElementById("applyFiltersBtn");
  const clearBtn = document.getElementById("clearFiltersBtn");

  if (applyBtn) {
    applyBtn.addEventListener("click", () => {
      const brand = document.getElementById("filterBrand")?.value || "";
      const min = document.getElementById("filterMin")?.value ?? "";
      const max = document.getElementById("filterMax")?.value ?? "";

      setFilters({ brand, min, max });
      showToast("Filtros aplicados.");
      renderProductsGrid();

      const modalEl = document.getElementById("filterModal");
      if (modalEl && window.bootstrap)
        bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      setFilters({ brand: "", min: "", max: "" });
      applyFiltersToUI();
      renderProductsGrid();
      showToast("Filtros limpiados.");
    });
  }
}

// ---------- Login bindings ----------
function bindLogin() {
  const form = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = (document.getElementById("loginEmail")?.value || "").trim();
      const pass = (document.getElementById("loginPass")?.value || "").trim();

      if (!email || !pass) {
        showToast("Completa email/usuario y contraseña.");
        return;
      }

      setSession({ isLogged: true, userEmail: email });
      showToast("Sesión iniciada.");

      const modalEl = document.getElementById("loginModal");
      if (modalEl && window.bootstrap)
        bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      setSession({ isLogged: false, userEmail: "" });
      showToast("Sesión cerrada.");
      const modalEl = document.getElementById("loginModal");
      if (modalEl && window.bootstrap)
        bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    });
  }

  syncLoginUI();
}

// ---------- Contact form (página contacto.html) ----------
function bindContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // ✅ A partir de aquí Bootstrap muestra errores SOLO tras intentar enviar
    form.classList.add("was-validated");

    if (!form.checkValidity()) {
      // opcional: si quieres toast cuando hay errores
      // showToast("Revisa los campos obligatorios.");
      return;
    }

    // ✅ Envío OK (simulado)
    showToast("Mensaje enviado. Te responderemos pronto.");

    form.reset();
    form.classList.remove("was-validated");
  });
}

/* =========================================================
   PRODUCTO: página producto.html?id=...
   ========================================================= */
function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function renderProductDetail() {
  const wrap = document.getElementById("productCarouselWrap");
  const titleEl = document.getElementById("productTitle");
  const brandEl = document.getElementById("productBrand");
  const priceEl = document.getElementById("productPrice");
  const descEl = document.getElementById("productDesc");
  const addBtn = document.getElementById("productAddBtn");

  if (!wrap || !titleEl || !brandEl || !priceEl || !descEl || !addBtn) return;

  const id = getQueryParam("id");
  const p = PRODUCTS.find((x) => x.id === id);

  if (!p) {
    titleEl.textContent = "Producto no encontrado";
    brandEl.textContent = "";
    priceEl.textContent = "";
    descEl.textContent = "Este producto no existe o el enlace está mal.";
    wrap.innerHTML = "";
    addBtn.disabled = true;
    return;
  }

  titleEl.textContent = p.name;
  brandEl.textContent = p.brand;
  priceEl.textContent = formatEUR(p.price);

  descEl.textContent = `Pieza premium de ${p.brand}. Consulta disponibilidad, estado y documentación con nuestro equipo.`;

  const imgs = (p.images && p.images.length ? p.images : []).map(assetUrl);
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const fixedHeight = isMobile ? "320px" : "clamp(420px, 55vh, 560px)";

  wrap.innerHTML = `
    <div id="productCarousel" class="carousel slide cr-carousel" data-bs-ride="carousel">
      <div class="carousel-indicators">
        ${imgs
          .map(
            (_, i) => `
            <button type="button"
              data-bs-target="#productCarousel"
              data-bs-slide-to="${i}"
              class="${i === 0 ? "active" : ""}"
              aria-current="${i === 0 ? "true" : "false"}"
              aria-label="Slide ${i + 1}">
            </button>
          `,
          )
          .join("")}
      </div>

      <div class="carousel-inner rounded-4 overflow-hidden" style="height:${fixedHeight};">
        ${imgs
          .map(
            (src, i) => `
            <div class="carousel-item ${i === 0 ? "active" : ""} h-100">
              <img src="${src}" class="d-block w-100 h-100 object-fit-cover" alt="${p.name}">
            </div>
          `,
          )
          .join("")}
      </div>

      <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Anterior</span>
      </button>

      <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Siguiente</span>
      </button>
    </div>
  `;

  addBtn.addEventListener("click", () => addToCart(p.id));
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  applyFiltersToUI();

  bindQuickFilters();
  bindFilterModal();
  bindLogin();
  bindContactForm();

  renderProductsGrid();
  renderProductDetail();

  // Render carrito cuando se abra el offcanvas
  const cartCanvas = document.getElementById("cartOffcanvas");
  if (cartCanvas) {
    cartCanvas.addEventListener("shown.bs.offcanvas", renderCartOffcanvas);
  }

  // Vaciar carrito
  const emptyBtn = document.getElementById("emptyCartBtn");
  if (emptyBtn) emptyBtn.addEventListener("click", emptyCart);

  // Modal contactar desde carrito
  bindContactInquiryModal();

  // Estado inicial botón contactar
  updateContactButtonState();

  // ✅ Seguridad extra: si el HTML tuviera el toast visible por error, lo ocultamos al cargar
  const ct = document.getElementById("consultToast");
  if (ct) {
    ct.classList.remove("show");
    ct.classList.add("hide");
  }
  const backdrop = document.getElementById("consultToastBackdrop");
  if (backdrop) backdrop.classList.add("d-none");
});