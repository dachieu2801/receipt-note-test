// __tests__/user.test.ts
import request from 'supertest'
import app from '../index'

import db from '../config/db'

const pool = db.pool()
interface receipt_note {
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

beforeAll(async () => {
  db.connect()
})

afterAll(async () => {
  await pool.query('DELETE FROM receipt_details')
  await pool.query('DELETE FROM products')
  await pool.query('DELETE FROM goods_receipt_note')
})

describe('PostgreSQL Connection Test', () => {
 
  it('should connect to PostgreSQL', async () => {
    // Use a simple query to check the connection
    const result = await pool.query('SELECT $1 AS value', ['test'])
    expect(result.rows[0].value).toBe('test')
  })

  test('POST /product should create a new product', async () => {
    const product = {
      product_id: 134,
      product_name: 'iron',
      unit_price: 1000000,
      quantity: 100
    }
    const response = await request(app)
      .post('/product')
      .send(product)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Create success')
    expect(response.body.data).toEqual(product)
    const getProductFromDb = await pool.query('SELECT * FROM products WHERE product_id = 134')
    expect(JSON.stringify(getProductFromDb.rows[0])).toEqual(JSON.stringify(product))
  })

  test('POST /product should handle validation error', async () => {
    const product = {
      product_id: 128,
      unit_price: 1000000,
      quantity: 100
    }
    const response = await request(app)
      .post('/product')
      .send(product)
    expect(response.status).toBe(500)
    expect(response.body.message).toBe('Failed to create product')
  })

  test('POST /creat-receipt should handle create receipt-note', async () => {
    const receiptNote = {
      receipt_no: 156,
      donvi: 'xpress',
      part: 'giao hang',
      date_receipt: new Date(),
      payable: 1000000,
      co: 10000000,
      deliverer_name: 'hieu',
      according_law: 'theo ......',
      receive_warehouse_name: 'khotong1',
      receive_warehouse_place: 'hanoi',
      total_price_string: 'một trăm ca',
      total_price_number: 100000,
      original_document_number_attached: 100,
      receipt_creator: 'hieu',
      storekeeper: 'hieu',
      receive_signature_date: new Date(),
      chief_accountant: 'hieu'
    }
    const products = [{
      product_id: 1,
      product_name: 'steel',
      unit_price: 100000,
      quantity_according_doc: 10000,
      actual_quantity_received: 1000,
      unit_money: 'kg'
    }]

    const response = await request(app)
      .post('/receipt/creat-receipt')
      .send({
        receiptNote,
        products
      })
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('status', 'success')
    const result = await pool.query('SELECT * FROM goods_receipt_note WHERE  receipt_no = 156')

    expect(JSON.stringify(result.rows)).toEqual(JSON.stringify(response.body.data))
  })

  test('POST /receipt/creat-receipt should handle validation error', async () => {
    const response = await request(app)
      .post('/receipt/creat-receipt')
      .send({})
    expect(response.status).toBe(500)
    expect(response.body.status).toBe('failed')
    expect(typeof response.body.message).toBe('string')
  })


  test('GET /receipt/get-allreceipt should get all ceceipt note', async () => {
    const response = await request(app).get('/receipt/get-allreceipt')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    expect(Array.isArray(response.body.data)).toBe(true)
    response.body.data.forEach((item: receipt_note) => {
      expect(item).toBeInstanceOf(Object)
    })
  })

  test('GET /receipt/get-receipt/:receipt_no should get ceceipt-note by receipt_no', async () => {
    const response = await request(app).get('/receipt/get-receipt/156')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('success')
    const item = response.body.data[0]
    expect(item).toBeInstanceOf(Object)
    expect('receipt_no' in item).toBe(true);
    expect(item.receipt_no).toBe(156);
    expect('detail_id' in item).toBe(true);
    expect('product_id' in item).toBe(true);
  })

  test('GET /receipt/get-allreceipt should handle ceceipt-note not found error', async () => {
    const response = await request(app).get('/receipt/get-receipt/invalid')
    expect(response.status).toBe(500)
    expect(response.body.status).toBe('failed')
    expect(response.body).toHaveProperty('message', 'Can\'t find receipt')
  })

})