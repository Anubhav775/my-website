// Global variables
let currentUser = null;
let currentUserType = null;
let currentProduct = null;
let products = {
    'raw-materials': [
        { id: 1, name: 'Portland Cement (50kg)', price: 400, description: 'High quality Portland cement for construction', image: 'https://images.unsplash.com/photo-1605152276897-4f618f831968' },
        { id: 2, name: 'Clay Bricks (100 pieces)', price: 2500, description: 'Standard size clay bricks', image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115' },
        { id: 3, name: 'River Sand (1 ton)', price: 1800, description: 'Fine quality river sand for construction', image: 'https://images.unsplash.com/photo-1608889825103-eb2a7e1f0fcd' }
    ],
    'nails-fasteners': [
        { id: 4, name: 'Galvanized Nails (1kg)', price: 120, description: 'Rust-resistant galvanized nails', image: 'https://images.unsplash.com/photo-1584735422189-fbd23f4c6b8a' },
        { id: 5, name: 'Wood Screws (100 pieces)', price: 180, description: 'Assorted wood screws', image: 'https://images.unsplash.com/photo-1584735422189-fbd23f4c6b8a' }
    ],
    'power-tools': [
        { id: 6, name: 'Electric Drill Machine', price: 3500, description: '750W heavy duty drill machine', image: 'https://images.unsplash.com/photo-1591798454113-023ed737a270' },
        { id: 7, name: 'Angle Grinder', price: 2800, description: '850W angle grinder with safety features', image: 'https://images.unsplash.com/photo-1591798454113-023ed737a270' }
    ]
};
let sellerProducts = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Show login modal when page loads
    document.getElementById('login-modal').style.display = 'flex';
    
    // Load seller products from localStorage if available
    const savedProducts = localStorage.getItem('sellerProducts');
    if (savedProducts) {
        sellerProducts = JSON.parse(savedProducts);
        renderSellerProducts();
    }
    
    // Form submission for seller to add product
    document.getElementById('product-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addSellerProduct();
    });
});

// User type selection
function selectUserType(type) {
    currentUserType = type;
    
    // Highlight selected option
    document.querySelectorAll('.user-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // Show appropriate actions
    if (type === 'customer') {
        document.getElementById('customer-actions').style.display = 'block';
        document.getElementById('seller-actions').style.display = 'none';
    } else {
        document.getElementById('customer-actions').style.display = 'none';
        document.getElementById('seller-actions').style.display = 'block';
    }
}

// Proceed as customer (guest)
function proceedAsCustomer() {
    closeModal('login-modal');
    currentUserType = 'customer';
}

// Login with Google (mock implementation)
function loginWithGoogle() {
    // In a real implementation, this would use Google Identity Platform
    currentUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'
    };
    
    closeModal('login-modal');
    
    if (currentUserType === 'seller') {
        document.getElementById('seller-dashboard').style.display = 'block';
        showNotification('Logged in successfully as seller');
    } else {
        showNotification('Logged in successfully');
    }
}

// Open product section
function openSection(sectionId) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    if (products[sectionId]) {
        container.innerHTML = `<h2>${formatSectionName(sectionId)}</h2><div class="product-listing"></div>`;
        const listingContainer = container.querySelector('.product-listing');
        
        products[sectionId].forEach(product => {
            listingContainer.appendChild(createProductCard(product));
        });
    } else {
        container.innerHTML = `<p>No products available in this category yet.</p>`;
    }
    
    // Scroll to products
    container.scrollIntoView({ behavior: 'smooth' });
}

// Format section ID to readable name
function formatSectionName(sectionId) {
    return sectionId.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Create product card HTML
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">₹${product.price}</p>
            <button class="btn" onclick="openOrderModal(${product.id})">Order Now</button>
        </div>
    `;
    return card;
}

// Open order modal
function openOrderModal(productId) {
    // Find product in all categories
    let foundProduct = null;
    for (const category in products) {
        const product = products[category].find(p => p.id === productId);
        if (product) {
            foundProduct = product;
            break;
        }
    }
    
    if (!foundProduct) return;
    
    currentProduct = foundProduct;
    
    document.getElementById('order-details').innerHTML = `
        <div style="display: flex; margin-bottom: 20px;">
            <img src="${foundProduct.image}" alt="${foundProduct.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px; margin-right: 15px;">
            <div>
                <h3>${foundProduct.name}</h3>
                <p>${foundProduct.description}</p>
                <p style="font-weight: bold; color: #27ae60; font-size: 18px;">₹${foundProduct.price}</p>
            </div>
        </div>
    `;
    
    document.getElementById('quantity').value = 1;
    document.getElementById('order-modal').style.display = 'flex';
}

// Change quantity
function changeQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    let newValue = parseInt(quantityInput.value) + change;
    if (newValue < 1) newValue = 1;
    quantityInput.value = newValue;
}

// Proceed to payment
function proceedToPayment() {
    if (!currentUser && currentUserType !== 'customer') {
        showNotification('Please login to place an order');
        document.getElementById('login-modal').style.display = 'flex';
        closeModal('order-modal');
        return;
    }
    
    const quantity = parseInt(document.getElementById('quantity').value);
    const total = quantity * currentProduct.price;
    
    document.getElementById('payment-summary').innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3>Order Summary</h3>
            <p>${currentProduct.name} x ${quantity}</p>
            <p style="font-weight: bold; color: #27ae60; font-size: 18px;">Total: ₹${total}</p>
        </div>
    `;
    
    closeModal('order-modal');
    document.getElementById('payment-modal').style.display = 'flex';
}

// Process payment (mock implementation)
function processPayment() {
    // In a real implementation, this would integrate with a payment gateway API/SDK
    showNotification('Payment successful! Your order has been placed.');
    closeModal('payment-modal');
    
    // In a real system, this order data would be sent to the seller
    const orderData = {
        product: currentProduct,
        quantity: parseInt(document.getElementById('quantity').value),
        total: parseInt(document.getElementById('quantity').value) * currentProduct.price,
        customer: currentUser || { name: 'Guest Customer' },
        date: new Date().toLocaleString()
    };
    
    console.log('Order placed:', orderData);
}

// Add seller product
function addSellerProduct() {
    const name = document.getElementById('product-name').value;
    const category = document.getElementById('product-category').value;
    const description = document.getElementById('product-description').value;
    const price = document.getElementById('product-price').value;
    const imageInput = document.getElementById('product-image');
    
    // In a real implementation, you would upload the image to a server
    // For this demo, we'll just use a placeholder
    const imageFile = imageInput.files[0];
    let imageUrl = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae'; // Default placeholder
    
    if (imageFile) {
        // Create a local URL for the preview (in a real app, you'd upload this)
        imageUrl = URL.createObjectURL(imageFile);
    }
    
    const newProduct = {
        id: Date.now(), // Simple unique ID
        name,
        category,
        description,
        price: parseFloat(price),
        image: imageUrl,
        seller: currentUser.name
    };
    
    sellerProducts.push(newProduct);
    saveSellerProducts();
    renderSellerProducts();
    
    // Reset form
    document.getElementById('product-form').reset();
    showNotification('Product listed successfully!');
}

// Render seller products
function renderSellerProducts() {
    const container = document.getElementById('seller-products');
    container.innerHTML = '';
    
    if (sellerProducts.length === 0) {
        container.innerHTML = '<p>You have no listed products yet.</p>';
        return;
    }
    
    sellerProducts.forEach(product => {
        container.appendChild(createProductCard(product));
    });
}

// Save seller products to localStorage
function saveSellerProducts() {
    localStorage.setItem('sellerProducts', JSON.stringify(sellerProducts));
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Show notification
function showNotification(message) {
    // In a real implementation, this would show a nice toast notification
    alert(message);
}