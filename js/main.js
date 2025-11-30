// YOUR ORIGINAL IMAGE SLIDER - UNCHANGED
document.addEventListener('DOMContentLoaded', function() {
    const sliders = document.querySelectorAll('.product-image-slider');

    sliders.forEach(slider => {
        const images = JSON.parse(slider.dataset.images);
        if (images.length > 1) {
            let currentIndex = 0;
            const imgElement = slider.querySelector('img');

            setInterval(() => {
                currentIndex = (currentIndex + 1) % images.length;
                imgElement.style.opacity = 0;
                setTimeout(() => {
                    imgElement.src = images[currentIndex];
                    imgElement.style.opacity = 1;
                }, 300);
            }, 3000);

            imgElement.style.transition = 'opacity 0.3s ease-in-out';
        }
    });

    // Initialize cart
    updateCartBadge();
});

// CART FUNCTIONALITY - NEW ADDITION
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    
    // Show success feedback
    event.target.textContent = '✓ Added!';
    event.target.style.backgroundColor = '#27ae60';
    setTimeout(() => {
        event.target.textContent = 'Add to Cart';
        event.target.style.backgroundColor = '';
    }, 1500);
}

function updateCartBadge() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
}

function openCart() {
    document.getElementById('cartModal').style.display = 'block';
    displayCart();
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function displayCart() {
    const container = document.getElementById('cart-items-list');
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        document.getElementById('modal-cart-total').textContent = '₹0';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        html += `
            <div class="cart-item-row">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">₹${item.price}</p>
                </div>
                <div class="cart-qty-controls">
                    <button class="cart-qty-btn" onclick="changeQty(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="cart-qty-btn" onclick="changeQty(${index}, 1)">+</button>
                </div>
                <button class="cart-remove-btn" onclick="removeItem(${index})">×</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
    document.getElementById('modal-cart-total').textContent = '₹' + total;
}

function changeQty(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    displayCart();
}

function removeItem(index) {
    if (confirm('Remove this item?')) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        displayCart();
    }
}

function clearCart() {
    if (confirm('Clear all items from cart?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        displayCart();
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Total: ₹${total}\nCheckout coming soon!`);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target == modal) {
        closeCart();
    }
}
