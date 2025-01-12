import * as express from 'express';
import CouponController from './coupon.controller';
import { ValidationMiddleware } from "../../middlewares/request_validation";
import { CreateCouponDto } from './coupon.validator';

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
            CouponController.getApplicableCoupons
        );

        this.router.post(
            `${this.path}/apply-coupon/:id`,
            CouponController.applyCoupon
        );
    }
}

export let couponRoutes = new CouponRoutes();
