// db.js
import knex from 'knex';

const isRender = process.env.DATABASE_URL?.includes('render.com');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: isRender
      ? { rejectUnauthorized: false } // required for Render Postgres
      : false // local dev
  }
});

export default db;
