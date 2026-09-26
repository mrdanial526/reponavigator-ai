# Backend Service (Fastify REST Gateway & Business Logic)

Core API orchestrator serving product catalogs, order processing pipelines, and payment dispatches.

## Responsibilities
- Routes requests received from `Frontend`.
- Forwards authorization headers to `Auth Service` for token validation.
- Executes SQL queries against `Database` (PostgreSQL / Prisma).
- Dispatches payment requests to Stripe gateway.

## Structure
- `api/order.controller.ts`: Handles incoming checkout payloads and order status queries.
- `api/product.controller.ts`: Provides product catalog search, categories, and inventory counts.
- `api/routes.ts`: Central endpoint registry mapping URLs to controllers.
- `services/orderService.ts`: Validates inventory and persists order records in PostgreSQL.
- `services/productService.ts`: Caches hot products in Redis and fetches database rows.
- `services/paymentGateway.ts`: Interacts with Stripe SDK and generates payment intents.
