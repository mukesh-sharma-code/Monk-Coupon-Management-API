import { CouponType } from "../../utils/constants/coupon";

type DiscountType = 'cart_wise' | 'product_wise' | 'bxgy';

interface CartDiscountRules {
  threshold: number;
  is_fixed: boolean;
  discount_value: number;
  max_discount?: number;
}

interface ProductDiscountRules {
  product_id: number;
  is_fixed: boolean;
  discount_value: number;
  max_discount?: number;
}

interface BxgyBuyProduct {
  product_id: number;
  quantity: number;
}

interface BxgyGetProduct {
  product_id: number;
  quantity: number;
}

interface BxgyDiscountRules {
  buy_products: BxgyBuyProduct[];
  get_products: BxgyGetProduct[];
}
interface CartItem {
  product_id: number;
  quantity: number;
  price: number;
}

interface ApplicableCoupon {
  coupon_id: number;
  type: string;
  discount: number;
  // Optional: Add a description field if needed
  description?: string;
}


export interface ApplicableCouponsResponse {
  applicable_coupons: ApplicableCoupon[];
}

// Cart structure
export interface CartStruct {
  items: CartItem[];
}

// Coupon structure
export interface CouponStruct {
  name: string;
  type: typeof CouponType[keyof typeof CouponType];
  description?: string;
  valid_from?: string; // ISO 8601 date string
  valid_to?: string; // ISO 8601 date string
  is_active: boolean;
  repetition_limit?: number;
  cart_discount_rules?: CartDiscountRules;
  product_discount_rules?: ProductDiscountRules;
  bxgy_discount_rules?: BxgyDiscountRules;
}
