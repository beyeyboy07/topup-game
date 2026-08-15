import express from 'express';

import { getProvider, getProviders, createProviderData, updateProviderData, deleteProviderData } from "../controllers/providerController.js";


const router = express.Router();

router.get('/', getProviders);
router.get('/:id', getProvider);
router.post('/', createProviderData);
router.put('/:id', updateProviderData);
router.delete('/:id', deleteProviderData);


export default router;