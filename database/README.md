# Database Layer (PostgreSQL 16, Prisma ORM & SQL Migrations)

Houses the relational models, migrations, and database schema definitions powering user identities, catalog entities, and order ledgers.

## Structure
- `users/user.model.ts`: TypeScript entity interface and repository helpers for User records.
- `schemas/schema.prisma`: Prisma ORM schema specifying User, Product, Order, and Session tables.
- `schemas/orders.sql`: Raw PostgreSQL relational schema with foreign key constraints, indexes, and trigger functions.

## Relational Topology
```text
  ┌──────────────┐          ┌──────────────┐
  │    Users     │1        *│    Orders    │
  │──────────────│──────────│──────────────│
  │ id (PK)      │          │ id (PK)      │
  │ email        │          │ user_id (FK) │
  │ passwordHash │          │ total_amount │
  │ role         │          │ status       │
  └──────────────┘          └──────────────┘
                                   │1
                                   │
                                   │*
                            ┌──────────────┐
                            │ Order_Items  │
                            │──────────────│
                            │ id (PK)      │
                            │ order_id(FK) │
                            │ product_id   │
                            │ quantity     │
                            └──────────────┘
```
