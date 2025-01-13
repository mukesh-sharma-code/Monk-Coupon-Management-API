import { IsString, IsIn, IsOptional, IsNumber, IsArray, IsDateString, IsInt, Min, Max, ValidateNested, IsBoolean, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { CouponType } from '../../utils/constants/coupon';

// Base classes for nested objects
class CartDiscountDto {
  @IsNumber()
  @IsPositive()
  threshold: number;

  @IsBoolean()
  is_fixed: boolean;

  @IsNumber()
  @IsPositive()
  discount_value: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  max_discount?: number;
}

class ProductDiscountRulesDto {
  @IsInt()
  @IsPositive()
  product_id: number;

  @IsBoolean()
  is_fixed: boolean;

  @IsNumber()
  @IsPositive()
  discount_value: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  max_discount?: number;
}

class BxgyBuyProductDto {
  @IsInt()
  @IsPositive()
  product_id: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}

class BxgyGetProductDto {
  @IsInt()
  @IsPositive()
  product_id: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}

class BxgyDiscountRulesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BxgyBuyProductDto)
  buy_products: BxgyBuyProductDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BxgyGetProductDto)
  get_products: BxgyGetProductDto[];
}

// Main DTOs for different endpoints
export class CreateCouponDto {
  @IsString()
  @IsIn([CouponType.CART, CouponType.PRODUCT, CouponType.BXGY])
  type: keyof typeof CouponType;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsDateString()
  valid_from?: string;

  @IsOptional()
  @IsDateString()
  valid_to?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  repetition_limit?: number;

  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => CartDiscountDto)
  cart_discount?: CartDiscountDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductDiscountRulesDto)
  product_discount_rules?: ProductDiscountRulesDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BxgyDiscountRulesDto)
  bxgy_discount_rules?: BxgyDiscountRulesDto;
}

export class UpdateCouponDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  valid_from?: string;

  @IsOptional()
  @IsDateString()
  valid_to?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  repetition_limit?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CartDiscountDto)
  cart_discount?: CartDiscountDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDiscountRulesDto)
  product_discounts_rules?: ProductDiscountRulesDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => BxgyDiscountRulesDto)
  bxgy_discount_rules?: BxgyDiscountRulesDto;
}

class CartItemDto {
  @IsInt()
  @IsPositive()
  product_id: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;
}
export class CartDto {
  @IsArray({ message: 'Items must be an array.' })
  @ValidateNested({ each: true }) // Ensures each item in the array is validated
  @Type(() => CartItemDto) // Ensures proper type conversion for nested objects
  items: CartItemDto[];
}
export class ApplicableCouponsDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  cart_total?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items?: CartItemDto[];
}

export class ApplyCouponDto {
  @IsNumber()
  @IsPositive()
  cart_total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}