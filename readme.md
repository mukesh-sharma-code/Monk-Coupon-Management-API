# Implemented Features

## Core Coupon Types

### Cart-wise Coupons
- **Description:** Discounts applied based on the total cart value when a minimum threshold is met, the discount can be fixed or in percentage.
- **Example:** 10% off on cart totals exceeding ₹1000.
- **Example:** 100Rs off on cart totals exceeding ₹1000.

### Product-wise Coupons
- **Description:** Discounts applied to specific products in the cart, useful for product-specific promotions, the discount can be fixed or in percentage.
- **Example:** 15% off on Product X.
- **Example:** 15Rs off on Product X.

### BxGy Coupons
- **Description:** "Buy X, Get Y" deals, supporting limits on the number of free or discounted items.
- **Example:** Buy 2 items from Category A, get 1 item from Category B free.

# API Endpoints

The following endpoints are implemented to support coupon management and application:

POST /coupons: Create a new coupon with details such as type, discount value, applicable products, and restrictions.

GET /coupons: Retrieve all available coupons.

GET /coupons/(fd): Retrieve a specific coupon by its ID.

PUT /coupons/(fd): Update coupon details for a given ID.

DELETE /coupons/(fd): Delete a coupon by ID.

POST /applicable-coupons: Retrieve and calculate all applicable coupons for a given cart.

POST /apply-coupon/(fd): Apply a specific coupon to a cart and return the updated cart with discounted prices.

# Setup

Before running the application, you need to follow these steps.

## Environment Setup

1. Create a `.env` file in the root directory.
2. Add the following environment variables to the `.env` file:

   ```plaintext
   PORT=3100
   DB_NAME=coupons
   DB_USER=user
   DB_PASSWORD=password
   DB_HOST=localhost
   DB_PORT=3306
3. npm i
4. npm run dev
