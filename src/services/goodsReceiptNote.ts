import db from '../config/db'
import query from '../query/query'

const pool = db.pool()

export interface receipt_note {
  receipt_no: number,
  donvi: string,
  part: string,
  date_receipt: Date,
  payable: number,
  co: number,
  deliverer_name: string,
  according_law: string,
  receive_warehouse_name: string,
  receive_warehouse_place: string,
  total_price_string: string,
  total_price_number: number,
  original_document_number_attached: number,
  receipt_creator: string,
  storekeeper: string,
  receive_signature_date: Date,
  chief_accountant: string
}
export interface product_detail {
  product_id: number,
  product_name: string,
  unit_price: number,
  quantity_according_doc: number,
  actual_quantity_received: number,
  unit_money: string
}

const receipt = {
  getReceiptNotebyId: async (receipt_no: number) => {
    try {
      const result = await pool.query(query.GET_RECEIPT_NOTE_ID, [receipt_no])
      return result.rows
    } catch (error) {
      console.error('Error executing query in getAllReceiptNote - models--------------------', error)
      return []
    }
  },
  // create a new instance of the goods_receipt_note
  createReceiptNote: async (receiptNote: receipt_note, products: product_detail[]) => {
    try {
      //begin transaction
      await pool.query('BEGIN')
      const {
        receipt_no, donvi, part, date_receipt, payable, co, deliverer_name, according_law, receive_warehouse_name,
        receive_warehouse_place, total_price_string, total_price_number, original_document_number_attached,
        receipt_creator, storekeeper, receive_signature_date, chief_accountant
      } = receiptNote

      // add receipt note to the goods_receipt_note table
      const result = await pool.query(query.CREATE_RECEIPT_NOTE,
        [receipt_no, donvi, part, date_receipt, payable, co, deliverer_name, according_law, receive_warehouse_name,
          receive_warehouse_place, total_price_string, total_price_number, original_document_number_attached,
          receipt_creator, storekeeper, receive_signature_date, chief_accountant]
      )
      for (const product of products) {
        //update quantity of products if exist and add if not already exist and set unit_price equal 0
        const { product_id, product_name, unit_price,
          quantity_according_doc, actual_quantity_received, unit_money
        } = product

        const isProduct: any = await pool.query(query.PRODUCT_ID, [product_id])
        console.log(isProduct, '----------------------------------------------')
        if (isProduct.rowCount > 0) {
          //when product is exist
          console.log('true-----------------------------')
          await pool.query(query.UPDATE_PRODUCT, [actual_quantity_received, product_id])
        } else {
          //when product is not exist
          console.log('false---------------------------')
          await pool.query(query.CREATE_PRODUCT, [product_id, product_name, 0, actual_quantity_received])
        }
        //create receipt_details for goods_receipt_note
        console.log('receipt_details-------------------------------')
        await pool.query(query.CREATE_RECEIPT_DETAILS,
          [receipt_no, product_id, quantity_according_doc, actual_quantity_received, unit_money, unit_price]
        )
      }

      //end transaction and save,update
      await pool.query('COMMIT')
      return { status: 'success', data: result.rows }
    } catch (error) {
      //Cancel if there is an error
      await pool.query('ROLLBACK')
      console.error('Error executing query in createReceiptNote - models-------------------------', error)
      return error
    }
  },
}

export default receipt

