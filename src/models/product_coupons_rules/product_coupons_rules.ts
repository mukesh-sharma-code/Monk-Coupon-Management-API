import { DataTypes, Model } from "sequelize";
import { ProductCouponLayout as layout } from "./product_coupons_rules.table_layout";
import { DB_Tables } from "../../utils/constants";
import { DATABASE } from "../../db/db.conn";

interface ProductCouponsRulesInstance extends Model<layout>, layout { }

const table_name = DB_Tables.product_coupons_rules;

const table_data = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  coupon_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  is_fixed: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0
  },
  discount_value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  max_discount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  }
};

const tbl_ProductCouponsRules = DATABASE.define<ProductCouponsRulesInstance>(table_name, table_data);
// tbl_ProductCouponsRules.sync({ alter: true });


export const ProductCouponsRulesModel = tbl_ProductCouponsRules;