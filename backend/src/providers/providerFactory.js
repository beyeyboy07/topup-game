import { mockProvider } from './mockProvider.js';
import { providerA } from './providerA.js';


export const getProvider = (providerCode) => {

    if (providerCode === 'MOCK') {
        return mockProvider;
    }


    if (providerCode === 'PROVIDER_A1') {
        return providerA;
    }


    throw new Error(
        `Provider ${providerCode} not supported`
    );

};