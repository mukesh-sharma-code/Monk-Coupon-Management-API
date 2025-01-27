import { afterAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Request, Response } from 'express';
import { CreateCouponDto } from '../../modules/coupon/coupon.validator';
import couponService from '../../modules/coupon/coupon.service';
import couponController from '../../modules/coupon/coupon.controller';
import { responseHelper } from '../../utils/response.helper';
import { StatusCodes } from '../../utils/statusCodes';
import { DATABASE } from '../../db/db.conn';


jest.mock('../../modules/coupon/coupon.service');
jest.mock('../../utils/response.helper');

describe('CouponController.createCoupon', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  afterAll(async () => {
    await DATABASE.close(); // Close DB connection after tests
  });

  beforeEach(() => {
    req = {
      body: {
        type: 'CART',
        name: 'Holiday Discount',
        description: '10% off on cart',
        valid_from: '2025-01-01',
        valid_to: '2025-01-15',
        is_active: true,
        cart_discount_rules: {
          threshold: 100,
          is_fixed: false,
          discount_value: 10,
          max_discount: 50,
        },
      } as CreateCouponDto,
    };
    res = {
        status: jest.fn().mockReturnThis() as unknown as (code: number) => Response,
        json: jest.fn() as unknown as (body: any) => Response,
    };
  });

  it('should create a coupon successfully', async () => {
    const mockCoupon = { id: 1, ...req.body };
    jest.spyOn(couponService, 'createCoupon').mockResolvedValue(mockCoupon);

    await couponController.createCoupon(req as Request, res as Response);

    expect(couponService.createCoupon).toHaveBeenCalledWith(req.body);
    expect(responseHelper.success).toHaveBeenCalledWith(res, {
      statusCode: StatusCodes.CREATED,
      data: mockCoupon,
      message: 'SUCCESS',
    });
  });

  it('should handle errors while creating a coupon', async () => {
    const mockError = new Error('Database Error');
    jest.spyOn(couponService, 'createCoupon').mockRejectedValue(mockError);

    await couponController.createCoupon(req as Request, res as Response);

    expect(couponService.createCoupon).toHaveBeenCalledWith(req.body);
    expect(responseHelper.error).toHaveBeenCalledWith(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'ERROR',
      error: mockError,
    });
  });
});
