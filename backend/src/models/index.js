import Game from './Game.js';
import Product from './Product.js';
import Provider from './Provider.js';
import User from './User.js';

Game.hasMany(Product, {
    foreignKey: 'game_id',
    as: 'products'
});

Product.belongsTo(Game, {
    foreignKey: 'game_id',
    as: 'game'
});

Provider.hasMany(Product, {
    foreignKey: 'provider_id',
    as: 'products'
});

Product.belongsTo(Provider, {
    foreignKey: 'provider_id',
    as: 'provider'
});

export {
    Game,
    Product,
    Provider,
    User
};