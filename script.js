// Section data
const sectionsData = {
    'raw-materials': {
        title: 'Raw Materials',
        items: [
            { id: 1, name: 'Cement', price: 400, unit: 'bag' },
            { id: 2, name: 'Brick', price: 8, unit: 'piece' },
            { id: 3, name: 'River Sand', price: 1200, unit: 'ton' },
            { id: 4, name: 'Coarse Aggregate', price: 900, unit: 'ton' },
            { id: 5, name: 'Steel Rods', price: 65, unit: 'kg' }
        ]
    },
    'nails': {
        title: 'Nails & Fasteners',
        items: [
            { id: 6, name: 'Common Nails', price: 120, unit: 'kg' },
            { id: 7, name: 'Roofing Nails', price: 150, unit: 'kg' },
            { id: 8, name: 'Concrete Nails', price: 180, unit: 'kg' },
            { id: 9, name: 'Screws', price: 200, unit: 'box' },
            { id: 10, name: 'Anchors', price: 10, unit: 'piece' }
        ]
    },
    'power-tools': {
        title: 'Power Tools',
        items: [
            { id: 11, name: 'Drill Machine', price: 3500, unit: 'piece' },
            { id: 12, name: 'Angle Grinder', price: 2800, unit: 'piece' },
            { id: 13, name: 'Cutter Machine', price: 4200, unit: 'piece' },
            { id: 14, name: 'Hammer Drill', price: 5000, unit: 'piece' },
            { id: 15, name: 'Circular Saw', price: 4500, unit: 'piece' }
        ]
    },
    'paints': {
        title: 'Paints & Coatings',
        items: [
            { id: 16, name: 'Interior Emulsion', price: 1200, unit: 'gallon' },
            { id: 17, name: 'Exterior Paint', price: 1500, unit: 'gallon' },
            { id: 18, name: 'Primer', price: 900, unit: 'gallon' },
            { id: 19, name: 'Enamel Paint', price: 1100, unit: 'gallon' },
            { id: 20, name: 'Wood Polish', price: 1800, unit: 'liter' }
        ]
    },
    'plumbing': {
        title: 'Plumbing',
        items: [
            { id: 21, name: 'PVC Pipes', price: 120, unit: 'meter' },
            { id: 22, name: 'CPVC Pipes', price: 180, unit: 'meter' },
            { id: 23, name: 'Faucet', price: 800, unit: 'piece' },
            { id: 24, name: 'Shower Set', price: 2500, unit: 'set' },
            { id: 25, name: 'Water Tank', price: 3500, unit: 'piece' }
        ]
    },
    'electrical': {
        title: 'Electrical',
        items: [
            { id: 26, name: 'Electrical Wires', price: 150, unit: 'meter' },
            { id: 27, name: 'Switches', price: 60, unit: 'piece' },
            { id: 28, name: 'Sockets', price: 80, unit: 'piece' },
            { id: 29, name: 'Circuit Breaker', price: 400, unit: 'piece' },
            { id: 30, name: 'LED Bulbs', price: 120, unit: 'piece' }
        ]
    },
    'safety': {
        title: 'Safety Equipment',
        items: [
            { id: 31, name: 'Safety Helmet', price: 300, unit: 'piece' },
            { id: 32, name: 'Safety Gloves', price: 150, unit: 'pair' },
            { id: 33, name: 'Safety Goggles', price: 200, unit: 'piece' },
            { id: 34, name: 'Safety Shoes', price: 1200, unit: 'pair' },
            { id: 35, name: 'Ear Protection', price: 250, unit: 'piece' }
        ]
    },
    'hardware': {
        title: 'Hardware',
        items: [
            { id: 36, name: 'Hinges', price: 25, unit: 'piece' },
            { id: 37, name: 'Handles', price: 80, unit: 'piece' },
            { id: 38, name: 'Locks', price: 250, unit: 'piece' },
            { id: 39, name: 'Drawer Slides', price: 180, unit: 'pair' },
            { id: 40, name: 'Latches', price: 50, unit: 'piece' }
        ]
    }
};

// Global variables
let currentItem = null;
let isLoggedIn = false;

// DOM elements
const sectionModal = document.getElementById('sectionModal');
const orderModal = document.getElementById('orderModal');
const paymentModal = document.getElementById('paymentModal');
const modalItems = document.getElementById('modalItems');
const modalTitle = document.getElementById('modalTitle');
const orderItemTitle = document.getElementById('orderItemTitle');
const loginPrompt = document.getElementById('loginPrompt');
const orderForm = document.getElementById('orderForm');
const paymentSummary = document.getElementById('paymentSummary');
const loginBtn = document.getElementById('loginBtn');

// Open section modal with items
function openSection(sectionId) {
    const section = sectionsData[sectionId];
    modalTitle.textContent = section.title;
    modalItems.innerHTML = '';
    
    section.items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.innerHTML = `
            <img src="item-${item.id}.jpg" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>₹${item.price} per ${item.unit}</p>
        `;
        itemCard.addEventListener('click', () => openOrderModal(item));
        modalItems.appendChild(itemCard);
    });
    
    sectionModal.style.display = 'block';
}

// Open order modal for specific item
function openOrderModal(item) {
    currentItem = item;
    orderItemTitle.textContent = item.name;
    
    if (isLoggedIn) {
        orderForm.style.display = 'block';
        loginPrompt.style.display = 'none';
    } else {
        orderForm.style.display = 'none';
        loginPrompt.style.display = 'block';
    }
    
    sectionModal.style.display = 'none';
    orderModal.style.display = 'block';
}

// Proceed to payment
function proceedToPayment() {
    const quantity = document.getElementById('quantity').value;
    if (!quantity || quantity < 1) {
        alert('Please enter a valid quantity');
        return;
    }
    
    const total = quantity * currentItem.price;
    paymentSummary.innerHTML = `
        <p><strong>Item:</strong> ${currentItem.name}</p>
        <p><strong>Quantity:</strong> ${quantity} ${currentItem.unit}(s)</p>
        <p><strong>Unit Price:</strong> ₹${currentItem.price}</p>
        <p><strong>Total Amount:</strong> ₹${total}</p>
    `;
    
    orderModal.style.display = 'none';
    paymentModal.style.display = 'block';
}

// Select payment method
function selectPayment(method) {
    // In a real app, you would handle the payment integration here
    console.log(`Selected payment method: ${method}`);
}

// Confirm payment
function confirmPayment() {
    alert('Payment successful! Your order has been placed.');
    closeModal();
}

// Login with Google
function loginWithGoogle() {
    // In a real app, you would implement Google OAuth here
    isLoggedIn = true;
    alert('Logged in successfully with Google');
    openOrderModal(currentItem);
}

// Close modal
function closeModal() {
    sectionModal.style.display = 'none';
    orderModal.style.display = 'none';
    paymentModal.style.display = 'none';
}

// Login button click
loginBtn.addEventListener('click', () => {
    // Toggle login state for demo purposes
    isLoggedIn = !isLoggedIn;
    loginBtn.textContent = isLoggedIn ? 'Logout' : 'Login';
    alert(isLoggedIn ? 'Logged in successfully' : 'Logged out successfully');
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === sectionModal) {
        closeModal();
    }
    if (event.target === orderModal) {
        closeModal();
    }
    if (event.target === paymentModal) {
        closeModal();
    }
});