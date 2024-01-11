import db from '../config/db'

const pool = db.pool()

const receiptDetails = {
  getAllreceiptDetails: async() => { 
    try {
      const result = await pool.query('SELECT * FROM receipt_details');
      return result.rows;
    } catch (error) {
      console.error('Error executing query in getAllreceiptDetails - models--------------------------', error);
      return [];
    }
  },
  
}

export default receiptDetails

  