const { get, run } = require('../config/database');

async function findByEmail(email) {
  return get(
    `SELECT id, first_name AS firstName, last_name AS lastName, email, phone
     FROM customers
     WHERE email = ?`,
    [email]
  );
}

async function create(customer) {
  const result = await run(
    `INSERT INTO customers (first_name, last_name, email, phone)
     VALUES (?, ?, ?, ?)`,
    [customer.firstName, customer.lastName, customer.email, customer.phone]
  );

  return get(
    `SELECT id, first_name AS firstName, last_name AS lastName, email, phone
     FROM customers
     WHERE id = ?`,
    [result.id]
  );
}

module.exports = {
  findByEmail,
  create
};
