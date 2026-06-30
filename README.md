# E-Commerce Website

A fully functional e-commerce website built with vanilla HTML, CSS, and JavaScript.

## Features

- **Product Catalog**: Browse products with images, descriptions, and prices
- **Search & Filter**: Find products by category or search term
- **Shopping Cart**: Add/remove items with real-time updates
- **Local Storage**: Cart persists across browser sessions
- **Product Details**: View detailed information about each product
- **Checkout**: Complete purchase process
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dynamic Pricing**: Cart total updates automatically

## Project Structure

```
├── index.html              # Home page
├── products.html           # Product listing page
├── product-detail.html     # Individual product page
├── cart.html              # Shopping cart page
├── checkout.html          # Checkout page
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── script.js          # Main JavaScript functionality
│   ├── product-data.js    # Product database
│   └── cart.js            # Cart management
├── assets/
│   └── images/            # Product images placeholder
└── README.md              # This file
```

## Getting Started

1. Open `index.html` in your web browser
2. Or use a local server:
   ```bash
   python -m http.server 8000
   # or
   npx http-server
   ```
3. Navigate to `http://localhost:8000`

## Usage

- Browse products on the Products page
- Click on a product to view details
- Add items to your cart
- View cart totals and manage quantities
- Proceed to checkout to complete purchase

## Features Implemented

✅ Product Display
✅ Add to Cart
✅ Remove from Cart
✅ Update Quantities
✅ Cart Persistence (Local Storage)
✅ Product Search
✅ Category Filter
✅ Responsive Design
✅ Price Calculation
✅ Checkout Process

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid)
- Vanilla JavaScript (ES6+)
- Local Storage API

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- User authentication
- Payment gateway integration
- Backend database
- Order history
- Product reviews and ratings
- Wishlist feature
- Admin panel
