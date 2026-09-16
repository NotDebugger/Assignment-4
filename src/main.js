const express = require("express");
const { Pool } = require("pg");
const app = express();

const pool = new Pool({
  host: "localhost",
  port: "5432",
  user: "postgres",
  password: "1234",
  database: "assignment4",
});

app.use(express.json());

// create product
// http://127.0.0.1:3000/product
app.post("/product", async (req, res) => {
  const { productName, price, stock, supplierId } = req.body;
  await pool.query(
    `INSERT INTO products (name, price, stock, supplier_id) VALUES ($1,$2,$3,$4)`,
    [productName, price, stock, supplierId],
  );
  res.json({ message: "product created successfully", success: true });
});

// get all products
// http://127.0.0.1:3000/product
app.get("/product", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM products");
  if (rows.length === 0)
    res.json({
      message: "no product found",
      success: false,
    });

  res.json({
    message: "products retrieved successfully",
    success: true,
    result: rows,
  });
});

// get product by id
// http://127.0.0.1:3000/product/1
app.get("/product/:productId", async (req, res) => {
  const productId = req.params.productId;
  const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [
    productId,
  ]);

  if (rows.length === 0)
    res.json({
      message: "no product found",
      success: false,
    });

  res.json({
    message: "product retrieved successfully",
    success: true,
    result: rows,
  });
});

// update product
// http://127.0.0.1:3000/product/1
app.put("/product/:productId", async (req, res) => {
  const productId = req.params.productId;
  const { productName, price, stock } = req.body;
  await pool.query(
    "UPDATE products SET name = $1, price = $2, stock = $3 WHERE id = $4",
    [productName, price, stock, productId],
  );

  res.json({
    message: "product updated successfully",
    success: true,
  });
});

// delete product
// http://127.0.0.1:3000/product/1
app.delete("/product/:productId", async (req, res) => {
  const productId = req.params.productId;
  await pool.query("DELETE FROM products WHERE id = $1", [productId]);

  res.json({
    message: "product deleted successfully",
    success: true,
  });
});

// create supplier
// http://127.0.0.1:3000/supplier
app.post("/supplier", async (req, res) => {
  const { supplierName, phoneNumber } = req.body;
  await pool.query(
    `INSERT INTO suppliers (name, contact_number) VALUES ($1,$2)`,
    [supplierName, phoneNumber],
  );
  res.json({ message: "supplier created successfully", success: true });
});

// get all suppliers
// http://127.0.0.1:3000/supplier
app.get("/supplier", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM suppliers");

  if (rows.length === 0)
    res.json({
      message: "no suppliers found",
      success: false,
    });

  res.json({
    message: "suppliers retrieved successfully",
    success: true,
    result: rows,
  });
});

// update supplier
// http://127.0.0.1:3000/supplier/1
app.put("/supplier/:supplierId", async (req, res) => {
  const supplierId = req.params.supplierId;
  const { supplierName, phoneNumber } = req.body;
  await pool.query(
    "UPDATE suppliers SET name = $1, contact_number = $2 WHERE id = $3",
    [supplierName, phoneNumber, supplierId],
  );

  res.json({
    message: "supplier updated successfully",
    success: true,
  });
});

// delete supplier
// http://127.0.0.1:3000/supplier/1
app.delete("/supplier/:supplierId", async (req, res) => {
  const supplierId = req.params.supplierId;
  await pool.query("DELETE FROM suppliers WHERE id = $1", [supplierId]);

  res.json({
    message: "supplier deleted successfully",
    success: true,
  });
});

// record a sale
// http://127.0.0.1:3000/sale
app.post("/sale", async (req, res) => {
  const { productId, quantitySold, date } = req.body;
  await pool.query(
    `INSERT INTO sales (product_id, quantity_sold, sale_date) VALUES ($1,$2,$3)`,
    [productId, quantitySold, date],
  );
  res.json({ message: "sale recorded successfully", success: true });
});

// get all sales
// http://127.0.0.1:3000/sale
app.get("/sale", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM sales");

  if (rows.length === 0)
    res.json({
      message: "no sales found",
      success: false,
    });

  res.json({
    message: "sales retrieved successfully",
    success: true,
    result: rows,
  });
});

// get sale by id
// http://127.0.0.1:3000/sale/1
app.get("/sale/:saleId", async (req, res) => {
  const saleId = req.params.saleId;
  const { rows } = await pool.query("SELECT * FROM sales WHERE sale_id = $1", [
    saleId,
  ]);

  if (rows.length === 0)
    res.json({
      message: "no sale found",
      success: false,
    });

  res.json({
    message: "sale retrieved successfully",
    success: true,
    result: rows,
  });
});

// create api endpoints
// add category column
// http://127.0.0.1:3000/category
app.post("/category", async (req, res) => {
  await pool.query(`ALTER TABLE products ADD COLUMN category VARCHAR(100);`);
  res.json({ message: "category column added successfully", success: true });
});

// delete category
// http://127.0.0.1:3000/category
app.delete("/category", async (req, res) => {
  await pool.query(`ALTER TABLE products DROP COLUMN category;`);

  res.json({ message: "category column deleted successfully", success: true });
});

// update contact-number type
// http://127.0.0.1:3000/api/supplier/contact-number
app.patch("/api/supplier/contact-number", async (req, res) => {
  // patch because its partial update
  await pool.query(
    `ALTER TABLE suppliers ALTER COLUMN contact_number TYPE VARCHAR(15);`,
  );

  res.json({
    message: "contact-number type updated successfully",
    success: true,
  });
});

// update product-name type
// http://127.0.0.1:3000/api/supplier/product-name
app.patch("/api/supplier/product-name", async (req, res) => {
  await pool.query(
    `ALTER TABLE suppliers ALTER COLUMN product_name TYPE VARCHAR(15);`,
  );

  res.json({
    message: "product-name not null successfully",
    success: true,
  });
});

// update the price of 'Bread' to 25.00.
// http://127.0.0.1:3000/api/product/bread-price-25
app.put("/api/product/bread-price-25", async (req, res) => {
  await pool.query("UPDATE products SET price = 25.00 WHERE name = 'Bread'");

  res.json({
    message: "product updated successfully",
    success: true,
  });
});

// delete the product 'Eggs'.
// http://127.0.0.1:3000/api/product/eggs
app.delete("/api/product/eggs", async (req, res) => {
  await pool.query("DELETE FROM products WHERE name = 'Eggs';");

  res.json({
    message: "product deleted successfully",
    success: true,
  });
});

// create endpoint for total quantity sold
// http://127.0.0.1:3000/api/reports/total-sold
app.get("/api/reports/total-sold", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT p.id, p.name, SUM(s.quantity_sold)
     FROM products p
     LEFT JOIN sales s ON s.product_id = p.id
     GROUP BY p.id, p.name;`,
  );

  res.json({
    message: "total quantity sold for each product retrieved successfully",
    success: true,
    result: rows,
  });
});

// create endpoint for the product with the highest stock quantity.
// http://127.0.0.1:3000/api/reports/highest-stock
app.get("/api/reports/highest-stock", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, name, stock
     FROM products
     WHERE stock = (SELECT MAX(stock) FROM products);`,
  );

  res.json({
    message: "the product retrieved successfully",
    success: true,
    result: rows,
  });
});

// create endpoint for suppliers starting f.
// http://127.0.0.1:3000/api/reports/suppliers-starting-f
app.get("/api/reports/suppliers-starting-f", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT *
     FROM suppliers
     WHERE name LIKE 'F%';`,
  );

  res.json({
    message: "supplier retrieved successfully",
    success: true,
    result: rows,
  });
});

// create endpoint for products that have never been sold.
// http://127.0.0.1:3000/api/reports/never-sold
app.get("/api/reports/never-sold", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT p.id, p.name, p.Price, p.stock
      FROM products p
      LEFT JOIN sales s ON p.id = s.sale_id
      WHERE s.sale_id IS NULL;`,
  );

  res.json({
    message: "products retrieved successfully",
    success: true,
    result: rows,
  });
});
// create endpoint for all sales.
// http://127.0.0.1:3000/api/reports/sales
app.get("/api/reports/sales", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT p.name, s.quantity_sold, s.sale_date
      FROM products p
      JOIN sales s ON p.id = s.product_id;`,
  );

  res.json({
    message: "sales retrieved successfully",
    success: true,
    result: rows,
  });
});

app.listen(3000, () => console.log("server is running"));
