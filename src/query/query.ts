const goods_receipt_note: string = 'goods_receipt_note'


export default {
  //------------/models/goodsReceiptNote---------
  // getReceiptNotebyId 
  GET_RECEIPT_NOTE_ID: ` SELECT * FROM goods_receipt_note s JOIN receipt_details 
    a ON s.receipt_no = a.receipt_no WHERE a.receipt_no = $1`,

  //createReceiptNote
  CREATE_RECEIPT_NOTE: `INSERT INTO goods_receipt_note 
    (receipt_no, donvi, part, date_receipt, payable, co, deliverer_name, according_law, receive_warehouse_name,
    receive_warehouse_place, total_price_string, total_price_number, original_document_number_attached,
    receipt_creator, storekeeper, receive_signature_date, chief_accountant) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
  PRODUCT_ID: `SELECT * FROM products WHERE product_id = $1`,
  UPDATE_PRODUCT: `UPDATE products SET quantity = COALESCE(quantity,0) + $1 WHERE product_id = $2`,
  CREATE_PRODUCT: `INSERT INTO products (product_id, product_name, unit_price, quantity) VALUES ($1, $2, $3, $4) RETURNING product_id`,
  CREATE_RECEIPT_DETAILS: `INSERT INTO receipt_details 
  ( receipt_no, product_id, quantity_according_doc, actual_quantity_received, unit_money, unit_price) 
  VALUES ($1, $2, $3, $4, $5, $6) RETURNING detail_id`,

  //------------/models/PRODUCTS---------
  //getAllproduct
  SELECT_ALL_PRODUCTS: 'SELECT * FROM products',
  SELECT_ALL_RECEIPT_DETAIL: 'SELECT * FROM receipt_details'
}
