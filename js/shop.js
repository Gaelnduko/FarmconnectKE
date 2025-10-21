// Sample product data
const products = [
    {
        id: 1,
        name: "Fresh Tomatoes",
        farm: "Green Valley Farm",
        practice: "Organic",
        price: 120,
        category: "vegetables",
        image: "🍅"
    },
    {
        id: 2,
        name: "Avocados",
        farm: "Sunshine Orchards",
        practice: "Sustainable",
        price: 80,
        category: "fruits",
        image: "🥑"
    },
    {
        id: 3,
        name: "Carrots",
        farm: "Roots & Shoots",
        practice: "Pesticide-Free",
        price: 60,
        category: "vegetables",
        image: "🥕"
    },
    {
        id: 4,
        name: "Spinach",
        farm: "Leafy Greens Co.",
        practice: "Organic",
        price: 40,
        category: "vegetables",
        image: "🥬"
    },
    {
        id: 5,
        name: "Oranges",
        farm: "Citrus Haven",
        practice: "Sustainable",
        price: 150,
        category: "fruits",
        image: "🍊"
    },
    {
        id: 6,
        name: "Maize Flour",
        farm: "Golden Grains",
        practice: "Organic",
        price: 200,
        category: "grains",
        image: "🌽"
    },
    {
        id: 7,
        name: "Free-Range Eggs",
        farm: "Happy Hens",
        practice: "Organic",
        price: 350,
        category: "dairy",
        image: "🥚"
    },
    {
        id: 8,
        name: "Fresh Milk",
        farm: "Dairy Delight",
        practice: "Sustainable",
        price: 80,
        category: "dairy",
        image: "🥛"
    },
    {
        id: 9,
        name: "Basil",
        farm: "Herb Garden",
        practice: "Organic",
        price: 30,
        category: "herbs",
        image: "🌿"
    },
    {
        id: 10,
        name: "Bananas",
        farm: "Tropical Fruits",
        practice: "Sustainable",
        price: 100,
        category: "fruits",
        image: "🍌"
    },
    {
        id: 11,
        name: "Potatoes",
        farm: "Highland Farms",
        practice: "Pesticide-Free",
        price: 90,
        category: "vegetables",
        image: "🥔"
    },
    {
        id: 12,
        name: "Cabbage",
        farm: "Green Acres",
        practice: "Organic",
        price: 50,
        category: "vegetables",
        image: "🥬"
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize shop
document.addEventListener('DOMContentLoaded', function() {
    displayProducts(products);
    updateCartCount();
    setupFilters();
    setupSearch();
});

// Display products
function displayProducts(productsToShow) {
    const container = document.getElementById('productsContainer');
    const resultsCount = document.querySelector('.results-count');
    
    if (!container) return;
    
    container.innerHTML = '';
    resultsCount.textContent = `Showing ${productsToShow.length} products`;
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// Create product card HTML
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            ${product.image}
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-farm">${product.farm}</p>
            <span class="product-practice">${product.practice}</span>
            <div class="product-price">KSh ${product.price}</div>
            <div class="product-actions">
                <div class="quantity-selector">
                    <button class="quantity-btn minus" data-id="${product.id}">-</button>
                    <input type="number" class="quantity-input" value="1" min="1" max="10" data-id="${product.id}">
                    <button class="quantity-btn plus" data-id="${product.id}">+</button>
                </div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;
    
    // Add event listeners
    const addToCartBtn = card.querySelector('.add-to-cart');
    const minusBtn = card.querySelector('.minus');
    const plusBtn = card.querySelector('.plus');
    const quantityInput = card.querySelector('.quantity-input');
    
    addToCartBtn.addEventListener('click', () => addToCart(product.id, parseInt(quantityInput.value)));
    minusBtn.addEventListener('click', () => adjustQuantity(product.id, -1));
    plusBtn.addEventListener('click', () => adjustQuantity(product.id, 1));
    quantityInput.addEventListener('change', (e) => setQuantity(product.id, parseInt(e.target.value)));
    
    return card;
}

// Cart functions
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    updateCart();
    showCartNotification(`${product.name} added to cart!`);
}

function adjustQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function setQuantity(productId, quantity) {
    if (quantity <= 0) {
        removeFromCart(productId);
    } else {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            updateCart();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--text-light);">Your cart is empty</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                ${item.image}
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">KSh ${item.price} × ${item.quantity}</div>
                <div class="cart-item-actions">
                    <div class="cart-item-quantity">
                        <button class="decrease-quantity" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
        
        // Add event listeners for cart item actions
        cartItem.querySelector('.decrease-quantity').addEventListener('click', () => adjustQuantity(item.id, -1));
        cartItem.querySelector('.increase-quantity').addEventListener('click', () => adjustQuantity(item.id, 1));
        cartItem.querySelector('.remove-item').addEventListener('click', () => removeFromCart(item.id));
    });
    
    cartTotal.textContent = total.toFixed(2);
}

// Cart sidebar functionality
const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');

if (cartIcon && cartSidebar && closeCart) {
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartSidebar.classList.add('active');
    });
    
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });
}

// Notification system
function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-green);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1002;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Filter functionality
function setupFilters() {
    const categoryCheckboxes = document.querySelectorAll('input[type="checkbox"][value]');
    const practiceCheckboxes = document.querySelectorAll('input[type="checkbox"][value]');
    const priceSlider = document.querySelector('.price-slider');
    const locationSelect = document.querySelector('.location-select');
    const sortSelect = document.getElementById('sortSelect');
    
    // Add event listeners to all filter elements
    [...categoryCheckboxes, ...practiceCheckboxes].forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    if (priceSlider) priceSlider.addEventListener('input', applyFilters);
    if (locationSelect) locationSelect.addEventListener('change', applyFilters);
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);
}

function applyFilters() {
    const selectedCategories = Array.from(document.querySelectorAll('input[value="vegetables"], input[value="fruits"], input[value="grains"], input[value="dairy"], input[value="herbs"]'))
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    const selectedPractices = Array.from(document.querySelectorAll('input[value="organic"], input[value="sustainable"], input[value="pesticide-free"]'))
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    const maxPrice = document.querySelector('.price-slider') ? parseInt(document.querySelector('.price-slider').value) : 1000;
    const selectedLocation = document.querySelector('.location-select') ? document.querySelector('.location-select').value : '';
    const sortBy = document.getElementById('sortSelect') ? document.getElementById('sortSelect').value : 'featured';
    
    let filteredProducts = products.filter(product => {
        // Category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
            return false;
        }
        
        // Practice filter
        if (selectedPractices.length > 0 && !selectedPractices.includes(product.practice.toLowerCase())) {
            return false;
        }
        
        // Price filter
        if (product.price > maxPrice) {
            return false;
        }
        
        // Location filter (simulated)
        if (selectedLocation && product.farm.toLowerCase().indexOf(selectedLocation) === -1) {
            return false;
        }
        
        return true;
    });
    
    // Sort products
    filteredProducts = sortProducts(filteredProducts, sortBy);
    
    displayProducts(filteredProducts);
}

function sortProducts(products, sortBy) {
    switch (sortBy) {
        case 'price-low':
            return [...products].sort((a, b) => a.price - b.price);
        case 'price-high':
            return [...products].sort((a, b) => b.price - a.price);
        case 'name':
            return [...products].sort((a, b) => a.name.localeCompare(b.name));
        default:
            return products;
    }
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            if (searchTerm.length === 0) {
                applyFilters();
                return;
            }
            
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.farm.toLowerCase().includes(searchTerm) ||
                product.practice.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
            
            displayProducts(filteredProducts);
        });
    }
}