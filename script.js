// Global variables
let currentUser = null;
let cart = [];
let isSeller = false;
let sellerProducts = [];

// Category data with emojis
const categories = [
    { id: 'raw-materials', name: 'Raw Materials', emoji: '🏗️', 
      products: [
        { id: 1, name: 'Cement', price: 400, emoji: '🧱', description: 'High quality construction cement' },
        { id: 2, name: 'Bricks', price: 8, emoji: '🧱', description: 'Standard red clay bricks' },
        { id: 3, name: 'River Sand', price: 50, emoji: '🏖️', description: 'Fine quality river sand' }
      ] 
    },
    { id: 'nails', name: 'Nails & Fasteners', emoji: '📌', 
      products: [
        { id: 4, name: 'Steel Nails', price: 200, emoji: '📌', description: 'Pack of 100 steel nails' },
        { id: 5, name: 'Screws', price: 150, emoji: '🔩', description: 'Assorted construction screws' },
        { id: 6, name: 'Anchors', price: 300, emoji: '⚓', description: 'Wall anchors for heavy items' }
      ] 
    },
    { id: 'tools', name: 'Tools & Equipment', emoji: '🛠️', 
      products: [
        { id: 7, name: 'Drill Machine', price: 2500, emoji: '🔧', description: 'Heavy duty electric drill' },
        { id: 8, name: 'Grinder', price: 1800, emoji: '⚙️', description: 'Angle grinder for cutting and polishing' },
        { id: 9, name: 'Cutter', price: 1200, emoji: '✂️', description: 'Professional tile cutter' }
      ] 
    },
    { id: 'paints', name: 'Paints & Coatings', emoji: '🎨', 
      products: [
        { id: 10, name: 'Wall Paint', price: 600, emoji: '🖌️', description: 'Premium interior wall paint' },
        { id: 11, name: 'Wood Polish', price: 450, emoji: '🪵', description: 'High gloss wood polish' },
        { id: 12, name: 'Waterproofing', price: 800, emoji: '🌧️', description: 'Roof waterproofing coating' }
      ] 
    },
    { id: 'plumbing', name: 'Plumbing', emoji: '🚿', 
      products: [
        { id: 13, name: 'PVC Pipes', price: 120, emoji: '🚰', description: '3-inch PVC plumbing pipes' },
        { id: 14, name: 'Faucet', price: 850, emoji: '🚰', description: 'Modern kitchen faucet' },
        { id: 15, name: 'Shower Set', price: 1500, emoji: '🚿', description: 'Complete shower set' }
      ] 
    },
    { id: 'electrical', name: 'Electrical', emoji: '💡', 
      products: [
        { id: 16, name: 'Wires', price: 80, emoji: '🔌', description: 'Copper electrical wires' },
        { id: 17, name: 'Switches', price: 60, emoji: '🔘', description: 'Electrical switches' },
        { id: 18, name: 'LED Bulbs', price: 90, emoji: '💡', description: 'Energy efficient LED bulbs' }
      ] 
    },
    { id: 'safety', name: 'Safety Equipment', emoji: '⛑️', 
      products: [
        { id: 19, name: 'Helmet', price: 350, emoji: '⛑️', description: 'Construction safety helmet' },
        { id: 20, name: 'Gloves', price: 150, emoji: '🧤', description: 'Work gloves' },
        { id: 21, name: 'Safety Harness', price: 1200, emoji: '🪢', description: 'Full body safety harness' }
      ] 
    },
    { id: 'hardware', name: 'Hardware', emoji: '🔩', 
      products: [
        { id: 22, name: 'Hinges', price: 40, emoji: '🚪', description: 'Door hinges' },
        { id: 23, name: 'Handles', price: 75, emoji: '🚪', description: 'Cabinet handles' },
        { id: 24, name: 'Locks', price: 250, emoji: '🔒', description: 'Door locks' }
      ] 
    }
];

// DOM Elements
const loginPopup = document.getElementById('login-popup');
const sellerPortalPopup = document.getElementById('seller-portal-popup');
const productModal = document.getElementById('product-modal');
const paymentModal = document.getElementById('payment-modal');
const customerBtn = document.getElementById('customer-btn');
const sellerBtn = document.getElementById('seller-btn');
const googleLoginBtn = document.getElementById('google-login-btn');
const customerLoginBtn = document.getElementById('customer-login-btn');
const sellerPortalLink = document.getElementById('seller-portal-link');
const cartLink = document.getElementById('cart-link');
const cartCount = document.getElementById('cart-count');
const categoryGrid = document.querySelector('.category-grid');
const productForm = document.getElementById('product-form');
const productsList = document.getElementById('products-list');
const orderForm = document.getElementById('order-form');
const placeOrderBtn = document.getElementById('place-order-btn');
const loginPrompt = document.getElementById('login-prompt');
const confirmPaymentBtn = document.getElementById('confirm-payment');
const orderSummary = document.getElementById('order-summary');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Show login popup when page loads
    setTimeout(() => {
        loginPopup.style.display = 'flex';
    }, 500);
    
    // Render categories
    renderCategories();
    
    // Load seller products from localStorage
    const savedProducts = localStorage.getItem('sellerProducts');
    if (savedProducts) {
        sellerProducts = JSON.parse(savedProducts);
    }
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
    
    // Load user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        if (currentUser.type === 'seller') {
            isSeller = true;
            document.getElementById('seller-dashboard').style.display = 'block';
            document.getElementById('seller-login-container').style.display = 'none';
        }
    }
});

// Event Listeners
customerBtn.addEventListener('click', function() {
    loginPopup.style.display = 'none';
    currentUser = { type: 'customer', name: 'Guest' };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
});

sellerBtn.addEventListener('click', function() {
    loginPopup.style.display = 'none';
    sellerPortalPopup.style.display = 'flex';
    isSeller = true;
});

document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('.popup').style.display = 'none';
    });
});

document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

sellerPortalLink.addEventListener('click', function(e) {
    e.preventDefault();
    if (currentUser && currentUser.type === 'seller') {
        document.getElementById('seller-dashboard').style.display = 'block';
        document.getElementById('seller-login-container').style.display = 'none';
        renderSellerProducts();
    }
    sellerPortalPopup.style.display = 'flex';
});

googleLoginBtn.addEventListener('click', handleGoogleLogin);
customerLoginBtn.addEventListener('click', handleGoogleLogin);

productForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const productName = document.getElementById('product-name').value;
    const productCategory = document.getElementById('product-category').value;
    const productPrice = document.getElementById('product-price').value;
    const productDescription = document.getElementById('product-description').value;
    const productImage = document.getElementById('product-image').files[0];
    
    if (!productImage) {
        alert('Please upload a product image');
        return;
    }
    
    // Create a preview of the image
    const reader = new FileReader();
    reader.onload = function(e) {
        const newProduct = {
            id: Date.now(),
            name: productName,
            category: productCategory,
            price: parseFloat(productPrice),
            description: productDescription,
            image: e.target.result,
            seller: currentUser.name
        };
        
        sellerProducts.push(newProduct);
        localStorage.setItem('sellerProducts', JSON.stringify(sellerProducts));
        renderSellerProducts();
        productForm.reset();
        alert('Product listed successfully!');
    };
    reader.readAsDataURL(productImage);
});

orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!currentUser || currentUser.type === 'customer') {
        const quantity = parseInt(document.getElementById('quantity').value);
        const productId = parseInt(this.dataset.productId);
        const product = findProductById(productId);
        
        if (product) {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    id: productId,
                    name: product.name,
                    price: product.price,
                    quantity: quantity,
                    image: product.emoji || '📦'
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            productModal.style.display = 'none';
            
            // Show order summary in payment modal
            showOrderSummary();
            paymentModal.style.display = 'flex';
        }
    }
});

confirmPaymentBtn.addEventListener('click', function() {
    // In a real app, this would integrate with a payment gateway API
    alert('Payment successful! Your order has been placed.');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    paymentModal.style.display = 'none';
    
    // In a real app, this would notify the seller about the new order
    if (isSeller) {
        alert('New order received! Check your seller dashboard.');
    }
});

// Functions
function renderCategories() {
    categoryGrid.innerHTML = '';
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.dataset.categoryId = category.id;
        categoryCard.innerHTML = `
            <div class="category-icon">${category.emoji}</div>
            <div class="category-info">
                <h3>${category.name}</h3>
                <p>Browse products</p>
            </div>
        `;
        categoryCard.addEventListener('click', () => showCategoryProducts(category.id));
        categoryGrid.appendChild(categoryCard);
    });
}

function showCategoryProducts(categoryId) {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;
    
    const modalContent = document.getElementById('modal-product-details');
    modalContent.innerHTML = `
        <h2>${category.name} Products</h2>
        <div class="products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; width: 100%;">
            ${category.products.map(product => `
                <div class="product-card" style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; cursor: pointer;" data-product-id="${product.id}">
                    <div style="font-size: 40px; text-align: center;">${product.emoji}</div>
                    <h3 style="margin: 10px 0;">${product.name}</h3>
                    <p style="color: #e74c3c; font-weight: bold;">₹${product.price}</p>
                </div>
            `).join('')}
        </div>
    `;
    
    // Add event listeners to product cards
    setTimeout(() => {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function() {
                const productId = parseInt(this.dataset.productId);
                showProductDetails(productId, categoryId);
            });
        });
    }, 100);
    
    productModal.style.display = 'flex';
}

function showProductDetails(productId, categoryId) {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;
    
    const product = category.products.find(p => p.id === productId);
    if (!product) return;
    
    const modalContent = document.getElementById('modal-product-details');
    modalContent.innerHTML = `
        <div style="font-size: 100px; text-align: center; margin-right: 20px;">${product.emoji}</div>
        <div class="product-text">
            <h2>${product.name}</h2>
            <p class="price">₹${product.price}</p>
            <p class="description">${product.description}</p>
            <p><strong>Category:</strong> ${category.name}</p>
        </div>
    `;
    
    // Set product ID on order form
    orderForm.dataset.productId = productId;
    
    // Show/hide login prompt based on user type
    if (currentUser && currentUser.type === 'seller') {
        loginPrompt.style.display = 'none';
        placeOrderBtn.textContent = 'Add to Cart';
    } else if (!currentUser || currentUser.type === 'customer') {
        loginPrompt.style.display = 'none';
        placeOrderBtn.textContent = 'Add to Cart';
    }
}

function renderSellerProducts() {
    productsList.innerHTML = '';
    
    if (sellerProducts.length === 0) {
        productsList.innerHTML = '<p>You have no listed products yet.</p>';
        return;
    }
    
    sellerProducts.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h4>${product.name}</h4>
                <p>₹${product.price} • ${product.category}</p>
                <p>${product.description}</p>
            </div>
            <button class="delete-btn" data-product-id="${product.id}">Delete</button>
        `;
        productsList.appendChild(productItem);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            sellerProducts = sellerProducts.filter(p => p.id !== productId);
            localStorage.setItem('sellerProducts', JSON.stringify(sellerProducts));
            renderSellerProducts();
        });
    });
}

function handleGoogleLogin() {
    // In a real app, this would use Google Identity Services
    const userName = prompt('Enter your name (simulating Google login):');
    if (userName) {
        currentUser = {
            type: isSeller ? 'seller' : 'customer',
            name: userName,
            email: `${userName.toLowerCase().replace(' ', '')}@example.com`
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        if (isSeller) {
            document.getElementById('seller-login-container').style.display = 'none';
            document.getElementById('seller-dashboard').style.display = 'block';
            renderSellerProducts();
        } else {
            loginPrompt.style.display = 'none';
            placeOrderBtn.textContent = 'Add to Cart';
            alert(`Welcome ${userName}! You can now place orders.`);
        }
    }
}

function findProductById(productId) {
    for (const category of categories) {
        const product = category.products.find(p => p.id === productId);
        if (product) return product;
    }
    return null;
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

function showOrderSummary() {
    let total = 0;
    let summaryHTML = '<h3>Your Order</h3><ul style="list-style: none; padding: 0; margin: 20px 0;">';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        summaryHTML += `
            <li style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                <span>${item.name} x ${item.quantity}</span>
                <span>₹${itemTotal}</span>
            </li>
        `;
    });
    
    summaryHTML += `</ul>
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; margin-top: 20px;">
            <span>Total:</span>
            <span>₹${total}</span>
        </div>
    `;
    
    orderSummary.innerHTML = summaryHTML;
}

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === loginPopup) loginPopup.style.display = 'none';
    if (e.target === sellerPortalPopup) sellerPortalPopup.style.display = 'none';
    if (e.target === productModal) productModal.style.display = 'none';
    if (e.target === paymentModal) paymentModal.style.display = 'none';
});