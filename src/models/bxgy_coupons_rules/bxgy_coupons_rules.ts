import { DATABASE } from "../../db/db.conn";
import { DataTypes, Model } from "sequelize";
import { DB_Tables } from "../../utils/constants";
import { BxgyCouponsRulesLayout as layout } from "./bxgy_coupons_rules.table_layout";
import { BxgyType } from "../../utils/constants/coupon";

interface BxgyCouponsRulesInstance extends Model<layout>, layout { }

const table_name = DB_Tables.bxgy_coupons_rules;

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
  type: {
    type: DataTypes.ENUM(...Object.values(BxgyType)),
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
};

const tbl_BxgyCouponsRules = DATABASE.define<BxgyCouponsRulesInstance>(table_name, table_data);
// tbl_BxgyCouponsRules.sync({ alter: true });

export const BxgyCouponsRulesModel = tbl_BxgyCouponsRules;
