
const products = [
  {
    id: 1,
    name: "Kit lifting de pestañas",
    category: "pestanas",
    price: 18500,
    description: "Todo lo necesario para realzar la mirada.",
    image: "https://images.unsplash.com/photo-1631214540242-4c1f0f7f7b8a?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "Máscara de pestañas",
    category: "pestanas",
    price: 7900,
    description: "Definición y volumen para todos los días.",
    image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Cepillo para cejas",
    category: "cejas",
    price: 2500,
    description: "Peiná y acomodá tus cejas fácilmente.",
    image: "https://images.unsplash.com/photo-1583241800698-e8ab01830a9b?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "Pinza de precisión",
    category: "accesorios",
    price: 5600,
    description: "Un accesorio práctico para cada detalle.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "Sérum para pestañas",
    category: "cuidado",
    price: 11200,
    description: "Sumalo a tu rutina de cuidado diario.",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Henna para cejas",
    category: "cejas",
    price: 9300,
    description: "Color y definición para tus cejas.",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 7,
    name: "Parches para pestañas",
    category: "accesorios",
    price: 4200,
    description: "Complemento útil para trabajos de belleza.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 8,
    name: "Desmaquillante suave",
    category: "cuidado",
    price: 6800,
    description: "Limpieza delicada para tu rutina.",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80"
  }
];

// Recuperar datos guardados
let cart = JSON.parse(localStorage.getItem("vasCart") || "[]");
let favorites = JSON.parse(localStorage.getItem("vasFavorites") || "[]");
let favoritesOnly = false;

const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const toast = document.getElementById("toast");

const categoryNames = {
  pestanas: "Pestañas",
  cejas: "Cejas",
  accesorios: "Accesorios",
  cuidado: "Cuidado"
};

// Formato de precios
const money = value =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(value);

// Guardar carrito y favoritos
function saveData() {
  localStorage.setItem("vasCart", JSON.stringify(cart));
  localStorage.setItem("vasFavorites", JSON.stringify(favorites));
}

// Mostrar mensajes
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2300);
}

// Mostrar productos
function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  const filtered = products.filter(product => {
    const matchesText =
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);

    const matchesCategory =
      category === "todos" || product.category === category;

    const matchesFavorites =
      !favoritesOnly || favorites.includes(product.id);

    return matchesText && matchesCategory && matchesFavorites;
  });

  document.getElementById("resultsMessage").textContent =
    favoritesOnly
      ? "Tus productos favoritos"
      : `${filtered.length} producto(s) encontrado(s)`;

  if (filtered.length === 0) {
    grid.innerHTML =
      '<p class="empty-results">No encontramos productos con esa búsqueda.</p>';
    return;
  }

  grid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img
          class="product-image"
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.src='https://placehold.co/700x500/F8C8D8/70495A?text=VAS+Beauty'"
        >

        <button
          class="favorite-toggle ${favorites.includes(product.id) ? "active" : ""}"
          onclick="toggleFavorite(${product.id})"
          aria-label="Agregar a favoritos"
        >
          ${favorites.includes(product.id) ? "♥" : "♡"}
        </button>
      </div>

      <div class="product-info">
        <span class="product-category">
          ${categoryNames[product.category]}
        </span>

        <h3>${product.name}</h3>

        <p class="product-description">
          ${product.description}
        </p>

        <div class="product-bottom">
          <span class="price">${money(product.price)}</span>

          <button
            class="add-button"
            onclick="addToCart(${product.id})"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

// Agregar o quitar favoritos
function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(item => item !== id);
  } else {
    favorites.push(id);
  }

  saveData();
  updateHeader();
  renderProducts();

  showToast(
    favorites.includes(id)
      ? "Agregado a favoritos ♥"
      : "Eliminado de favoritos"
  );
}

// Agregar productos al carrito
function addToCart(id) {
  const item = cart.find(product => product.id === id);

  if (item) {
    item.quantity++;
  } else {
    cart.push({
      id: id,
      quantity: 1
    });
  }

  saveData();
  updateCart();
  showToast("¡Producto agregado al carrito!");
}

// Modificar cantidades
function changeQuantity(id, amount) {
  const item = cart.find(product => product.id === id);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  saveData();
  updateCart();
}

// Eliminar productos
function removeFromCart(id) {
  cart = cart.filter(product => product.id !== id);

  saveData();
  updateCart();

  showToast("Producto eliminado del carrito");
}

// Actualizar contadores
function updateHeader() {
  document.getElementById("cartCount").textContent =
    cart.reduce((sum, item) => sum + item.quantity, 0);

  document.getElementById("favoriteCount").textContent =
    favorites.length;
}

// Mostrar contenido del carrito
function updateCart() {
  const container = document.getElementById("cartItems");

  if (cart.length === 0) {
    container.innerHTML = `
      <p class="empty-cart">
        Tu carrito está vacío.<br>
        ¡Elegí tus productos favoritos!
      </p>
    `;
  } else {
    container.innerHTML = cart.map(item => {
      const product = products.find(p => p.id === item.id);

      return `
        <div class="cart-row">
          <img
            src="${product.image}"
            alt="${product.name}"
          >

          <div>
            <h4>${product.name}</h4>
            <small>${money(product.price)} c/u</small>

            <div class="quantity-controls">
              <button onclick="changeQuantity(${product.id}, -1)">−</button>

              <span>${item.quantity}</span>

              <button onclick="changeQuantity(${product.id}, 1)">+</button>
            </div>
          </div>

          <button
            class="remove-button"
            onclick="removeFromCart(${product.id})"
          >
            ×
          </button>
        </div>
      `;
    }).join("");
  }

  // Calcular total
  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  document.getElementById("cartTotal").textContent = money(total);

  updateHeader();
}

// Abrir carrito
function openCart() {
  document.getElementById("cartOverlay").classList.add("open");

  document.getElementById("cartOverlay")
    .setAttribute("aria-hidden", "false");
}

// Cerrar carrito
function closeCart() {
  document.getElementById("cartOverlay").classList.remove("open");

  document.getElementById("cartOverlay")
    .setAttribute("aria-hidden", "true");
}

// Buscador
searchInput.addEventListener("input", renderProducts);

// Filtro de categorías
categoryFilter.addEventListener("change", renderProducts);

// Botón del carrito
document.getElementById("cartButton")
  .addEventListener("click", openCart);

// Cerrar carrito
document.getElementById("closeCart")
  .addEventListener("click", closeCart);

// Cerrar al hacer clic afuera
document.getElementById("cartOverlay")
  .addEventListener("click", event => {
    if (event.target.id === "cartOverlay") {
      closeCart();
    }
  });

// Mostrar favoritos
document.getElementById("favoritesButton")
  .addEventListener("click", () => {
    favoritesOnly = !favoritesOnly;

    renderProducts();

    document.getElementById("productos")
      .scrollIntoView({ behavior: "smooth" });

    showToast(
      favoritesOnly
        ? "Mostrando tus favoritos"
        : "Mostrando todos los productos"
    );
  });

// Activar modo oscuro
document.getElementById("themeButton")
  .addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const dark = document.body.classList.contains("dark");

    document.getElementById("themeButton").textContent =
      dark ? "☀️" : "🌙";

    localStorage.setItem(
      "vasDarkMode",
      dark ? "true" : "false"
    );
  });

// Simular compra
document.getElementById("checkoutButton")
  .addEventListener("click", () => {
    if (cart.length === 0) {
      return showToast("Tu carrito está vacío");
    }

    showToast("¡Gracias! Esta es una compra de demostración.");

    cart = [];

    saveData();
    updateCart();
    closeCart();
  });

// Recuperar modo oscuro guardado
if (localStorage.getItem("vasDarkMode") === "true") {
  document.body.classList.add("dark");

  document.getElementById("themeButton").textContent = "☀️";
}

// Cargar tienda al iniciar
renderProducts();
updateCart();
