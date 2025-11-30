// ========== CART MANAGEMENT ==========
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    startImageSliders();
    syncCartAcrossTabs();
});

// Add to Cart
function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    
    saveCart();
    updateCartCount();
    showNotification(`${name} added to cart!`);
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update Cart Count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Open Cart Modal
function openCart() {
    const modal = document.getElementById('cartModal');
    modal.style.display = 'block';
    displayCartItems();
}

// Close Cart Modal
function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target == modal) {
        closeCart();
    }
}

// Display Cart Items
function displayCartItems() {
    const container = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p></div>';
        document.getElementById('cart-total').textContent = '₹0';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        html += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">₹${item.price}</p>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeItem(${index})">×</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
    document.getElementById('cart-total').textContent = '₹' + total;
}

// Change Quantity
function changeQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    saveCart();
    updateCartCount();
    displayCartItems();
}

// Remove Item
function removeItem(index) {
    if (confirm('Remove this item from cart?')) {
        cart.splice(index, 1);
        saveCart();
        updateCartCount();
        displayCartItems();
    }
}

// Clear Cart
function clearCart() {
    if (confirm('Clear all items from cart?')) {
        cart = [];
        saveCart();
        updateCartCount();
        displayCartItems();
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Checkout - Total: ₹${total}\n\nCheckout functionality coming soon!`);
}

// Show Notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Sync Cart Across Tabs
function syncCartAcrossTabs() {
    window.addEventListener('storage', function(e) {
        if (e.key === 'cart') {
            cart = JSON.parse(e.newValue) || [];
            updateCartCount();
            if (document.getElementById('cartModal').style.display === 'block') {
                displayCartItems();
            }
        }
    });
}

// ========== IMAGE SLIDER ==========
function startImageSliders() {
    const sliders = document.querySelectorAll('.product-image');
    
    sliders.forEach(slider => {
        const images = JSON.parse(slider.dataset.images);
        if (images.length > 1) {
            let currentIndex = 0;
            const img = slider.querySelector('img');
            
            setInterval(() => {
                currentIndex = (currentIndex + 1) % images.length;
                img.style.opacity = 0;
                
                setTimeout(() => {
                    img.src = images[currentIndex];
                    img.style.opacity = 1;
                }, 300);
            }, 3000);
        }
    });
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
