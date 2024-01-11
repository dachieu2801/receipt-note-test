import { Request, Response } from 'express';

import receiptNoteModel from '../models/goodsReceiptNote'
import db from '../config/db'
const pool = db.pool()

export default {
  getAllReceiptNote: async (req: Request, res: Response) => {
    try {
      const result = await pool.query('SELECT * FROM goods_receipt_note');
      res.status(200).json(result.rows);
    } catch (err) {
      console.log('Error get all receipt-------------------------------', err);

      res.status(500).json({ message: 'Server Has Error' });
    }
  },
  getById: async (req: Request, res: Response) => {
    try {
      const { receipt_no } = req.params
      const results = await receiptNoteModel.getReceiptNotebyId(Number(receipt_no));
      if (results.length === 1) {
        res.status(200).json(results);
      } else {
        res.status(500).json({ message: 'Can\'t find receipt' });
      }
    } catch (err) {
      console.log('Error get receipt by receipt_no-------------------------------', err);
      res.status(500).json({ message: 'Server Has Error' });
    }
  },
  getReceiptNoteForm: async (req: Request, res: Response) => {
    res.render("goodsReceiptNote");
  },

  // createReceiptNote
  createReceiptNote: async (req: Request, res: Response) => {
    try {
      const { receiptNote, products } = req.body
      const results: any = await receiptNoteModel.createReceiptNote(receiptNote, products);
      console.log('result.........................................', results);
      if (results === 'create success') {
        res.status(200).json({ message: 'success' });
      } else {
        res.status(500).json(results.message);
      }
    } catch (error) {
      console.error('Error in createReceiptNote goodsReceiptNote-controller------------------', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}