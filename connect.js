import mysql from "mysql2";
import dotenv from "dotenv";
import pg from "pg";
const { Client, Pool } = pg;

dotenv.config();

// console.log(process.env.DATABASE_URL);
const DATABASE_URL =
  "postgresql://dtuSocial_owner:Hs6ryGw0PZkM@ep-nameless-star-a1sgmjmg.ap-southeast-1.aws.neon.tech/dtuSocial?sslmode=require";
const db = new Pool({
  // connectionString: process.env.DATABASE_URL,
  connectionString: DATABASE_URL,
});
await db.connect();
console.log("sql successfully");
export { db };
// export const db = mysql.createConnection({
//   host: process.env.MYSQL_ADDON_HOST,
//   port: process.env.MYSQL_ADDON_PORT,
//   user: process.env.MYSQL_ADDON_USER,
//   password: process.env.MYSQL_ADDON_PASSWORD,
//   database: process.env.MYSQL_ADDON_DB,
// });

// export const db = mysql.createPool(process.env.MYSQL_ADDON_URI);

// export const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "Shobhit@123",
//   database: "social",
// });
