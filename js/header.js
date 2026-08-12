// Header Component
function escapeHeaderHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[character]));
}

function getHeaderCategories() {
    const productList = typeof products !== 'undefined' && Array.isArray(products) ? products : [];

    if (productList.length === 0) {
        return [];
    }

    return [...new Set(productList.map(product => product.category).filter(Boolean))].sort();
}

function createCategoryDropdown() {
    const categories = getHeaderCategories();

    return `
        <ul class="category-dropdown" aria-label="Product categories">
            <li><a href="products.html">All Categories</a></li>
            ${categories.map(category => `
                <li><a href="products.html?category=${encodeURIComponent(category)}">${escapeHeaderHtml(category)}</a></li>
            `).join('')}
        </ul>
    `;
}

function createHeader() {
    return `
    <header>
        <nav class="navbar">
            <a class="logo" href="index.html">Gen<span>Z</span></a>
            <button class="hamburger" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="primary-navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-links" id="primary-navigation">
                <li><a href="index.html">Home</a></li>
                <li><a href="products.html">Products</a></li>
                <li class="nav-item-has-dropdown">
                    <a href="products.html" class="nav-dropdown" aria-haspopup="true">
                        Categories
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M6 9l6 6 6-6"></path>
                        </svg>
                    </a>
                    ${createCategoryDropdown()}
                </li>
                <li><a href="products.html">New Arrivals</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
            <div class="nav-right">
                <a href="products.html" class="header-icon-btn" aria-label="Search products">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="11" cy="11" r="7"></circle>
                        <path d="M16.5 16.5L21 21"></path>
                    </svg>
                </a>
                <a href="#" class="header-icon-btn" aria-label="Wishlist">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6z"></path>
                    </svg>
                </a>
                <a href="cart.html" class="header-icon-btn cart-link" aria-label="View cart">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L22 6H6"></path>
                    </svg>
                    <span id="cart-count" class="cart-count">0</span>
                </a>
                <a href="products.html" class="header-shop-btn">
                    Shop Now
                </a>
            </div>
        </nav>
    </header>
    `;
}

function renderHeader() {
    const body = document.body;
    const headerElement = document.createElement('div');
    headerElement.innerHTML = createHeader();
    body.insertBefore(headerElement.firstElementChild, body.firstChild);

    updateCartCount();
}

document.addEventListener('DOMContentLoaded', renderHeader);
