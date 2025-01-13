import * as express from 'express';
import CouponController from './coupon.controller';
import { ValidationMiddleware } from "../../middlewares/request_validation";
import { CartDto, CreateCouponDto } from './coupon.validator';

class CouponRoutes {
    public path = '';
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(
            `${this.path}/coupon`,
            ValidationMiddleware(CreateCouponDto),
            CouponController.createCoupon
        );

        this.router.get(
            `${this.path}/coupons`,
            CouponController.getAllCoupons
        );

        this.router.post(
            `${this.path}/applicable-coupons`,
            ValidationMiddleware(CartDto),
            CouponController.getApplicableCoupons
        );

        this.router.post(
            `${this.path}/apply-coupon/:id`,
            ValidationMiddleware(CartDto),
            CouponController.applyCoupon
        );

        this.router.delete(
            `${this.path}/coupon/:id`,
            CouponController.deleteCoupon
        );

        this.router.get(
            `${this.path}/coupon/:id`,
            CouponController.getCoupon
        );

        this.router.put(
            `${this.path}/coupon/:id`,
            ValidationMiddleware(CreateCouponDto),
            CouponController.updateCoupon
        );
    }
}

export default CouponRoutes;
