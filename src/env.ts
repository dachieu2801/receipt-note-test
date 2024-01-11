import * as dotenv from 'dotenv';
dotenv.config();

export default {
  //Postgresql
  USER_POST: process.env.USER_POST,
  HOST_POST: process.env.HOST_POST,
  DATABASE_POST: process.env.DATABASE_POST,
  PASSWORD_POST: process.env.PASSWORD_POST,
  PORT_POST: process.env.PORT_POST,

}