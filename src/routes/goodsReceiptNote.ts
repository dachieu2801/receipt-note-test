import express from 'express'
const router = express.Router();

import goodsReceiptNote from '../controller/goodsReceiptNote'

router.get('/get-receipt/:receipt_no', goodsReceiptNote.getById)
router.get('/get-allreceipt', goodsReceiptNote.getAllReceiptNote)
router.post('/creat-receipt', goodsReceiptNote.createReceiptNote)
router.get('/', goodsReceiptNote.getReceiptNoteForm)

export default router 