# Ecommerce-redis-demo

This is a simple service for managing cart operations in an e-commerce application.
It uses Redis for managing inventory and cart data efficiently, ensuring high performance and concurrency control.

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [API](#api)

## Installation

### Prerequisites

-   Node.js
-   Redis

### Setup

1. Clone the repository:

    ```sh
    git clone https://github.com/su-lt/ecommerce-redis-demo
    cd ecommerce-redis-demo
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Ensure Redis is running on your local machine or configure the connection settings in `dbs/redis.db.js`.

## Usage

### Starting the Service

-   To use the `Ecommerce-redis-demo`, make sure your Redis server is running and then start your Node.js application.
-   Start the server with command "npm start"
-   Url API: http://localhost:3333/

## API

### POST method - http://localhost:3333/cart/:userId/add

-   Adds a specified quantity of a product to the user's cart if there is enough stock available.
    use lua script for atomic operations update quantity of stock

-   Parameters
    userId (string): The ID of the user.
    productId (string): body request - The ID of the product
    quantity (number): body request - The quantity of the product to add to the cart.

-   Returns

    ```sh
        message: "OK"
        message: "Out of stock"
        message: "Not OK"
    ```

    -   "OK" - if the product was successfully added to the cart.
    -   "Out of stock" - if there is not enough stock available.
    -   "Not OK" - if there was an error during the operation.

### GET method - http://localhost:3333/product/:productId

-   Get product information database with redis cache. Improved loading performance x10

-   Parameters
    productId (string): The ID of the product

-   Returns
    ```sh
    message:
        _status: "direct"/"cache",
        _stock: number,
    ```
    -   \_status: type of data - "direct"/"cache": "direct" if product not found cache and "cache"
    -   \_stock: quantity of product stock
