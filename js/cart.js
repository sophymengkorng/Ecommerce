// Shopping Cart Management
const CART_STORAGE_KEY = 'shophub_cart';
const FAVORITE_STORAGE_KEY = 'genz_favorites';

function escapeCartHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[character]));
}

function ensureCartConfirmDialog() {
    let dialog = document.getElementById('cart-confirm-dialog');
    if (dialog) return dialog;

    dialog = document.createElement('dialog');
    dialog.id = 'cart-confirm-dialog';
    dialog.className = 'cart-confirm-dialog';
    document.body.appendChild(dialog);
    return dialog;
}

function confirmCartAction(options, onConfirm) {
    const dialog = ensureCartConfirmDialog();
    const title = escapeCartHtml(options.title || 'Confirm action');
    const message = escapeCartHtml(options.message || 'Are you sure?');
    const confirmLabel = escapeCartHtml(options.confirmLabel || 'Confirm');
    const confirmClass = options.danger ? 'btn btn-primary cart-confirm-danger' : 'btn btn-primary';

    dialog.innerHTML = `
        <div class="cart-confirm-panel">
            <h2>${title}</h2>
            <p>${message}</p>
            <div class="cart-confirm-actions">
                <button type="button" class="btn btn-outline" data-cart-confirm-cancel>Cancel</button>
                <button type="button" class="${confirmClass}" data-cart-confirm-accept>${confirmLabel}</button>
            </div>
        </div>
    `;

    const closeDialog = () => {
        if (typeof dialog.close === 'function' && dialog.open) {
            dialog.close();
        } else {
            dialog.removeAttribute('open');
        }
    };

    dialog.querySelector('[data-cart-confirm-cancel]').addEventListener('click', closeDialog);
    dialog.querySelector('[data-cart-confirm-accept]').addEventListener('click', () => {
        closeDialog();
        onConfirm();
    });

    if (typeof dialog.showModal === 'function') {
        dialog.showModal();
    } else {
        dialog.setAttribute('open', '');
    }
}

function getCart() {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
}

function getFavorites() {
    const favorites = localStorage.getItem(FAVORITE_STORAGE_KEY);
    return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(favorites));
    updateFavoriteButtons();
}

function isFavorite(productId) {
    return getFavorites().includes(productId);
}

function toggleFavorite(productId, button) {
    const favorites = getFavorites();
    const product = typeof products !== 'undefined' ? products.find(item => item.id === productId) : null;
    const productName = product ? product.name : 'this item';
    const existingIndex = favorites.indexOf(productId);
    const isAdding = existingIndex === -1;

    confirmCartAction({
        title: isAdding ? 'Add to favorites?' : 'Remove favorite?',
        message: `${isAdding ? 'Add' : 'Remove'} ${productName} ${isAdding ? 'to' : 'from'} your favorites?`,
        confirmLabel: isAdding ? 'Add Favorite' : 'Remove',
        danger: !isAdding
    }, () => {
        const updatedFavorites = getFavorites();
        const updatedIndex = updatedFavorites.indexOf(productId);

        if (isAdding && updatedIndex === -1) {
            updatedFavorites.push(productId);
        } else if (!isAdding && updatedIndex !== -1) {
            updatedFavorites.splice(updatedIndex, 1);
        }

        saveFavorites(updatedFavorites);
        updateFavoriteButton(button, productId);
        showFavoriteNotification(`${productName} ${isAdding ? 'added to' : 'removed from'} favorites.`);

        if (window.location.search.includes('favorites=1') && typeof applyFilters === 'function') {
            applyFilters();
        }
    });
}

function updateFavoriteButton(button, productId) {
    if (!button) return;

    const active = isFavorite(productId);
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', active.toString());
    button.setAttribute('aria-label', active ? 'Remove from favorites' : 'Add to favorites');
}

function updateFavoriteButtons() {
    document.querySelectorAll('[data-favorite-id]').forEach(button => {
        updateFavoriteButton(button, parseInt(button.dataset.favoriteId, 10));
    });
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId) {
    const product = typeof products !== 'undefined' ? products.find(item => item.id === productId) : null;
    const productName = product ? product.name : 'this item';

    confirmCartAction({
        title: 'Add to cart?',
        message: `Add ${productName} to your cart?`,
        confirmLabel: 'Add to Cart'
    }, () => {
        addQuantityToCart(productId, 1);
        showAddedNotification();
    });
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
    const product = typeof products !== 'undefined'
        ? products.find(item => item.id === cart[index]?.id)
        : null;
    const productName = product ? product.name : 'this item';

    confirmCartAction({
        title: 'Remove item?',
        message: `Remove ${productName} from your cart?`,
        confirmLabel: 'Remove',
        danger: true
    }, () => {
        const updatedCart = getCart();
        updatedCart.splice(index, 1);
        saveCart(updatedCart);
    });
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

function showFavoriteNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 1800);
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
