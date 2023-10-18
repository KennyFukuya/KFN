import { Knex } from "knex";

const config: Knex.Config = {
  client: "mysql2",
  connection: {
    host: process.env.DATABASE_HOST || "localhost",
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD as string,
    database: process.env.DATABASE_DB,
    port: parseInt(process.env.DATABASE_PORT as string),
  },
  migrations: {
    directory: "./db/migrations",
  },
};

export default config;
