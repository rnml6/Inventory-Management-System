import * as InventoryController from '../controllers/inventoryController.js'
import express from 'express'
import CheckToken from '../middleware/authenticationHandler.js'

const inventoryRoutes = express.Router()

inventoryRoutes.use(CheckToken)

inventoryRoutes.get('/all', InventoryController.fetchItems)
inventoryRoutes.post('/new', InventoryController.createItem)
inventoryRoutes.put('/edit/:id', InventoryController.editItem)
inventoryRoutes.delete('/delete/:id', InventoryController.deleteItem)

inventoryRoutes.post('/order/:id', InventoryController.orderItem)

export default inventoryRoutes