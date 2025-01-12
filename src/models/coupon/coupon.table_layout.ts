export interface CouponLayout {
   id?: number,
   type: string,
   name: string,
   description?: string,
   valid_from?: string,
   valid_to?: string | null, // if it is null, the it would be consider that coupon has no expiration time
   repetition_limit?: number | null,  //if it is null, then this coupon can be used unlimited times
   is_active: boolean,
   created_at?: string,
   updated_at?: string,
}
