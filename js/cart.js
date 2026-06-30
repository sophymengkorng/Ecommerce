// Shopping Cart Management
const CART_STORAGE_KEY = 'shophub_cart';

function getCart() {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId) {
    addQuantityToCart(productId, 1);
    showAddedNotification();
}

function addQuantityToCart(productId, quantity) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            quantity: quantity
        });
    }

    saveCart(cart);
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
}

function getCartTotal() {
    const cart = getCart();
    let total = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            total += product.price * item.quantity;
        }
    });

    return total;
}

function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartCount();
}

function showAddedNotification() {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = 'Item added to cart. <a href="cart.html">View Cart</a>';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

function getCartStats() {
    const cart = getCart();
    let itemCount = 0;
    let total = 0;

    cart.forEach(item => {
        itemCount += item.quantity;
        const product = products.find(p => p.id === item.id);
        if (product) {
            total += product.price * item.quantity;
        }
    });

    return {
        items: itemCount,
        uniqueProducts: cart.length,
        total: total,
        subtotal: total,
        tax: total * 0.1,
        shipping: total > 50 ? 0 : 10
    };
}

function getTotalPrice() {
    const stats = getCartStats();
    return stats.subtotal + stats.tax + stats.shipping;
}
