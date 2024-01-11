# create table products 
CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  unit_price FLOAT NOT NULL,
  quantity INT  NOT NULL,
);

# create table goods_receipt_note 
CREATE TABLE goods_receipt_note (
  receipt_no SERIAL PRIMARY KEY,
  donvi VARCHAR(255)  NOT NULL,
  part VARCHAR(255)  NOT NULL,
  date_receipt DATE NOT NULL,
  payable FLOAT NOT NULL,
  co FLOAT NOT NULL,
  deliverer_name VARCHAR(255) NOT NULL,
  according_law VARCHAR(255) NOT NULL,
  receive_warehouse_name VARCHAR(255) NOT NULL,
  receive_warehouse_place VARCHAR(255) NOT NULL,
  total_price_string VARCHAR(255) NOT NULL,
  total_price_number FLOAT NOT NULL,
  original_document_number_attached FLOAT NOT NULL,
  receipt_creator VARCHAR(255) NOT NULL,
  storekeeper VARCHAR(255) NOT NULL,
  receive_signature_date DATE NOT NULL,
  chief_accountant VARCHAR(255)  NOT NULL
)

# create table receipt_details 
CREATE TABLE receipt_details (
  detail_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  receipt_no INT REFERENCES goods_receipt_note(receipt_no),
  product_id INT REFERENCES products(product_id),
  quantity_according_doc INT NOT NULL,
  actual_quantity_received INT NOT NULL,
  unit_money VARCHAR(255) NOT NULL,
  unit_price FLOAT NOT NULL,
);	

# routes in project

+ 

+  '/receipt' (get) : get form receipt
+  '/receipt/creat-receipt' (post) : create receipt from form submission
+  '/receipt/get-receipt/:receipt_no' (get) : get receipt from receipt_no
+  '/receipt/get-allreceipt/' (get) : get all receipt  