import db from '../config/db'
import query from '../query/query'

const pool = db.pool()

const receiptDetails = {
  getAllreceiptDetails: async () => {
    try {
      const result = await pool.query(query.SELECT_ALL_RECEIPT_DETAIL);
      return result.rows;
    } catch (error) {
      console.error('Error executing query in getAllreceiptDetails - models--------------------------', error);
      return [];
    }
  },

}

export default receiptDetails

