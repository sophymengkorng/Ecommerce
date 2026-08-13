// Main Script - General Functionality

function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');
    const dropdownItem = document.querySelector('.nav-item-has-dropdown');

    if (!hamburger || !navMenu) return;

    const closeMenu = () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open navigation menu');
        dropdownItem?.classList.remove('dropdown-open');
    };

    hamburger.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen.toString());
        hamburger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');

        if (!isOpen) {
            dropdownItem?.classList.remove('dropdown-open');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (event) => {
            const isMobile = window.matchMedia('(max-width: 900px)').matches;

            if (isMobile && link.classList.contains('nav-dropdown')) {
                event.preventDefault();
                dropdownItem?.classList.toggle('dropdown-open');
                return;
            }

            closeMenu();
        });
    });

    document.addEventListener('click', (event) => {
        if (!navMenu.classList.contains('active')) return;
        if (event.target.closest('.navbar')) return;

        closeMenu();
    });

    window.addEventListener('resize', () => {
        if (!window.matchMedia('(max-width: 900px)').matches) {
            closeMenu();
        }
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
