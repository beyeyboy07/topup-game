import { Provider  } from "../models/index.js";




export const getAllProvider = async () => {

    const providers = await Provider.findAll({
        order: [['id', 'DESC']]
    });

    return providers;
}

export const getProviderById = async (id) => {

    const provider = await Provider.findByPk(id);

    if(!provider){
        return null;
    }

    return provider;

}

export const createProvider = async (data) => {
    const provider = await Provider.create(data);

    return provider;
};


export const updateProvider = async (id, data) => {

    const provider = await Provider.findByPk(id);

    if(!provider){
        return null;
    }

    await provider.update(data);

    return provider;

}


export const deleteProvider = async (id) => {
    const provider = await Provider.findByPk(id);

    if (!provider) {
        return null;
    }

    await provider.destroy();

    return provider;
};