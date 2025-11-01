import { Pool } from "pg";

const { NODE_ENV } = process.env;
let connectionString;

if (NODE_ENV === "developement") {
  connectionString = process.env.DATABASE_URL_DEV;
} else if (NODE_ENV === "production") {
  connectionString = process.env.DATABASE_URL_PROD;
} else {
  throw new Error("No database for this environnement!");
}

export default new Pool({
  connectionString,
});
