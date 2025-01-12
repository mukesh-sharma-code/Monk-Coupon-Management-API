import { Request, Response } from 'express';
import CouponService from './coupon.service';
import { responseHelper } from '../../utils/response.helper';
import { StatusCodes } from '../../utils/statusCodes';
import { ResponseMessages } from '../../utils/enums/reponseMessages';

class CouponController {

  constructor(){

  }

  /**
   * 
   * @param req 
   * @param res 
   * 
   * Create coupon
   */
  async createCoupon(req: Request, res: Response) {
    try {
      const coupon = await CouponService.createCoupon(req.body);
      responseHelper.success(res, {
        statusCode: StatusCodes.CREATED,
        data: coupon,
        message: ResponseMessages.SUCCESS,
      });
    } catch (error) {
      responseHelper.error(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ResponseMessages.ERROR,
        error,
      });
    }
  }

  /**
   * 
   * @param req 
   * @param res 
   * 
   * Get all coupons
   */
  async getAllCoupons(req: Request, res: Response) {
    try {
      const coupons = await CouponService.getAllCoupons();
      responseHelper.success(res, {
        statusCode: StatusCodes.OK,
        data: coupons,
        message: ResponseMessages.SUCCESS,
      });
    } catch (error) {
      responseHelper.error(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ResponseMessages.ERROR,
        error,
      });
    }
  }

  /**
   * 
   * @param req 
   * @param res 
   * 
   * Get all applicable coupons
   */
  async getApplicableCoupons(req: Request, res: Response) {
    try {
      const { cart } = req.body;
      const applicableCoupons = await CouponService.getApplicableCoupons(cart);
      responseHelper.success(res, {
        statusCode: StatusCodes.OK,
        data: applicableCoupons,
        message: ResponseMessages.SUCCESS,
      });
    } catch (error) {
      responseHelper.error(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ResponseMessages.ERROR,
        error,
      });
    }
  }

  /**
   * 
   * @param req 
   * @param res 
   * 
   * Apply coupon
   */
  async applyCoupon(req: Request, res: Response) {
    try {
      const { userId, cart } = req.body;
      const couponId = parseInt(req.params.id)
      const updatedCart = await CouponService.applyCoupon(couponId, cart);
      responseHelper.success(res, {
        statusCode: StatusCodes.OK,
        data: updatedCart,
        message: ResponseMessages.SUCCESS,
      });
    } catch (error) {
      responseHelper.error(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ResponseMessages.ERROR,
        error,
      });
    }
  }
}

export default new CouponController();