import { getAllProduct, getProductById, createProduct, updateProduct, deleteProduct } from "../services/productService.js";


export const getProducts = async (req, res) => {
    try {
        
        const products = await getAllProduct();

        
        res.json({
            succes: true,
            data: products
        });

    } catch (error) {
        
        console.error(error);
        return res.status(500).json({
            succes: false,
            message: 'Failed get data product'
        });

    }
}


export const getProduct = async (req, res) => {
    try {
        const product = await getProductById(req.params.id);

        console.log('RESULT:', product);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Failed get data product'
        });
    }
};


export const createProductdata = async (req, res) => {

  try {
    
    const product = createProduct(req.body);
    
    res.status(201).json({
        succes: true,
        messag: 'Product succesfully created'
    });

  } catch (error) {
    
    console.error(error)
    return res.status(400).json({
        succes: false,
        message : 'Failed created product'
    });

  }

}


export const updateProductData = async (req, res) => {
    try {
        const product = await updateProduct(
            req.params.id,
            req.body
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Failed to update product'
        });
    }
};


export const deleteProductData = async (req, res) => {
    try {
        
        const product = deleteProduct(req.params.id);

        if(!product){
            return res.status(404).json({
                succes: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            succes: true,
            message: "Product deleted succesfully"
        })

    } catch (error) {
        
        return res.status(500).json({
            succes: false,
            message: 'Delete product failed'
        })

    }
}