export interface ProductCouponLayout {
  id?: number;
  coupon_id: number;
  product_id: number;
  is_fixed: boolean;
  discount_value: number;
  max_discount?: number;
}