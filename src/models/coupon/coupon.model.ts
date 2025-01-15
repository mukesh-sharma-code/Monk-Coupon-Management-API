

import { CouponLayout as layout } from "./coupon.table_layout";
import { DATABASE } from "../../db/db.conn";
import { DataTypes, Model } from "sequelize";
import { DB_Tables } from "../../utils/constants";
import { CouponType } from "../../utils/constants/coupon";
import { CartCouponsRulesModel } from "../cart_coupons_rules/cart_coupons_rules";
import { ProductCouponsRulesModel } from "../product_coupons_rules/product_coupons_rules";
import { BxgyCouponsRulesModel } from "../bxgy_coupons_rules/bxgy_coupons_rules";

interface CouponInstance extends Model<layout>, layout { }

const table_name = DB_Tables.coupons;

const table_data = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.ENUM(...Object.values(CouponType)),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  valid_from: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  valid_to: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  repetition_limit: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  }
};

const tbl_Coupon = DATABASE.define<CouponInstance>(table_name, table_data);
// tbl_Coupon.sync({ alter: true });

// associations
tbl_Coupon.hasOne(CartCouponsRulesModel, { foreignKey: 'coupon_id' });
tbl_Coupon.hasOne(ProductCouponsRulesModel, { foreignKey: 'coupon_id' });
tbl_Coupon.hasMany(BxgyCouponsRulesModel, { foreignKey: 'coupon_id' });


export const CouponModel = tbl_Coupon;


