# API Documentation

## Endpoint `/initialize-db`

### `GET`
- **Description:** Initializes the database with seed data.

---

## Endpoint `/products/:month`

### `GET`
- **Description:** Fetches products for a specified month.
- **Endpoints:**
  - `http://localhost:3000/products/March`
  - `http://localhost:3000/products/April`

---

## Endpoint `/transactions`

### `GET`
- **Description:** List transactions with pagination and optional search parameters.
- **Endpoint:** `http://localhost:3000/transactions?page=1&perPage=10&search=cotton`