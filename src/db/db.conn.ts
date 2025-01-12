import { Sequelize } from "sequelize";
import { DB_CONFIG } from "../config";  // Import the configuration

class DataBase {
  public conn: Sequelize;
  
  constructor() {
    
    this.conn = new Sequelize(DB_CONFIG.database, DB_CONFIG.user, DB_CONFIG.password, {
      dialect: "mysql",
      host: DB_CONFIG.host,  // Use the host from DB_CONFIG
      port: DB_CONFIG.port,  // Use the port from DB_CONFIG
      replication: {
        read: [{ host: DB_CONFIG.host, username: DB_CONFIG.user, password: DB_CONFIG.password }],
        write: { host: DB_CONFIG.host, username: DB_CONFIG.user, password: DB_CONFIG.password },
      },
      logging: false,
      define: {
        freezeTableName: true,
        underscored: true,
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
      pool: {
        max: 20,
        min: 0,
        idle: 20000,
        acquire: 60000,
      },
    });

    // Test the database connection
    this.conn
      .authenticate()
      .then(() => {
        console.debug(
          `${DB_CONFIG.database} DB Connection has been established successfully.`
        );
      })
      .catch((error: any) => {
        console.error(
          `${DB_CONFIG.database} DB Unable to connect to the database:`,
          error
        );
      });
  }
}

// Create a singleton instance of the database
const db = new DataBase();
export const DATABASE = db.conn;