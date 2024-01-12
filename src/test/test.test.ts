// __tests__/user.test.ts
import request from 'supertest';
import app from '../index';

import db from '../config/db';
import { stringify } from 'querystring';

const pool = db.pool()

beforeAll(async () => {
  db.connect()
  // Connect to a test database 
  // await pool.query(`CREATE TABLE products (
  //   product_id SERIAL PRIMARY KEY,
  //   product_name VARCHAR(255) NOT NULL,  
  //   unit_price FLOAT NOT NULL, 
  //   quantity INT  NOT NULL 
  //   )`)

  // await pool.query(`CREATE TABLE goods_receipt_note (
  //   receipt_no SERIAL PRIMARY KEY,
  //   donvi VARCHAR(255)  NOT NULL,
  //   part VARCHAR(255)  NOT NULL,
  //   date_receipt DATE NOT NULL,
  //   payable FLOAT NOT NULL,
  //   co FLOAT NOT NULL,
  //   deliverer_name VARCHAR(255) NOT NULL,
  //   according_law VARCHAR(255) NOT NULL,
  //   receive_warehouse_name VARCHAR(255) NOT NULL,
  //   receive_warehouse_place VARCHAR(255) NOT NULL,
  //   total_price_string VARCHAR(255) NOT NULL,
  //   total_price_number FLOAT NOT NULL,
  //   original_document_number_attached FLOAT NOT NULL,
  //   receipt_creator VARCHAR(255) NOT NULL,
  //   storekeeper VARCHAR(255) NOT NULL,
  //   receive_signature_date DATE NOT NULL,
  //   chief_accountant VARCHAR(255)  NOT NULL
  // )`)
  // await pool.query(`CREATE TABLE receipt_details (
  //   detail_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  //   receipt_no INT REFERENCES goods_receipt_note(receipt_no),
  //   product_id INT REFERENCES products(product_id),
  //   quantity_according_doc INT NOT NULL,
  //   actual_quantity_received INT NOT NULL,
  //   unit_money VARCHAR(255) NOT NULL,
  //   unit_price FLOAT NOT NULL
  // )`)
});
afterAll(async () => {
  // await pool.query('DROP TABLE receipt_details');
  // await pool.query('DROP TABLE products');
  // await pool.query('DROP TABLE goods_receipt_note');
})

describe('PostgreSQL Connection Test', () => {
  it('should connect to PostgreSQL', async () => {
    // Use a simple query to check the connection
    const result = await pool.query('SELECT $1 AS value', ['test']);
    expect(result.rows[0].value).toBe('test');
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
      .send(product);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Create success')
    expect(response.body.data).toEqual(product)
    const getProductFromDb = await pool.query('SELECT * FROM products WHERE product_id = 134')
    expect(JSON.stringify(getProductFromDb.rows[0])).toEqual(product)
  });

  test('POST /product should handle validation error', async () => {
    const product = {
      product_id: 128,
      unit_price: 1000000,
      quantity: 100
    }
    const response = await request(app)
      .post('/product')
      .send(product);
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Failed to create product')
  });

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
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success')
    const result = await pool.query('SELECT * FROM goods_receipt_note WHERE  receipt_no = 156')
    
    expect(JSON.stringify(result.rows)).toEqual(JSON.stringify(response.body.data))
  });


  test('POST /receipt/creat-receipt should handle validation error', async () => {
    const response = await request(app)
      .post('/receipt/creat-receipt')
      .send({});
    expect(response.status).toBe(500);
    expect(response.body.status).toBe('failed');
    expect(typeof response.body.message).toBe('string');
  });


  test.only('GET /receipt/get-allreceipt should get all ceceipt note', async () => {
    const response = await request(app).get('/receipt/get-allreceipt')
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((item: any) => {
      expect(item).toBeInstanceOf(Object);
    });
  })

  test('GET /receipt/get-receipt/:receipt_no should get ceceipt-note by receipt_no', async () => {
    const response = await request(app).get('/receipt/get-receipt/152')
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  })

  test('GET /receipt/get-allreceipt should handle ceceipt-note not found error', async () => {
    const response = await request(app).get('/receipt/get-receipt/invalid')
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Can\'t find receipt')
  })

});