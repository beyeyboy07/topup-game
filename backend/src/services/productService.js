import { Product, Game, Provider } from "../models/index.js";


export const getAllProduct = async ()=> {
    const products = await Product.findAll({
        include: [
            {
                model: Game,
                as : 'game',
                attributes: ['id', 'name', 'slug']
            },
            {
                model: Provider,
                as: 'provider',
                attributes: ['id', 'name', 'code']
            }
        ],
        order: [['id', 'desc']]
    });

    return products;
}

export const getProductById = async (id) => {
    const product = await Product.findByPk(id, {
        include: [
            {
                model: Game,
                as: 'game',
                attributes: ['id', 'name', 'slug']
            },
            {
                model: Provider,
                as: 'provider',
                attributes: ['id', 'name', 'code']
            }
        ]
    });

    console.log('PRODUCT:', product);

    return product;
};


export const createProduct = async (data) => {
    return await Product.create(data);
}

export const updateProduct = async (id, data) => {
    const product = await Product.findByPk(id);

    if (!product) {
        return null;
    }

    await product.update(data);

    return product;
};

export const deleteProduct = async (id) => {
    const product = await Product.findByPk(id);

    if (!product){
        return null;
    }

    await product.destroy();

    return product;
}