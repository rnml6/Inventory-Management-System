import pool from './db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const getUser = async id => {
  if (Number.isNaN(Number(id))) {
    throw new Error('invalid id')
  }

  const response = await fetch(
    `https://users-api-we0n.onrender.com/api/users/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }

  return await response.json()
}

export const login = async (email, password) => {
  if (email === '' || password === '') {
    throw new Error('Email and Password is required')
  }

  const response = await fetch(
    'https://users-api-we0n.onrender.com/api/users/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Login failed')
  }

  return data.token
}
