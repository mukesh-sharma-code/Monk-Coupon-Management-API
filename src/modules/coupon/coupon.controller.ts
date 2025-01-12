import { Request, Response } from 'express';
import CouponService from './coupon.service';
import { responseHelper } from '../../utils/response.helper';
import { StatusCodes } from '../../utils/statusCodes';
import { CouponMessages, ResponseMessages } from '../../utils/enums/reponseMessages';

class CouponController {

  constructor() {

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
      return responseHelper.success(res, {
        statusCode: StatusCodes.CREATED,
        data: coupon,
        message: ResponseMessages.SUCCESS,
      });
    } catch (error) {
      return responseHelper.error(res, {
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
      return responseHelper.success(res, {
        statusCode: StatusCodes.OK,
        data: coupons,
        message: ResponseMessages.SUCCESS,
      });
    } catch (error) {
      return responseHelper.error(res, {
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
      return responseHelper.success(res, {
        statusCode: StatusCodes.OK,
        data: applicableCoupons,
        message: ResponseMessages.SUCCESS,
      });
    } catch (error) {
      return responseHelper.error(res, {
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
      const { cart } = req.body;
      const couponId = parseInt(req.params.id)
      const updatedCart = await CouponService.applyCoupon(couponId, cart);
      return responseHelper.success(res, {
        statusCode: StatusCodes.OK,
        data: updatedCart,
        message: ResponseMessages.SUCCESS,
      });
    } catch (error) {
      return responseHelper.error(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ResponseMessages.ERROR,
        error,
      });
    }
  }

  /**
   * Delete coupon
   */
  async deleteCoupon(req: Request, res: Response) {
    try {
      const couponId = parseInt(req.params.id)
      await CouponService.deleteCoupon(couponId);
      return responseHelper.success(res, {
        statusCode: StatusCodes.OK,
        message: CouponMessages.DELETED,
      });
    } catch (error) {
      return responseHelper.error(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ResponseMessages.ERROR,
        error,
      });
    }
  }

  /**
   * Get coupon
   */
  async getCoupon(req: Request, res: Response) {
    try {
      const couponId = parseInt(req.params.id)
      let coupon = await CouponService.getCoupon(couponId);
      return responseHelper.success(res, {
        statusCode: StatusCodes.OK,
        message: ResponseMessages.SUCCESS,
        data: coupon || {}
      });
    } catch (error) {
      return responseHelper.error(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: ResponseMessages.ERROR,
        error,
      });
    }
  }

  /**
   * Update coupon
   */

  async updateCoupon(req: Request, res: Response) {
    try {
      const couponId = Number(req.params.id);
      if (isNaN(couponId)) {
        return responseHelper.error(res, {
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'Invalid coupon ID',
        });
      }

      const updatedData = req.body;
      await CouponService.updateCoupon(couponId, updatedData);

      return responseHelper.success(res, {
        statusCode: StatusCodes.OK,
        message: 'Coupon updated successfully',
      });
    } catch (error) {
      return responseHelper.error(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Failed to update coupon',
        error,
      });
    }
  }
}

export default new CouponController();