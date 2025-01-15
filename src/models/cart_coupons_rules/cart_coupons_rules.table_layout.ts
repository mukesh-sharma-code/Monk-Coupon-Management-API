// cart_coupons.table_layout.ts
export interface CartCouponsRulesLayout {
   id?: number;
   coupon_id: number;
   threshold: number;
   is_fixed: boolean;
   discount_value: number;
   max_discount?: number;
 }