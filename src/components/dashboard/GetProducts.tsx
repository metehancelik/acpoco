"use client"
import React from 'react'
import { Button } from '../ui/button'
import axios from 'axios'

const GetProducts = () => {
    const handleGetProducts = async () => {
        const response = await axios.get('/api/admin/shopify-products')
        console.log(response.data)
    }
  return (
    <Button onClick={handleGetProducts}>Ürünleri Getir</Button>
  )
}

export default GetProducts