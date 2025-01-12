import { Op } from "sequelize";
import { DATABASE } from "../../db/db.conn";
import { CouponModel } from "../../models/coupon/coupon.model";
import { CouponType } from "../../utils/constants/coupon";
import { CartCouponsRulesModel } from "../../models/cart_coupons_rules/cart_coupons_rules";
import { BxgyCouponsRulesModel } from "../../models/bxgy_coupons_rules/bxgy_coupons_rules";
import { ProductCouponsRulesModel } from "../../models/product_coupons_rules/product_coupons_rules";
import { CartStruct, CouponStruct } from "./coupon.interfaces";
import CouponHelper from "./coupon.helper";

class CouponService {

   constructor() {

   }

   /**
    * 
    * Create Coupon
    */
   async createCoupon(data: CouponStruct) {
      const transaction = await DATABASE.transaction();
      try {
         // Create base coupon
         const coupon = await CouponModel.create(
            {
               type: data.type,
               name: data.name,
               description: data.description,
               valid_from: data.valid_from,
               valid_to: data.valid_to,
               repetition_limit: data.repetition_limit,
               is_active: data.is_active
            },
            { transaction }
         );

         // Handle different coupon types
         await CouponHelper.handleCouponTypeSpecifics(coupon.id as number, data, transaction);

         await transaction.commit();
         return coupon;

      } catch (error) {
         await transaction.rollback();
         throw error;
      }
   }

   /**
    * 
    * Get all coupons
    */
   async getAllCoupons() {
      try {
         const coupons = await CouponModel.findAll({
            include: [
               {
                  model: CartCouponsRulesModel,
                  required: false, // Make the inclusion optional
                  // where: { type: CouponType.CART }, // Only include if coupon type is CART_WISE
               },
               {
                  model: ProductCouponsRulesModel,
                  required: false, // Make the inclusion optional
                  // where: { type: CouponType.PRODUCT }, // Only include if coupon type is PRODUCT_WISE
               },
               {
                  model: BxgyCouponsRulesModel,
                  required: false, // Make the inclusion optional
                  // where: { type: 'BXGY' }, // Only include if coupon type is BXGY
               }
            ],
         });
         return coupons;
      } catch (error) {
         throw error;
      }
   }

   /**
    * 
    * Get applicable coupons
    */
   async getApplicableCoupons(cart: CartStruct) {
      try {
         const cartCoupons = await CouponHelper.getApplicableCartCoupons(cart);
         const productCoupons = await CouponHelper.getApplicableProductCoupons(cart);
         const bxgyCoupons = await CouponHelper.getApplicableBxgyCoupons(cart);
         console.log([...cartCoupons, ...productCoupons, ...bxgyCoupons])
         return [...cartCoupons, ...productCoupons, ...bxgyCoupons]
      } catch (error) {
         throw error;
      }
   }

   /**
    * Apply coupons
    */
   async applyCoupon(couponId, cart) {
      try {
         const currentDate = new Date();

         // Fetch the coupon and its associated rules
         const coupon = await CouponModel.findOne({
            where: {
               id: couponId,
               is_active: true,
               valid_from: { [Op.lte]: currentDate },
               valid_to: { [Op.gte]: currentDate }
            },
            include: [
               { model: CartCouponsRulesModel, required: false },
               { model: ProductCouponsRulesModel, required: false },
               { model: BxgyCouponsRulesModel, required: false }
            ]
         });

         if (!coupon) {
            throw new Error('Coupon not found or invalid');
         }

         let totalDiscount = 0;
         const updatedCart = { ...cart, items: [...cart.items] };

         // Calculate total price of the cart
         const totalPrice = updatedCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

         // Apply coupon based on its type
         switch (coupon.type) {
            case CouponType.CART:
               totalDiscount = CouponHelper.applyCartCoupon(coupon, updatedCart);
               break;

            case CouponType.PRODUCT:
               totalDiscount = CouponHelper.applyProductCoupon(coupon, updatedCart);
               break;

            case CouponType.BXGY:
               totalDiscount = CouponHelper.applyBxgyCoupon(coupon, updatedCart);
               break;

            default:
               throw new Error('Unsupported coupon type');
         }

         // Ensure total discount does not exceed total price
         totalDiscount = Math.min(totalDiscount, totalPrice);

         // Calculate final price
         const finalPrice = totalPrice - totalDiscount;

         // Prepare response
         const response = {
            updated_cart: {
               items: updatedCart.items.map(item => ({
                  product_id: item.product_id,
                  quantity: item.quantity,
                  price: item.price,
                  total_discount: item.total_discount || 0
               })),
               total_price: totalPrice,
               total_discount: totalDiscount,
               final_price: finalPrice
            }
         };

         return response;
      } catch (error) {
         console.error('Error applying coupon:', error);
         throw error;
      }
   }

   /**
    * Delete coupons
    */
   async deleteCoupon(couponId: number) {
      try {
         return await CouponModel.destroy({
            where: {
               id: couponId
            }
         });
      } catch (error) {
         console.error('Error deleting coupon:', error);
         throw error;
      }
   }

   /**
    * Get coupon
    */
   async getCoupon(couponId: number) {
      try {
         return await CouponModel.findOne({
            where:{
               id: couponId
            },
            include: [
               {
                  model: CartCouponsRulesModel,
                  required: false, // Make the inclusion optional
                  // where: { type: CouponType.CART }, // Only include if coupon type is CART_WISE
               },
               {
                  model: ProductCouponsRulesModel,
                  required: false, // Make the inclusion optional
                  // where: { type: CouponType.PRODUCT }, // Only include if coupon type is PRODUCT_WISE
               },
               {
                  model: BxgyCouponsRulesModel,
                  required: false, // Make the inclusion optional
                  // where: { type: 'BXGY' }, // Only include if coupon type is BXGY
               }
            ],
         });
      } catch (error) {
         console.error('Error in getCoupon:', error);
         throw error;
      }
   }

   /**
    * Update coupon
    */
   async updateCoupon(couponId: number, data: CouponStruct) {
      const transaction = await DATABASE.transaction();
      try {

         // First find the respective coupon
         const coupon = await CouponModel.findOne({
            where: {
               id: couponId,
               type: data.type
            }
         });
         
         if (!coupon) {
            throw new Error('Coupon not found');
         }

         // Update base coupon
         const [rowsUpdated] = await CouponModel.update(
            {
               type: data.type,
               name: data.name,
               description: data.description,
               valid_from: data.valid_from,
               valid_to: data.valid_to,
               repetition_limit: data.repetition_limit,
               is_active: data.is_active,
            },
            {
               where: { id: couponId },
               transaction,
            }
         );
   
         if (rowsUpdated === 0) {
            throw new Error('Coupon not found');
         }
   
         // Update type-specific rules
         await CouponHelper.updateCouponTypeSpecifics(couponId, data, transaction);
   
         await transaction.commit();
         return true; // Indicates successful update
      } catch (error) {
         await transaction.rollback();
         console.error('Error updating coupon:', error);
         throw error;
      }
   }
}
export default new CouponService();
