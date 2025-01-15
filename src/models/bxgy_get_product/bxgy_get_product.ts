// import { DataTypes, Model } from "sequelize";
// import { DB_Tables } from "../../constant";
// import { BxgyGetProductLayout as layout } from "./bxgy_get_product.table_layout";
// import { DATABASE } from "../../db/db.conn";
// import { CartCouponModel } from "../cart_coupons_rules/cart_coupons_rules";

// interface BxgyGetProductInstance extends Model<layout>, layout { }

// const table_name = DB_Tables.bxgy_get_products;

// const table_data = {
//   id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   coupon_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   product_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   free_quantity: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   }
// };

// const tbl_BxgyGetProduct = DATABASE.define<BxgyGetProductInstance>(table_name, table_data);

// // associations

// export const BxgyGetProductModel = tbl_BxgyGetProduct;
