// Database configuration
export const DB_CONFIG = {
    host: process.env.DB_HOST || "localhost",         
    user: process.env.DB_USER || "root",        
    password: process.env.DB_PASSWORD || "",  
    database: process.env.DB_NAME || "", 
    port: parseInt(process.env.DB_PORT || '3306') 
};

// Validate that all required environment variables are set
if (!DB_CONFIG.host || !DB_CONFIG.user || !DB_CONFIG.password || !DB_CONFIG.database) {
    throw new Error("Missing required database configuration in .env file.");
}