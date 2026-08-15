import Provider from "../models/Provider.js";
import { getAllProvider, getProviderById, createProvider, updateProvider, deleteProvider } from "../services/providerService.js";

export const getProviders  = async (req, res) => {

    try {
        
        const providers = await Provider.findAll();

        res.json({
            succes: true,
            data: providers
        })

    } catch (error) {
     
        console.error(error);
        
        return res.status(500).json({
            succes: false,
            Message: 'Failed get all provider'
        })
        
    }
}

export const getProvider = async (req, res) => {

    try {
        
        const provider = await Provider.findByPk(req.params.id);

        if(!provider){

            return res.status(404).json({
                succes: false,
                message: 'Provider not found'
            });
        }
        
        res.json({
            succes: true,
            message: provider
        })

    } catch (error) {
        
        console.error(error);

        return res.status(500).json({
            succes: false,
            message: 'Failed to get provider'
        });
    }

}

export const createProviderData = async (req, res) => {

    try {
        
        const provider = createProvider(req.body);

        res.status(201).json({
            succes: true,
            message: 'Create provider success'
        });

    } catch (error) {
        
        console.error(error);

        return res.status(500).json({
            succes: false,
            message: 'Failed to crate provider'
        })

    }
}


export const updateProviderData = async (req, res) => {

    try {
        
        const provider = updateProvider(
            req.params.id,
            req.body
        );

        if(!provider){
            return res.status(404).json({
                succes: false,
                message: 'Provider not found'
            })
        }

        res.json({
            succes: true,
            message: 'Succes update provider'
        })
        
    } catch (error) {
        
        console.error(error);

        return res.status(500).json({
            succes: true,
            message: 'Failed update provider'
        })

    }

}

export const deleteProviderData = async (req, res) => {

    try {
        
        const provder = await Provider.deleteProvider(req.params.id);

        if(!provder){
            return res.status(404).json({
                succes: false,
                message: 'Provider not found'
            });
        }

        res.json({
            succes: true,
            message: 'Delete provider success'
        })

    } catch (error) {
        
        return res.status(500).json({
            succes: false,
            message: 'Failed delete provider'
        })
    }

}