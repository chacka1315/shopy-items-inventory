import pool from './pool.js';

//category queries
async function addCategory(category) {
  const query = 'INSERT INTO categories (name, description) VALUES ($1, $2)';
  const values = [category.name, category.description];
  await pool.query(query, values);
}

async function getAllCategory() {
  const { rows } = await pool.query('SELECT * FROM categories');
  return rows;
}

async function findCategoryByName(search_query) {
  const query = 'SELECT * FROM categories WHERE name = $1';
  const { rows } = await pool.query(query, [search_query]);
  return rows;
}

async function findCategoryById(id) {
  const query = 'SELECT * FROM categories WHERE id = $1';
  const { rows } = await pool.query(query, [id]);
  return rows;
}

async function checkIfCategoryExistForUpdate(id, name) {
  const query = 'SELECT * FROM categories WHERE name = $2 AND id != $1';
  const { rows } = await pool.query(query, [id, name]);
  return rows;
}

async function updateCategory(category_id, data) {
  const query = `
  UPDATE categories
  SET name = $2, description = $3
  WHERE id = $1
  `;
  const values = [category_id, data.name, data.description];
  await pool.query(query, values);
}

async function deleteCategory(category_id) {
  const query = 'DELETE FROM categories WHERE id = $1';
  await pool.query(query, [category_id]);
}

//items queries
async function addItem(category_id, item) {
  const query = `
  INSERT INTO items (category_id, name, price, stock, image_link, description)
  VALUES ($1, $2, $3, $4, $5, $6)
  `;

  const values = [
    category_id,
    item.name,
    item.price,
    item.stock,
    item.image_link,
    item.description,
  ];

  await pool.query(query, values);
}

async function getCategoryItems(category_id) {
  const query = 'SELECT * FROM items WHERE category_id = $1 ORDER BY name';
  const { rows } = await pool.query(query, [category_id]);
  return rows;
}

async function findItemsByName(category_id, search_query) {}

async function findItemById(id) {
  const { rows } = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
  return rows;
}

async function findItemCategoryName(id) {
  const query = `
  SELECT categories.name
    FROM categories
    INNER JOIN items
    ON categories.id = items.category_id
  WHERE items.id = $1;
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0].name;
}

async function updateItem(item_id, item) {
  const query = `
  UPDATE items
  SET name = $1, price = $2, stock = $3, image_link = $4, description = $5
  WHERE items.id = $6
  `;
  const values = [
    item.name,
    item.price,
    item.stock,
    item.image_link,
    item.description,
    item_id,
  ];
  await pool.query(query, values);
}

async function deleteItem(id) {
  await pool.query('DELETE FROM items WHERE id = $1', [id]);
}

export default {
  addCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
  addItem,
  getCategoryItems,
  findItemsByName,
  updateItem,
  deleteItem,
  findCategoryByName,
  findCategoryById,
  checkIfCategoryExistForUpdate,
  findItemById,
  findItemCategoryName,
};
