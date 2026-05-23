import * as InventoryModel from '../models/inventoryModel.js'
import { v4 as uuidv4 } from 'uuid'

export const createItem = async (req, res) => {
  const { name, category, price, quantity } = req.body
  try {
    const insertId = await InventoryModel.insertItem(
      name,
      category,
      price,
      quantity
    )
    res.status(200).json({ success: true, message: insertId })
  } catch (e) {
    console.log(e)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

export const editItem = async (req, res) => {
  const { name, category, price, quantity } = req.body
  const { id } = req.params
  try {
    const updatedId = await InventoryModel.updateItem(
      name,
      category,
      price,
      quantity,
      id
    )
    res.status(200).json({ success: true, message: updatedId })
  } catch (e) {
    console.log(e)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

export const deleteItem = async (req, res) => {
  const { id } = req.params
  try {
    const deleteId = await InventoryModel.deleteItem(id)
    res.status(200).json({ success: true, message: deleteId })
  } catch (e) {
    console.log(e)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}
