import productController from '../controller/product'
import goodsReceiptNoteRoute from './goodsReceiptNote';

function route(app: any) {
  //test 
  app.post('/product', productController.createProduct);
  //recetpt
  app.use('/receipt', goodsReceiptNoteRoute)
  app.use('/', (req: any, res: any) => {
    res.status(200).send('Not Found');
  })
}

export default route;

