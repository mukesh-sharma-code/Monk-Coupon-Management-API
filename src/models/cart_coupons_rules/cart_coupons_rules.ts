import { DataTypes, Model } from "sequelize";
import { CartCouponsRulesLayout as layout } from "./cart_coupons_rules.table_layout";
import { DB_Tables } from "../../utils/constants";
import { DATABASE } from "../../db/db.conn";

interface CartCouponsRulesInstance extends Model<layout>, layout { }

const table_name = DB_Tables.cart_coupons;

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
  threshold: {
    type: DataTypes.DECIMAL(10, 2),
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



const tbl_CartCouponsRules = DATABASE.define<CartCouponsRulesInstance>(table_name, table_data);
// tbl_CartCouponsRules.sync({ alter: true });

export const CartCouponsRulesModel = tbl_CartCouponsRules;