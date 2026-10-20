// Product data: prices are numbers, not formatted strings.
const products = [
    {
        id: 101,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 2499,
        emoji: "🎧",
        description: "Enjoy your favorite music anywhere.",
        background: "#eee8ff"
    },
    {
        id: 102,
        name: "Classic Watch",
        category: "Accessories",
        price: 1799,
        emoji: "⌚",
        description: "A timeless addition to your style.",
        background: "#fff0e5"
    },
    {
        id: 103,
        name: "Everyday Sneakers",
        category: "Footwear",
        price: 2199,
        emoji: "👟",
        description: "Comfort for your everyday adventures.",
        background: "#e6f4ff"
    },
    {
        id: 104,
        name: "Travel Backpack",
        category: "Lifestyle",
        price: 1499,
        emoji: "🎒",
        description: "Carry your essentials with ease.",
        background: "#e6f7ec"
    },
    {
        id: 105,
        name: "Smart Speaker",
        category: "Electronics",
        price: 3299,
        emoji: "🔊",
        description: "Bring sound to every corner.",
        background: "#fce8f1"
    },
    {
        id: 106,
        name: "Sunglasses",
        category: "Accessories",
        price: 899,
        emoji: "🕶️",
        description: "Complete your look with confidence.",
        background: "#fff5d9"
    },
    {
        id: 107,
        name: "Coffee Mug",
        category: "Lifestyle",
        price: 399,
        emoji: "☕",
        description: "Make your coffee breaks special.",
        background: "#f6e9df"
    },
    {
        id: 108,
        name: "Digital Camera",
        category: "Electronics",
        price: 5999,
        emoji: "📷",
        description: "Capture moments worth remembering.",
        background: "#e9edff"
    }
];

// Cart stores product IDs and quantities.
let cart = [];
let toastTimer;

const productGrid = document.getElementById("product-grid");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

const cartModal = document.getElementById("cart-modal");
const checkoutModal = document.getElementById("checkout-modal");

const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");

const toast = document.getElementById("toast");
const sortProducts = document.getElementById("sort-products");

// Format numeric prices only when displaying them.
function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(price);
}

// Render products dynamically from the products array.
function renderProducts() {
    const sortValue = sortProducts.value;
    let displayedProducts = [...products];

    if (sortValue === "low") {
        displayedProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === "high") {
        displayedProducts.sort((a, b) => b.price - a.price);
    }

    productGrid.replaceChildren();

    displayedProducts.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        const image = document.createElement("div");
        image.className = "product-image";
        image.style.setProperty("--product-bg", product.background);
        image.textContent = product.emoji;
        image.setAttribute("aria-hidden", "true");

        const category = document.createElement("p");
        category.className = "product-category";
        category.textContent = product.category;

        const name = document.createElement("h3");
        name.textContent = product.name;

        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent = product.description;

        const bottom = document.createElement("div");
        bottom.className = "product-bottom";

        const price = document.createElement("span");
        price.className = "product-price";
        price.textContent = formatPrice(product.price);

        const addButton = document.createElement("button");
        addButton.className = "add-button";
        addButton.textContent = "Add to Cart +";
        addButton.type = "button";
        addButton.addEventListener("click", () => addToCart(product.id));

        bottom.append(price, addButton);
        card.append(image, category, name, description, bottom);
        productGrid.appendChild(card);
    });
}

// Find products by their unique ID, never by array position.
function findProduct(productId) {
    return products.find(product => product.id === productId);
}

// Add a product or increase its quantity.
function addToCart(productId) {
    const product = findProduct(productId);

    if (!product) {
        showToast("Product not found.");
        return;
    }

    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId: productId,
            quantity: 1
        });
    }

    updateCart();
    showToast(`${product.name} added to cart!`);
}

// Remove a complete product entry from the cart.
function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    updateCart();
    showToast("Item removed from cart.");
}

// Calculate the number of individual items.
function getCartCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Calculate the total price using numeric values.
function getCartTotal() {
    return cart.reduce((total, item) => {
        const product = findProduct(item.productId);

        if (!product) {
            return total;
        }

        return total + product.price * item.quantity;
    }, 0);
}

// Update the count, cart display, and total price.
function updateCart() {
    cartCount.textContent = getCartCount();
    cartTotal.textContent = formatPrice(getCartTotal());

    renderCartItems();
}

// Render cart items safely using DOM methods.
function renderCartItems() {
    cartItems.replaceChildren();

    if (cart.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-cart";

        const emoji = document.createElement("span");
        emoji.textContent = "🛒";

        const message = document.createElement("p");
        message.textContent = "Your cart is empty.";

        const hint = document.createElement("p");
        hint.textContent = "Explore our products and add your favorites!";

        empty.append(emoji, message, hint);
        cartItems.appendChild(empty);
        return;
    }

    cart.forEach(item => {
        const product = findProduct(item.productId);

        if (!product) {
            return;
        }

        const row = document.createElement("div");
        row.className = "cart-row";

        const emoji = document.createElement("div");
        emoji.className = "cart-emoji";
        emoji.textContent = product.emoji;
        emoji.setAttribute("aria-hidden", "true");

        const details = document.createElement("div");
        details.className = "cart-details";

        const name = document.createElement("h4");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.textContent =
            `${formatPrice(product.price)} × ${item.quantity} = ` +
            formatPrice(product.price * item.quantity);

        details.append(name, price);

        const removeButton = document.createElement("button");
        removeButton.className = "remove-button";
        removeButton.type = "button";
        removeButton.textContent = "Remove";
        removeButton.setAttribute("aria-label", `Remove ${product.name}`);
        removeButton.addEventListener("click", () => {
            removeFromCart(item.productId);
        });

        row.append(emoji, details, removeButton);
        cartItems.appendChild(row);
    });
}

// Render a read-only checkout preview.
function renderCheckoutPreview() {
    checkoutItems.replaceChildren();

    cart.forEach(item => {
        const product = findProduct(item.productId);

        if (!product) {
            return;
        }

        const row = document.createElement("div");
        row.className = "checkout-row";

        const emoji = document.createElement("div");
        emoji.className = "cart-emoji";
        emoji.textContent = product.emoji;
        emoji.setAttribute("aria-hidden", "true");

        const details = document.createElement("div");
        details.className = "cart-details";

        const name = document.createElement("h4");
        name.textContent = product.name;

        const quantity = document.createElement("p");
        quantity.textContent = `Quantity: ${item.quantity}`;

        details.append(name, quantity);

        const price = document.createElement("strong");
        price.textContent = formatPrice(product.price * item.quantity);

        row.append(emoji, details, price);
        checkoutItems.appendChild(row);
    });

    checkoutTotal.textContent = formatPrice(getCartTotal());
}

// Modal controls.
function openModal(modal) {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeModal(modal) {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");

    if (!document.querySelector(".modal.show")) {
        document.body.style.overflow = "";
    }
}

document.getElementById("open-cart").addEventListener("click", () => {
    updateCart();
    openModal(cartModal);
});

document.getElementById("close-cart").addEventListener("click", () => {
    closeModal(cartModal);
});

document.getElementById("close-checkout").addEventListener("click", () => {
    closeModal(checkoutModal);
});

// Clicking the backdrop closes that modal.
[cartModal, checkoutModal].forEach(modal => {
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });
});

// Escape closes any open modal.
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeModal(cartModal);
        closeModal(checkoutModal);
    }
});

// Open checkout preview only when cart contains products.
document.getElementById("checkout-button").addEventListener("click", () => {
    if (cart.length === 0) {
        showToast("Add a product before checkout.");
        return;
    }

    renderCheckoutPreview();
    closeModal(cartModal);
    openModal(checkoutModal);
});

// Demo checkout does not collect payment details.
document.getElementById("finish-checkout").addEventListener("click", () => {
    if (cart.length === 0) {
        closeModal(checkoutModal);
        showToast("Your cart is empty.");
        return;
    }

    cart = [];
    updateCart();
    closeModal(checkoutModal);
    showToast("Demo checkout completed successfully!");
});

// Product sorting.
sortProducts.addEventListener("change", renderProducts);

// Small toast notification.
function showToast(message) {
    clearTimeout(toastTimer);

    toast.textContent = message;
    toast.classList.add("show");

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// Initial rendering.
renderProducts();
updateCart();
