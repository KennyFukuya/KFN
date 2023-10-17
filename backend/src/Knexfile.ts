import { Knex } from "knex";
import { readFileSync as _readFileSync } from "fs";

const readFileSync = (filename: string) =>
  _readFileSync(filename).toString("utf8");

const config: Knex.Config = {
  client: "mysql2",
  connection: {
    host: process.env.DATABASE_HOST || "localhost",
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD
      ? readFileSync(process.env.DATABASE_PASSWORD)
      : "",
    database: process.env.DATABASE_DB,
    port: process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT)
      : 3036,
  },
  migrations: {
    directory: "./db/migrations",
  },
};

export default config;
