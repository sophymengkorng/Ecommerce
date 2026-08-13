function escapeProductHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[character]));
}

function getDiscountPercentage(product) {
    return product.discount ? Math.abs(product.discount) : 0;
}

function renderProductRating(product) {
    if (!product.rating) return '';

    const stars = '\u2605'.repeat(Math.floor(product.rating));
    return `
        <div class="rating" aria-label="${product.rating} out of 5 stars">
            <span class="stars" aria-hidden="true">${stars}</span>
            <span class="review-count">(${product.reviewCount || 0})</span>
        </div>
    `;
}

function renderProductPrice(product, modifierClass = '') {
    const discountPercentage = getDiscountPercentage(product);
    const className = modifierClass ? `price-section ${modifierClass}` : 'price-section';

    if (discountPercentage > 0 && product.originalPrice) {
        return `
            <div class="${className}">
                <span class="original-price">${formatPrice(product.originalPrice)}</span>
                <span class="price">${formatPrice(product.price)}</span>
            </div>
        `;
    }

    return `<div class="${className}"><span class="price">${formatPrice(product.price)}</span></div>`;
}

function renderProductCard(product) {
    const card = document.createElement('article');
    const discountPercentage = getDiscountPercentage(product);
    const isFavoritesPage = new URLSearchParams(window.location.search).get('favorites') === '1';
    const isSelectableProductPage = document.body.classList.contains('products-page') && !isFavoritesPage;
    const productSelected = isSelectableProductPage && typeof isProductSelected === 'function' && isProductSelected(product.id);
    const safeName = escapeProductHtml(product.name);
    const safeCategory = escapeProductHtml(product.category);
    const safeDescription = escapeProductHtml(product.description);
    const safeImage = escapeProductHtml(product.image);
    const discountBadgeHTML = discountPercentage > 0
        ? `<div class="discount-badge">${discountPercentage}% off</div>`
        : '';
    const favoriteActive = typeof isFavorite === 'function' && isFavorite(product.id);

    card.className = 'product-card';
    card.innerHTML = `
        ${discountBadgeHTML}
        ${isSelectableProductPage ? `
            <label class="product-select-control" aria-label="Select ${safeName}">
                <input type="checkbox" class="product-select-checkbox" onchange="toggleProductSelection(${product.id}, this.checked)" ${productSelected ? 'checked' : ''}>
            </label>
        ` : ''}
        ${isFavoritesPage ? '' : `
            <button type="button" class="favorite-btn product-favorite-btn ${favoriteActive ? 'active' : ''}" data-favorite-id="${product.id}" onclick="toggleFavorite(${product.id}, this)" aria-label="${favoriteActive ? 'Remove from favorites' : 'Add to favorites'}" aria-pressed="${favoriteActive}">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6z"></path>
                </svg>
            </button>
        `}
        <div class="product-image">
            <img src="${safeImage}" alt="${safeName}" class="product-img">
        </div>
        <div class="product-info">
            <h3>${safeName}</h3>
            <p class="product-category">${safeCategory}</p>
            ${renderProductRating(product)}
            <p class="product-description">${safeDescription}</p>
            <div class="product-footer">
                ${renderProductPrice(product)}
                <div class="product-buttons">
                    ${isFavoritesPage ? `
                        <button type="button" class="btn product-remove-favorite-btn" data-favorite-id="${product.id}" onclick="toggleFavorite(${product.id}, this)" aria-label="Remove ${safeName} from favorites">
                            <span>Remove</span>
                        </button>
                    ` : `
                        <button type="button" class="btn btn-outline product-view-btn" onclick="openProductDialog(${product.id})" aria-label="View details for ${safeName}">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <span>View</span>
                        </button>
                        <button type="button" class="btn btn-small product-cart-btn" onclick="addToCart(${product.id})" aria-label="Add ${safeName} to cart">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <circle cx="8" cy="21" r="1"></circle>
                                <circle cx="19" cy="21" r="1"></circle>
                                <path d="M2.5 3h3l2.2 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H7"></path>
                            </svg>
                            <span>Add to Cart</span>
                        </button>
                    `}
                </div>
            </div>
        </div>
    `;

    return card;
}

function ensureProductDialog() {
    let dialog = document.getElementById('product-dialog');
    if (dialog) return dialog;

    dialog = document.createElement('dialog');
    dialog.id = 'product-dialog';
    dialog.className = 'product-dialog';
    dialog.innerHTML = `
        <div class="product-dialog-panel">
            <button type="button" class="product-dialog-close" onclick="closeProductDialog()" aria-label="Close product preview">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                </svg>
            </button>
            <div id="product-dialog-content"></div>
        </div>
    `;
    dialog.addEventListener('click', event => {
        if (event.target === dialog) {
            closeProductDialog();
        }
    });
    document.body.appendChild(dialog);
    return dialog;
}

function openProductDialog(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) return;

    const dialog = ensureProductDialog();
    const content = dialog.querySelector('#product-dialog-content');
    const discountPercentage = getDiscountPercentage(product);
    const safeName = escapeProductHtml(product.name);
    const safeCategory = escapeProductHtml(product.category);
    const safeDescription = escapeProductHtml(product.description);
    const safeImage = escapeProductHtml(product.image);
    const discountBadgeHTML = discountPercentage > 0
        ? `<div class="discount-badge">${discountPercentage}% off</div>`
        : '';

    content.innerHTML = `
        <div class="product-dialog-layout">
            <div class="product-dialog-image">
                ${discountBadgeHTML}
                <img src="${safeImage}" alt="${safeName}" class="product-img">
            </div>
            <div class="product-dialog-info">
                <h2>${safeName}</h2>
                <p class="product-category">${safeCategory}</p>
                ${renderProductRating(product)}
                <div class="dialog-price-row">
                    <span class="price-label">Price:</span>
                    ${renderProductPrice(product, 'dialog-price')}
                </div>
                <div class="description-section">
                    <h3>Description</h3>
                    <p>${safeDescription}</p>
                </div>
                <div class="specifications">
                    <h3>Specifications</h3>
                    <ul>
                        <li>Collector-focused card listing</li>
                        <li>Protected packaging for shipping</li>
                        <li>30-day return policy</li>
                    </ul>
                </div>
                <div class="quantity-section dialog-quantity-section">
                    <label for="product-dialog-quantity">Quantity:</label>
                    <div class="quantity-selector">
                        <button type="button" class="qty-btn" onclick="decreaseProductDialogQuantity()">-</button>
                        <input type="number" id="product-dialog-quantity" value="1" min="1" max="10">
                        <button type="button" class="qty-btn" onclick="increaseProductDialogQuantity()">+</button>
                    </div>
                </div>
                <div class="product-dialog-actions">
                    <button type="button" class="btn btn-primary" onclick="addProductDialogToCart(${product.id})">Add to Cart</button>
                </div>
                <div class="product-info-extra dialog-info-extra">
                    <p>Free shipping on orders over $50</p>
                    <p>Secure checkout</p>
                    <p>Cart updates instantly</p>
                </div>
            </div>
        </div>
    `;

    if (typeof dialog.showModal === 'function') {
        dialog.showModal();
    } else {
        dialog.setAttribute('open', '');
    }
}

function closeProductDialog() {
    const dialog = document.getElementById('product-dialog');
    if (!dialog) return;

    if (typeof dialog.close === 'function') {
        dialog.close();
    } else {
        dialog.removeAttribute('open');
    }
}

function getProductDialogQuantityInput() {
    return document.getElementById('product-dialog-quantity');
}

function increaseProductDialogQuantity() {
    const input = getProductDialogQuantityInput();
    if (!input) return;

    const value = parseInt(input.value, 10) || 1;
    input.value = Math.min(value + 1, 10);
}

function decreaseProductDialogQuantity() {
    const input = getProductDialogQuantityInput();
    if (!input) return;

    const value = parseInt(input.value, 10) || 1;
    input.value = Math.max(value - 1, 1);
}

function addProductDialogToCart(productId) {
    const input = getProductDialogQuantityInput();
    const quantity = Math.min(Math.max(parseInt(input?.value, 10) || 1, 1), 10);
    const product = products.find(item => item.id === productId);
    const productName = product ? product.name : 'this item';

    confirmCartAction({
        title: 'Add to cart?',
        message: `Add ${quantity} ${quantity === 1 ? 'item' : 'items'} of ${productName} to your cart?`,
        confirmLabel: 'Add to Cart'
    }, () => {
        addQuantityToCart(productId, quantity);
        showAddedNotification();
        closeProductDialog();
    });
}
