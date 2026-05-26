import * as InventoryModel from '../models/inventoryModel.js'
import { v4 as uuidv4 } from 'uuid'

export const fetchItems = async (req, res) => {
  try {
    const items = await InventoryModel.getItems()
    res.status(200).json({ success: true, message: items })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

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

export const orderItem = async (req, res) => {
  const { quantity } = req.body
  const { id } = req.params

  const orderid = uuidv4()

  try {
    const result = await InventoryModel.orderItem(quantity, id, orderid)

    if (!result.success) {
      return res.status(400).json(result)
    }

    res.status(200).json({
      success: true,
      orderid,
      message: 'Order successful'
    })
  } catch (e) {
    console.log(e)

    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}
