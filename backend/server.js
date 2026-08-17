import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import sequelize from './src/config/database.js';
import { Game } from './src/models/index.js';
import gameRoutes from './src/routes/gameRoutes.js';
import productRoutes  from './src/routes/productRoutes.js';
import providerRoutes from './src/routes/providerRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js'
import authRoutes from './src/routes/authRoutes.js'
import adminRoutes from './src/routes/adminRoutes.js';

const app = express();
dotenv.config();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/games', gameRoutes);
app.use('/api/product', productRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use(
    '/api/admin',
    adminRoutes
);

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Top Up Game API is running'
    });
});

app.get('/test-games', async (req, res) => {
    try {
        const games = await Game.findAll();

        res.json({
            success: true,
            data: games
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Failed to get games'
        });
    }
});




const PORT = process.env.PORT || 4000;

const startServer = async () => {
    try {
        await sequelize.authenticate();

        console.log('Database connected');

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Unable to connect to database:', error);
    }
};
startServer();