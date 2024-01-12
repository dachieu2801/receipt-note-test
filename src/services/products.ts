import db from '../config/db'
import query from '../query/query'

const pool = db.pool()

const product = {
  getAllproduct: async () => {
    try {
      const result = await pool.query(query.SELECT_ALL_PRODUCTS);
      return result.rows;
    } catch (error) {
      console.error('Error executing query', error);
      return [];
    }
  },
  createProduct: async (product: any) => {
    try {
      const { product_id, product_name, unit_price, quantity } = product
      const values = await pool.query(query.CREATE_PRODUCT, [product_id, product_name, unit_price, quantity]);
      return values.rows[0].product_id
    } catch (error) {
      console.error('Error executing query', error)
      return null;
    }
  },
}

export default product

