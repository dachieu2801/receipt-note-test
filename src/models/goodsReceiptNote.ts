import db from '../config/db'

const pool = db.pool()

const receipt = {
  getReceiptNotebyId: async (receipt_no: number) => {
    try {
      const result = await pool.query(`
      SELECT * FROM goods_receipt_note s JOIN receipt_details a ON s.receipt_no = a.receipt_no 
      WHERE a.receipt_no = ${receipt_no}
      `)
      return result.rows;
    } catch (error) {
      console.error('Error executing query in getAllReceiptNote - models--------------------', error);
      return [];
    }
  },
  // create a new instance of the goods_receipt_note
  createReceiptNote: async (receiptNote: any, products: any[]) => {
    try {
      const {
        receipt_no, donvi, part, date_receipt, payable, co, deliverer_name, according_law, receive_warehouse_name,
        receive_warehouse_place, total_price_string, total_price_number, original_document_number_attached,
        receipt_creator, storekeeper, receive_signature_date, chief_accountant
      } = receiptNote
      // add receipt note to the goods_receipt_note table
      await pool.query(
        `INSERT INTO goods_receipt_note 
        (receipt_no, donvi, part, date_receipt, payable, co, deliverer_name, according_law, receive_warehouse_name,
          receive_warehouse_place, total_price_string, total_price_number, original_document_number_attached,
          receipt_creator, storekeeper, receive_signature_date, chief_accountant) 
         VALUES ($1, $2, $3,$4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [receipt_no, donvi, part, date_receipt, payable, co, deliverer_name, according_law, receive_warehouse_name,
          receive_warehouse_place, total_price_string, total_price_number, original_document_number_attached,
          receipt_creator, storekeeper, receive_signature_date, chief_accountant]
      );

      for (const product of products) {
        //update quantity of products if exist and add if not already exist and set unit_price equal 0
        const { product_id, product_name, unit_price,
          quantity_according_doc, actual_quantity_received, unit_money
        } = product
        const isProduct = await pool.query(
          `SELECT * FROM products WHERE product_id = ${product_id}`
        )

        if (isProduct.rows[0]) {
          console.log('true-----------------------------');
          await pool.query(
            `UPDATE products SET quantity = COALESCE(quantity,0) + $1 WHERE product_id = $2`,
            [actual_quantity_received, product_id]
          )
        } else {
          console.log('false---------------------------');
          await pool.query(
            `INSERT INTO products (product_id, product_name, unit_price, quantity) 
            VALUES ($1, $2, $3, $4)`,
            [product_id, product_name, 0, actual_quantity_received]
          )
        }
        //create receipt_details for goods_receipt_note
        console.log('receipt_details-------------------------------');
        await pool.query(
          `INSERT INTO receipt_details 
          ( receipt_no, product_id, quantity_according_doc, actual_quantity_received, unit_money, unit_price) 
          VALUES ($1, $2, $3, $4, $5, $6) RETURNING detail_id`,
          [receipt_no, product_id, quantity_according_doc, actual_quantity_received, unit_money, unit_price]
        )
      }

      return 'create success'
    } catch (error) {
      console.error('Error executing query in createReceiptNote - models-------------------------', error);
      return error;
    }
  },
}

export default receipt

