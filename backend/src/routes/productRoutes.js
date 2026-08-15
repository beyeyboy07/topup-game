import express from 'express';



import { getProducts, getProduct, createProductdata, updateProductData, deleteProductData } from "../controllers/productController.js";


const router = express.Router();


router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', createProductdata);
router.put('/:id', updateProductData);
router.delete('/:id', deleteProductData);


export default router;
