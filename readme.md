# ‭Implemented Cases:

### Cart-wise Coupons
- **Description:** Discounts applied based on the total cart value when a minimum threshold is met.**The discount can be fixed or in percentage. The coupon will have an expiration date.**
- **Example:** 10% off on cart totals exceeding ₹1000.
- **Example:** 100Rs off on cart totals exceeding ₹1000.

### Product-wise Coupons
- **Description:** Discounts applied to specific products in the cart, useful for product-specific promotions.**The discount can be fixed or in percentage. The coupon will have an expiration date.**
- **Example:** 15% off on Product X.
- **Example:** 15Rs off on Product X.

### BxGy Coupons
- **Description:** "Buy X, Get Y" deals, supporting limits on the number of free or discounted items.**The coupon will have an expiration date.**
- **Example:** Buy 2 items from Category A, get 1 item from Category B free.

# Un‭implemented Cases:
Coupon management is a vast and fascinating feature, and there can be numerous types of coupons with various scenarios. I have thought of many cases, but due to time constraints, I was unable to implement all of them. 
#### Other Potential Coupon Types
### Free Shipping:  
   - Free shipping for carts exceeding a specified value.  
   - Example: Free shipping for carts over ₹1,000.
### Bundle Discount:  
   - Discount for purchasing specific products together.  
   - Example: Buy Product A and Product B together to get ₹200 off.
### Category-Wise Discount:  
   - Apply a discount on all products within a specific category.  
   - Example: 15% off on all electronics.
### Seasonal/Occasional Discounts:  
   - Special discounts on products for festivals or events.  
   - Example: 20% off on winter wear during Christmas.
### First-Time Purchase Coupon:  
   - Special discounts for first-time buyers.  
   - Example: ₹200 off on first purchase above ₹500.
### Loyalty Coupons:  
   - Coupons based on customer loyalty points or past purchases.  
   - Example: ₹50 off for every 500 loyalty points redeemed.
### Referral Discounts:  
   - Discounts for customers who refer others.  
   - Example: ₹100 off for both referrer and referee.
### User-Specific Coupons:  
   - Tailor coupons for specific user segments.  
   - Example: Special 10% discount for users who haven’t purchased in the last 3 months.

# Suggestions:
   

# Limitations:
No Integration with User, Cart, or Product Tables: The project does not include integration with user, cart, or product tables. The focus is solely on the coupon management system.

# Assumptions:
### Cart and Product Data: 
   - The system assumes that cart and product data (e.g., product IDs, prices, and quantities) are provided as input when applying coupons. No actual cart or product tables are integrated.

### User Context: 
   - The system does not consider user-specific details (e.g., user roles, purchase history) for coupon applicability. All coupons are assumed to be universally applicable unless explicitly restricted by the coupon's conditions.
### Coupon Types:
   - The system supports cart-wise, product-wise, and BxGy coupons. It assumes that no other coupon types are required unless explicitly added in the future.
### Error Handling: 
   - The system assumes that all inputs (e.g., cart data, coupon details) are valid and well-formed. Basic error handling is implemented, but advanced validation (e.g., malformed data) is not covered.

# API Endpoints

The following endpoints are implemented to support coupon management and application:

**POST /coupons** : Create a new coupon with details such as type, discount value, applicable products, and restrictions.

**GET /coupons** : Retrieve all available coupons.

**GET /coupons/:id** : Retrieve a specific coupon by its ID.

**PUT /coupons/:id** : Update coupon details for a given ID.;

**DELETE /coupons/id:** : Delete a coupon by ID.

**POST /applicable-coupons** : Retrieve and calculate all applicable coupons for a given cart.

**POST /apply-coupon/id** : Apply a specific coupon to a cart and return the updated cart with discounted prices.

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
