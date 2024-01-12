import { Request, Response } from 'express';
import productModel from '../services/products'

export default {
  createProduct: async (req: Request, res: Response) => {
    try {
      const product = req.body
      const product_id = await productModel.createProduct(product);
      if (product_id) {
        res.status(200).json({ message: 'Create success', data: product});
      } else {
        res.status(500).json({ message: 'Failed to create product' })
      }

    } catch (error) {
      console.error('Error createProduct product-controller-------------------', error);
      res.status(500).json({ message: 'Failed to create product' });
    }
  }
}