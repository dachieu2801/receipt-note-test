import { Pool } from 'pg'
import env from '../env'

const pool = new Pool({
  user: env.USER_POST,
  host: env.HOST_POST,
  database: env.DATABASE_POST,
  password: env.PASSWORD_POST,
  port: Number(env.PORT_POST),
});

export default {
  connect: async () => {
    try {
      await pool.connect();
      console.log('Connected to PostgreSQL database');
    } catch (error) {
      console.error('Error connecting to PostgreSQL database', error);
    }
  },
  pool: () => pool,
};