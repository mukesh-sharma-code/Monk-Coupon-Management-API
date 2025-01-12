import { Op, Transaction } from "sequelize";
import { BxgyType, CouponType } from "../../utils/constants/coupon";
import { BxgyCouponsRulesModel } from "../../models/bxgy_coupons_rules/bxgy_coupons_rules";
import { CartCouponsRulesModel } from "../../models/cart_coupons_rules/cart_coupons_rules";
import { CouponModel } from "../../models/coupon/coupon.model";
import { ProductCouponsRulesModel } from "../../models/product_coupons_rules/product_coupons_rules";
import { CartStruct, CouponStruct } from "./coupon.interfaces";

class CouponHelper {

   constructor() {

   }

   /**
    * handle different type of coupons while coupon creation
    */
   async handleCouponTypeSpecifics(
      couponId: number,
      data: CouponStruct,
      transaction: Transaction
   ) {
      switch (data.type) {
         case CouponType.CART:
            if (data.cart_discount_rules) {
               await CartCouponsRulesModel.create(
                  {
                     coupon_id: couponId,
                     ...data.cart_discount_rules,
                  },
                  { transaction }
               );
            }
            break;

         case CouponType.PRODUCT:
            if (data.product_discount_rules) {
               await ProductCouponsRulesModel.create(
                  {
                     coupon_id: couponId,
                     ...data.product_discount_rules,
                  },
                  { transaction }
               );
            }
            break;

         case CouponType.BXGY:
            if (data.bxgy_discount_rules) {
               await Promise.all([
                  ...data.bxgy_discount_rules.buy_products.map((product) =>
                     BxgyCouponsRulesModel.create(
                        {
                           coupon_id: couponId,
                           type: BxgyType.BUY,
                           ...product,
                        },
                        { transaction }
                     )
                  ),
               ]);
               await Promise.all([
                  ...data.bxgy_discount_rules.get_products.map((product) =>
                     BxgyCouponsRulesModel.create(
                        {
                           coupon_id: couponId,
                           type: BxgyType.GET,
                           ...product,
                        },
                        { transaction }
                     )
                  ),
               ]);
            }
            break;
      }
   }

   /**
    * Get applicable bxgy coupons
    */
   async getApplicableBxgyCoupons(cart: CartStruct) {
      try {
         const currentDate = new Date();

         // Map of product_id to its details for easy access
         const productMap = new Map(
            cart.items.map(item => [
               item.product_id,
               { quantity: item.quantity, price: item.price }
            ])
         );

         // Fetch all active BXGY coupons with their rules
         const coupons = await CouponModel.findAll({
            where: {
               type: CouponType.BXGY,
               is_active: 1,
               valid_from: {
                  [Op.lte]: currentDate
               },
               valid_to: {
                  [Op.gte]: currentDate
               }
            },
            include: [{
               model: BxgyCouponsRulesModel,
               required: true,
               where: {
                  product_id: {
                     [Op.in]: [...productMap.keys()]
                  }
               }
            }],
            logging: false
         });

         const applicable_coupons = (await Promise.all(coupons.map(async (coupon: any) => {
            const buyRules = coupon.bxgy_coupons_rules.filter(rule => rule.type === 'buy');
            const getRules = coupon.bxgy_coupons_rules.filter(rule => rule.type === 'get');

            let totalDiscount = 0;

            // Check if all buy quantity requirements are fulfilled
            const areAllBuyRequirementsFulfilled = buyRules.every(buyRule => {
               const buyProduct = productMap.get(buyRule.product_id);
               return buyProduct && buyProduct.quantity >= buyRule.quantity;
            });

            if (areAllBuyRequirementsFulfilled) {
               // Calculate the maximum number of times the coupon can be applied
               const timesApplicable = Math.min(
                  ...buyRules.map(buyRule => {
                     const buyProduct = productMap.get(buyRule.product_id);
                     return Math.floor((buyProduct?.quantity ?? 0) / buyRule.quantity);
                  })
               );

               // Apply the repetition limit (if any)
               const repetitionLimit = coupon.repetition_limit || Infinity;
               const actualTimesApplicable = Math.min(timesApplicable, repetitionLimit);

               // Calculate the total free items and discount for each get rule
               getRules.forEach(getRule => {
                  const getProduct = productMap.get(getRule.product_id);

                  if (getProduct) {
                     const totalFreeItems = actualTimesApplicable * getRule.quantity;
                     const actualFreeItems = Math.min(totalFreeItems, getProduct.quantity);

                     // Calculate discount based on free items
                     totalDiscount += actualFreeItems * getProduct.price;
                  }
               });
            }

            // Return coupon details only if totalDiscount is greater than 0
            if (totalDiscount > 0) {
               return {
                  coupon_id: coupon.id,
                  coupon_name: coupon.name,
                  type: coupon.type,
                  discount: Number(totalDiscount.toFixed(2))
               };
            } else {
               return null; // Return null for coupons with no discount
            }
         }))).filter(coupon => coupon !== null); // Filter out null values
         return applicable_coupons;
      } catch (error) {
         console.error('Error fetching applicable BXGY coupons:', error);
         throw error;
      }
   }

   /**
    *  Get applicable cart coupons
    */
   async getApplicableCartCoupons(cart: CartStruct) {
      try {
         const cartTotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
         const currentDate = new Date();
         const coupons = await CouponModel.findAll({
            attributes: {
               exclude: ["created_at", "updated_at"]
            },
            where: {
               type: CouponType.CART,
               is_active: 1,
               valid_from: {
                  [Op.lte]: currentDate
               },
               valid_to: {
                  [Op.gte]: currentDate
               }
            },
            include: [{
               model: CartCouponsRulesModel,
               attributes: {
                  exclude: ["created_at", "updated_at"]
               },
               where: {
                  threshold: {
                     [Op.lte]: cartTotal
                  }
               },
               required: true
            }],
            logging: false
         });

         const applicable_coupons = coupons.map((coupon: any) => {
            console.log(coupon.name)
            const rule = coupon?.cart_coupons_rule;
            let discount = 0; 30

            if (rule) {
               // Calculate discount based on is_fixed flag
               if (rule.is_fixed) {
                  discount = Number(rule.discount_value);
               } else {
                  // Percentage discount
                  discount = (cartTotal * Number(rule.discount_value)) / 100;

                  // Apply max discount if exists
                  if (rule.max_discount && discount > rule.max_discount) {
                     discount = Number(rule.max_discount);
                  }
               }
            }

            return {
               coupon_id: coupon.id,
               coupon_name: coupon.name,
               type: coupon.type,
               discount: Number(discount.toFixed(2))
            };
         });

         return applicable_coupons;
      } catch (error) {
         console.error('Error fetching applicable cart coupons:', error);
         return [];
      }
   }

   /**
    *  Get applicable product coupons
    */
   async getApplicableProductCoupons(cart: CartStruct) {
      try {
         const currentDate = new Date();

         // Map of product_id to its details for easy access
         const productMap = new Map(
            cart.items.map(item => [
               item.product_id,
               { quantity: item.quantity, price: item.price }
            ])
         );

         const coupons = await CouponModel.findAll({
            where: {
               type: CouponType.PRODUCT,
               is_active: 1,
               valid_from: {
                  [Op.lte]: currentDate
               },
               valid_to: {
                  [Op.gte]: currentDate
               }
            },
            include: [{
               model: ProductCouponsRulesModel,
               where: {
                  product_id: {
                     [Op.in]: [...productMap.keys()]
                  }
               },
               required: true,
            }],
            logging: false,
            // raw: true
         });
         const applicable_coupons = coupons.map((coupon: any) => {
            const rule = coupon.product_coupons_rule;
            let discount = 0;

            if (rule) {
               const productDetails = productMap.get(rule.product_id);
               if (productDetails) {
                  const subtotal = productDetails.quantity * productDetails.price;
                  if (rule.is_fixed) {
                     discount = Number(rule.discount_value);
                  } else {
                     // Percentage discount
                     discount = (subtotal * Number(rule.discount_value)) / 100;
                     // Apply max discount if exists
                     if (rule.max_discount && discount > rule.max_discount) {
                        discount = Number(rule.max_discount);
                     }
                  }
               }
            }

            return {
               coupon_id: coupon.id,
               coupon_name: coupon.name,
               type: coupon.type,
               discount: Number(discount.toFixed(2))
            };
         });

         return applicable_coupons;
      } catch (error) {
         console.error('Error fetching applicable product coupons:', error);
         throw error;
      }
   }

   /**
    *  Apply cart coupon
    */
   applyCartCoupon(coupon, cart) {
      const cartRule = coupon.cart_coupons_rule;
      if (!cartRule) return 0;

      const totalCartValue = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      if (totalCartValue >= cartRule.threshold) {
         if (cartRule.is_fixed) {
            // For fixed discount, max_discount is not considered
            return cartRule.discount_value;
         } else {
            // For percentage discount, calculate discount and apply max_discount if provided
            const discount = (totalCartValue * cartRule.discount_value) / 100;
            return cartRule.max_discount ? Math.min(discount, cartRule.max_discount) : discount;
         }
      }

      return 0;
   }

   /**
    *  Apply product coupon
    */
   applyProductCoupon(coupon, cart) {
      const productRule = coupon.product_coupons_rule;
      if (!productRule) return 0;

      let totalDiscount = 0;

      cart.items.forEach(item => {
         if (item.product_id === productRule.product_id) {
            if (productRule.is_fixed) {
               // For fixed discount, max_discount is not considered
               item.total_discount = productRule.discount_value * item.quantity;
            } else {
               // For percentage discount, calculate discount and apply max_discount if provided
               item.total_discount = (item.price * item.quantity * productRule.discount_value) / 100;
               if (productRule.max_discount) {
                  item.total_discount = Math.min(item.total_discount, productRule.max_discount);
               }
            }
            totalDiscount += item.total_discount;
         }
      });

      return totalDiscount;
   }

   /**
    * Apply bxgy coupon
    */
   applyBxgyCoupon(coupon, cart) {
      const buyRules = coupon.bxgy_coupons_rules.filter(rule => rule.type === 'buy');
      const getRules = coupon.bxgy_coupons_rules.filter(rule => rule.type === 'get');

      let totalDiscount = 0;

      // Check if all buy quantity requirements are fulfilled
      const areAllBuyRequirementsFulfilled = buyRules.every(buyRule => {
         const buyProduct = cart.items.find(item => item.product_id === buyRule.product_id);
         return buyProduct && buyProduct.quantity >= buyRule.quantity;
      });

      if (areAllBuyRequirementsFulfilled) {
         // Calculate the maximum number of times the coupon can be applied
         const timesApplicable = Math.min(
            ...buyRules.map(buyRule => {
               const buyProduct = cart.items.find(item => item.product_id === buyRule.product_id);
               return Math.floor((buyProduct?.quantity ?? 0) / buyRule.quantity);
            })
         );

         // Apply the repetition limit (if any)
         const repetitionLimit = coupon.repetition_limit || Infinity;
         const actualTimesApplicable = Math.min(timesApplicable, repetitionLimit);

         // Calculate the total free items and discount for each get rule
         getRules.forEach(getRule => {
            const getProduct = cart.items.find(item => item.product_id === getRule.product_id);

            if (getProduct) {
               const totalFreeItems = actualTimesApplicable * getRule.quantity;
               const actualFreeItems = Math.min(totalFreeItems, getProduct.quantity);

               // Calculate discount based on free items
               getProduct.total_discount = actualFreeItems * getProduct.price;
               totalDiscount += getProduct.total_discount;

               // Update the quantity of the get product in the cart
               getProduct.quantity += actualFreeItems;
            }
         });
      }

      return totalDiscount;
   }

}
export default new CouponHelper();
