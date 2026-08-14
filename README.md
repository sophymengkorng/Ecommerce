# Genz Pokemon Card Marketplace

Genz is a responsive Pokemon trading card e-commerce website built with HTML, CSS, and vanilla JavaScript. It lets shoppers browse collectible cards, filter the catalog, preview product details, save favorites, manage a cart, and complete a simulated checkout flow.

## Website Features

- **Home page**: Introduces the Pokemon card marketplace with a hero section, feature highlights, showcase sections, testimonials, and a call to action that leads visitors into the catalog.
- **Shared navigation**: Reusable JavaScript header with Home, New Arrivals, Products, category dropdown links, favorites shortcut, cart icon, mobile hamburger menu, and light/dark theme toggle.
- **Product catalog**: Displays Pokemon card products from `js/product-data.js` with image, category, description, rating, review count, price, original price, and discount badges.
- **Search and filters**: Products can be searched by name or description, filtered by category, limited by max price, and sorted by newest, price, or name.
- **Category links**: Category dropdown and collection cards open filtered catalog views through URL query parameters.
- **New arrivals page**: Highlights recent cards with a featured hero layout, arrival product cards, favorite buttons, and collection shortcuts.
- **Product preview dialog**: Product cards can open a quick-view dialog with image, rating, description, specifications, quantity selector, and add-to-cart action.
- **Product detail page**: Supports direct product pages by `id` query parameter, quantity selection, cart adding, breadcrumbs, and related products from the same category.
- **PokeAPI integration**: Product detail pages load matching Pokemon profile data from `https://pokeapi.co/api/v2/`, plus Pokemon version data from `https://pokeapi.co/api/v2/version/13/`.
- **Favorites**: Shoppers can favorite products from the catalog, arrival cards, and cart. Favorite IDs are stored in browser local storage and can be viewed on the favorites page.
- **Shopping cart**: Cart data persists in local storage, shows item images and descriptions, updates quantities, removes items, applies promo codes, calculates subtotal, discount, tax, shipping, and total, and shows the live cart count in the header.
- **Checkout flow**: Includes shipping information fields, shipping method choices, payment fields, terms validation, order summary totals, simulated order number, cart clearing, and redirect to an order success page.
- **Responsive design**: Layout and navigation are built for desktop, tablet, and mobile screens.

## Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Landing/home page for the marketplace |
| `products.html` | Full catalog with search, filters, sorting, favorites view, and multi-select add to cart |
| `new-arrivals.html` | Featured new cards and collection shortcuts |
| `product-detail.html` | Individual product detail view loaded by product ID |
| `cart.html` | Shopping cart, quantity controls, totals, and promo-code UI |
| `checkout.html` | Simulated checkout and order completion |
| `order-success.html` | Order confirmation page after checkout |

## Project Structure

```text
.
|-- index.html
|-- products.html
|-- new-arrivals.html
|-- product-detail.html
|-- cart.html
|-- checkout.html
|-- order-success.html
|-- css/
|   `-- style.css
|-- js/
|   |-- header.js
|   |-- script.js
|   |-- product-data.js
|   |-- product-ui.js
|   |-- poke-api.js
|   `-- cart.js
|-- image/
|   `-- product and marketplace images
|-- package.json
|-- vite.config.js
`-- README.md
```

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- PokeAPI
- Local Storage API
- Vite for local development and production builds

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Data Notes

Products are stored in `js/product-data.js`. Each product includes an ID, name, category, price, optional original price and discount, rating, review count, description, and image path.

Cart items, favorites, and theme preference are saved in browser local storage, so user selections can remain available after refreshing the page.

PokeAPI calls are handled in `js/poke-api.js`. Product profile requests use endpoint values such as `pokemon/pikachu`, so the final request becomes `https://pokeapi.co/api/v2/pokemon/pikachu/`. The version panel uses your endpoint exactly: `https://pokeapi.co/api/v2/version/13/`.

## Current Limitations

- Checkout is simulated and does not connect to a real payment gateway.
- Orders are not saved to a backend database.
- PokeAPI provides Pokemon profile data, not trading-card pricing or inventory data.
- User accounts, admin product management, and order history are not implemented.
