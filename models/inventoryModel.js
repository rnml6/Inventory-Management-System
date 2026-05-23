import pool from './db.js'

export const getItems = async () => {
  const [rows] = await pool.query('SELECT * FROM inventorytable')
  return rows
}

export const insertItem = async (name, category, price, quantity) => {
  const [result] = await pool.query(
    'INSERT INTO inventorytable (name, category, price, quantity) VALUES(?,?,?,?)',
    [name, category, price, quantity]
  )

  return result.insertId
}

export const updateItem = async (name, category, price, quantity, id) => {
  const [rows] = await pool.query(
    'SELECT quantity FROM inventorytable WHERE id = ?',
    [id]
  )

  if (rows.length === 0) {
    return 0
  }

  const oldQuantity = rows[0].quantity

  const [result] = await pool.query(
    'UPDATE inventorytable SET name= ?, category= ?, price= ?, quantity= ? WHERE id= ?',
    [name, category, price, quantity, id]
  )

  return result.affectedRows
}

export const deleteItem = async id => {
  const [rows] = await pool.query(
    'SELECT name, quantity FROM inventorytable WHERE id = ?',
    [id]
  )

  if (rows.length === 0) {
    return 0
  }

  const item = rows[0]
  const [result] = await pool.query('DELETE FROM inventorytable WHERE id= ?', [
    id
  ])

  return result.affectedRows
}