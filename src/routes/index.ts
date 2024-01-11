import productController from '../controller/product'
import goodsReceiptNoteRoute from './goodsReceiptNote';

function route(app: any) {
  //test 
  app.post('/product', productController.createProduct);

  //recetpt
  app.use('/receipt', goodsReceiptNoteRoute)

}

export default route;

