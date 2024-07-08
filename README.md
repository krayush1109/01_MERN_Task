# API Documentation

## Initialize Database

### Description
Initializes the database with seed data.

### Method
`GET`

### Endpoint
`http://localhost:3000/initialize-db`

### Response
- **200 OK**: Database initialized successfully.
- **500 Internal Server Error**: Initialization error.

---

## Fetch Products by Month

### Description
Fetches products for a specified month.

### Method
`GET`

### Endpoints
- `http://localhost:3000/products/March`
- `http://localhost:3000/products/April`

### Response
- **200 OK**: List of products.
- **404 Not Found**: No products found.
- **500 Internal Server Error**: Fetching error.

---

### Notes
- Ensure the server is running on `localhost:3000`.
- Initialize the database before fetching products.
