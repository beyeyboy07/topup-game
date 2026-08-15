import Game from './Game.js';
import Product from './Product.js';
import Provider from './Provider.js';
import User from './User.js';
import Order from './Order.js';


// ========================================
// GAME ↔ PRODUCT
// ========================================

// Satu Game bisa memiliki banyak Product
//
// Contoh:
// Mobile Legends
// ├── 86 Diamonds
// ├── 172 Diamonds
// └── 257 Diamonds
Game.hasMany(Product, {
    foreignKey: 'game_id',
    as: 'products'
});


// Satu Product hanya dimiliki oleh satu Game
Product.belongsTo(Game, {
    foreignKey: 'game_id',
    as: 'game'
});


// ========================================
// PROVIDER ↔ PRODUCT
// ========================================

// Satu Provider bisa memiliki banyak Product
//
// Contoh:
// Digiflazz
// ├── ML86
// ├── ML172
// └── ML257
Provider.hasMany(Product, {
    foreignKey: 'provider_id',
    as: 'products'
});


// Satu Product menggunakan satu Provider
Product.belongsTo(Provider, {
    foreignKey: 'provider_id',
    as: 'provider'
});


// ========================================
// USER ↔ ORDER
// ========================================

// Satu User bisa memiliki banyak Order
//
// Contoh:
// User Budy
// ├── ORD-001
// ├── ORD-002
// └── ORD-003
User.hasMany(Order, {
    foreignKey: 'user_id',
    as: 'orders'
});


// Satu Order dimiliki oleh satu User
Order.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});


// ========================================
// PRODUCT ↔ ORDER
// ========================================

// Satu Product bisa digunakan oleh banyak Order
Product.hasMany(Order, {
    foreignKey: 'product_id',
    as: 'orders'
});


// Satu Order hanya membeli satu Product
Order.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product'
});


// ========================================
// EXPORT
// ========================================

export {
    Game,
    Product,
    Provider,
    User,
    Order
};