CREATE TABLE
  suppliers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    contact_number TEXT
  );

CREATE TABLE
  products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL NOT NULL CHECK (price >= 0),
    stock INT NOT NULL DEFAULT 1 CHECK (stock >= 0),
    supplier_id INT NOT NULL REFERENCES suppliers (id)
  );

CREATE TABLE
  sales (
    sale_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products (id),
    quantity_sold INT NOT NULL DEFAULT 0,
    sale_date DATE
  );

-- Create user
CREATE USER store_manager
WITH
  PASSWORD '1234';

-- grant SELECT, INSERT, UPDATE on all tables
GRANT
SELECT
,
  INSERT,
UPDATE ON ALL TABLES IN SCHEMA public TO store_manager;

-- revoke UPDATE
REVOKE
UPDATE ON ALL TABLES IN SCHEMA public
FROM
  store_manager;

-- grant DELETE only on sales table
GRANT DELETE ON TABLE sales TO store_manager;