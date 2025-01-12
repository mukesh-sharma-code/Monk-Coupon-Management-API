import { DataTypes, Model } from "sequelize";
import { DB_Tables } from "../../utils/constants";
import { ProductLayout as layout } from "./product.table_layout";
import { DATABASE } from "../../db/db.conn";

interface ProductInstance extends Model<layout>, layout { }

const table_name = DB_Tables.products;

const table_data = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  }
};

const tbl_Product = DATABASE.define<ProductInstance>(table_name, table_data);
// tbl_Product.sync({ alter: true });

export const ProductModel = tbl_Product;