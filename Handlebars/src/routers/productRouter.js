import { Router } from 'express';
import { productNotFound, prorductWasDeleted } from '../consts/index.js';
import { MemoryContainer } from '../Api/MemoryContainer.js';

const productRouter = Router();
const ProductApi = new MemoryContainer();

productRouter.get('/', (req, res) => {
  const response = ProductApi.getAll();

  if (!response) res.send({ error: productNotFound });

  res.render('partials/productos', { productos: response });
});

productRouter.post('/', (req, res) => {
  const product = req.body;
  ProductApi.saveProduct(product);

  res.redirect('/');
});

export { productRouter };
