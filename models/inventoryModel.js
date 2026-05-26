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

  await pool.query(
    `INSERT INTO inventoryhistorytable
    (name, movement, newstocks)
    VALUES (?, ?, ?)`,
    [name, `+${quantity}`, quantity]
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

  let movement = 0

  if (quantity > oldQuantity) {
    movement = `+${quantity - oldQuantity}`
  } else if (quantity < oldQuantity) {
    movement = `-${oldQuantity - quantity}`
  } else {
    movement = '0'
  }

  await pool.query(
    `INSERT INTO inventoryhistorytable
    (name, movement, newstocks)
    VALUES (?, ?, ?)`,
    [name, movement, quantity]
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

  await pool.query(
    `INSERT INTO inventoryhistorytable
    (name, movement, newstocks)
    VALUES (?, ?, ?)`,
    [item.name, `-${item.quantity}`, 0]
  )

  return result.affectedRows
}

export const orderItem = async (quantity, id, orderid) => {
  const [rows] = await pool.query(
    'SELECT name, quantity FROM inventorytable WHERE id = ?',
    [id]
  )

  if (rows.length === 0) {
    return {
      success: false,
      message: 'Item not found'
    }
  }

  const item = rows[0]
  const currentStock = item.quantity

  if (currentStock === 0) {
    return {
      success: false,
      message: 'No stocks available'
    }
  }

  if (quantity > currentStock) {
    return {
      success: false,
      message: 'Insufficient stock'
    }
  }

  const newQuantity = currentStock - quantity

  await pool.query('UPDATE inventorytable SET quantity = ? WHERE id = ?', [
    newQuantity,
    id
  ])

  const shipmentResponse = await fetch(
    'https://logistics-and-tracking-delivery-system.onrender.com/api/shipments',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderid,
        name: item.name,
        quantity
      })
    }
  )

  if (!shipmentResponse.ok) {
    throw new Error('Failed to create shipment record')
  }

  await pool.query(
    `INSERT INTO inventoryhistorytable
    (name, movement, newstocks)
    VALUES (?, ?, ?)`,
    [item.name, `-${quantity}`, newQuantity]
  )

  return {
    success: true
  }
}
