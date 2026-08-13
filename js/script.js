// Main Script - General Functionality

function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen.toString());
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

// Update active link
function updateActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const searchParams = new URLSearchParams(window.location.search);
    const activeLabel = currentPage === 'new-arrivals.html'
        ? 'New Arrivals'
        : currentPage === 'products.html' && searchParams.has('category')
        ? 'Categories'
        : currentPage === 'products.html'
            ? 'Products'
            : null;

    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkPage = link.getAttribute('href').split('?')[0];
        const linkLabel = link.textContent.trim();

        link.classList.remove('active');

        if (activeLabel && linkLabel === activeLabel) {
            link.classList.add('active');
            return;
        }

        if (!activeLabel && linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

// Update cart count in navigation
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    updateActiveLink();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Format price
function formatPrice(price) {
    return price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
