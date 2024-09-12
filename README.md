# Bookstore Backend

## Overview

The Bookstore Backend is an API designed to manage books, users, carts, orders, and wishlists. This project is built using Express.js and includes authentication, CRUD operations, and more.

## Authentication

To access protected routes, you need to authenticate and get a JWT token. Follow these steps:

1. **Login**: Obtain a JWT token by logging in.

   - **Endpoint**: `/users/login`
   - **Method**: `POST`
   - **Body**:
     ```json
     {
       "email": "user@example.com",
       "password": "yourpassword"
     }
     ```

   - **Response**: A JWT token will be provided upon successful login.

2. **Use the Token**: Include the JWT token in the `Authorization` header for protected routes.

## API Endpoints

### Books

- **Add a Book**
  - **Endpoint**: `/books/addBook`
  - **Method**: `POST`
  - **Headers**:
    - `Authorization: Bearer <your_token>`
  - **Body**:
    ```json
    {
      "title": "Book Title",
      "author": "Author Name",
      "isbn": "1234567890",
      "price": 19.99
    }
    ```
  - **Response**: Success message and created book data.

- **Get All Books**
  - **Endpoint**: `/books/getAll`
  - **Method**: `GET`
  - **Headers**:
    - `Authorization: Bearer <your_token>`
  - **Response**: List of all books.

- **Get a Book by ID**
  - **Endpoint**: `/books/:id`
  - **Method**: `GET`
  - **Headers**:
    - `Authorization: Bearer <your_token>`
  - **Response**: Details of the specified book.

- **Update a Book**
  - **Endpoint**: `/books/:id/update`
  - **Method**: `PUT`
  - **Headers**:
    - `Authorization: Bearer <your_token>`
  - **Body**:
    ```json
    {
      "title": "Updated Title",
      "author": "Updated Author",
      "isbn": "1234567890",
      "price": 25.99
    }
    ```
  - **Response**: Success message and updated book data.

- **Delete a Book**
  - **Endpoint**: `/books/:id/delete`
  - **Method**: `DELETE`
  - **Headers**:
    - `Authorization: Bearer <your_token>`
  - **Response**: Success message indicating the book was deleted.

### Cart

- **Add to Cart**
  - **Endpoint**: `/cart/add`
  - **Method**: `POST`
  - **Headers**:
    - `Authorization: Bearer <your_token>`
  - **Body**:
    ```json
    {
      "bookId": 1,
      "quantity": 2
    }
    ```
  - **Response**: Success message and updated cart.

- **Remove from Cart**
  - **Endpoint**: `/cart/remove`
  - **Method**: `POST`
  - **Headers**:
    - `Authorization: Bearer <your_token>`
  - **Body**:
    ```json
    {
      "bookId": 1
    }
    ```
  - **Response**: Success message and updated cart.

- **View Cart**
  - **Endpoint**: `/cart/viewCart`
  - **Method**: `GET`
  - **Headers**:
    - `Authorization: Bearer <your_token>`
  - **Response**: List of items in the cart.

### Orders

- **Place an Order**
  - **Endpoint**: `/orders/order`
  - **Method**: `POST`
  - **Headers**:
    - `Authorization: Bearer <your_token>`
  - **Body**:
    ```json
    {
      "cartId": 1,
      "address": "123 Street, City, Country"
    }
    ```
  - **Response**: Success message and order details.

- **View Orders**
  - **Endpoint**: `/orders/orders`
  - **Method**: `GET`
  - **Headers**:
    - `Authorization: Bearer <your_token>`
  - **Response**: List of user orders.

### Wishlist

- **Add to Wishlist**
  - **Endpoint**: `/wishlist/add`
  - **Method**: `POST`
  - **Headers**:
    - `Authorization: Bearer <your_token>`
  - **Body**:
    ```json
    {
      "bookId": 1
    }
    ```
  - **Response**: Success message and updated wishlist.

- **Remove from Wishlist**
  - **Endpoint**: `/wishlist/remove`
  - **Method**: `POST`
  - **Headers**:
    - `Authorization: Bearer <your_token>`
  - **Body**:
    ```json
    {
      "bookId": 1
    }
    ```
  - **Response**: Success message and updated wishlist.

- **View Wishlist**
  - **Endpoint**: `/wishlist/view`
  - **Method**: `GET`
  - **Headers**:
    - `Authorization: Bearer <your_token>`
  - **Response**: List of wishlist items.

## Summary

- **Login** to get a token.
- Use the token in the `Authorization` header to access protected routes.
- Perform CRUD operations using the provided endpoints.

If you need any further clarification or have specific questions about using these endpoints, feel free to ask!
