import pool from '../models/db.js'
import * as UserModel from '../models/UserModel.js'

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const token = await UserModel.login(email, password)
    res
      .status(200)
      .json({ success: true, message: [{ result: 'login succesful' }, token] })
  } catch (e) {
    console.log(e)
    res.status(400).json({ success: false, message: e })
  }
}
