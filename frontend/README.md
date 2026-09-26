# Frontend Service (Next.js E-Commerce UI)

Handles the customer-facing storefront, product catalog browsing, shopping cart state, and user profile management.

## Key Modules
- `components/Navbar.tsx`: Global navigation bar with user session indicator and cart badge.
- `components/ProductCard.tsx`: Interactive product item card with instant add-to-cart.
- `components/CartDrawer.tsx`: Slide-over cart manager calculating taxes and shipping.
- `pages/index.tsx`: Storefront catalog feed querying Backend REST APIs.
- `pages/checkout.tsx`: Multi-step checkout form forwarding order payloads.
- `pages/profile.tsx`: Authenticated user dashboard displaying order history.

## Communication
- Dispatches HTTP requests to `Backend Gateway` (`http://localhost:8080/api`).
- Sends JWT Bearer tokens retrieved from `Auth Service`.
