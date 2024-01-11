import db from '../config/db'

const pool = db.pool()

const product = {
  getAllproduct: async () => {
    try {
      const result = await pool.query('SELECT * FROM products ');
      return result.rows;
    } catch (error) {
      console.error('Error executing query', error);
      return [];
    }
  },
  createProduct: async (product: any) => {
    try {
      const { product_id, product_name, unit_price, quantity } = product
      const values = await pool.query(
        `INSERT INTO products (product_id, product_name, unit_price, quantity) 
         VALUES ($1, $2, $3, $4) RETURNING product_id`,
        [product_id, product_name, unit_price, quantity]
      );
      return values.rows[0].product_id
    } catch (error) {
      console.error('Error executing query', error)
      return null;
    }
  },

}

export default product

