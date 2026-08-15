import {
    getAllGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame
} from '../services/gameService.js'


export const getGames = async (req, res) => {
    try {
        const games = await getAllGames();

        res.json({
            succes : true,
            data: games
        });

    } catch (error) {
        
        console.error(error);

        res.status(500).json({
            succes: false,
            message: 'Failed get games'
        });

    }
}


export const getGame = async (req, res) => {

    try {
        
        const game = await getGameById(req.params.id);

        if(!game){
            res.status(400).json({
                succes: false,
                message: "game not found"
            })
        }

        res.json({
            succes: true,
            data: game
        });

    } catch (error) {
        
        console.error(error);

    }
}


export const createGameData = async (req, res) => {
    
    try {
        
        const game = await createGame(req.body);

        res.status(201).json({
            succes: true,
            message: "Game created succesfully",
            daata: game
        })


    } catch (error) {
        
        console.error(error);

        res.status(500).json({
            succes: false,
            message: "Failed created game"
        })
        
    }
}


export const updateGameData = async (req, res) => {
    try {
        const game = await updateGame(
            req.params.id,
            req.body
        );

        if (!game) {
            return res.status(404).json({
                success: false,
                message: 'Game not found'
            });
        }

        res.json({
            success: true,
            message: 'Game updated successfully',
            data: game
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Failed to update game'
        });
    }
};



export const deleteGameData = async (req, res) => {

    try {
        
        const game = await deleteGame(req.params.id);


        if(!game){

            res.status(400).json({
                succes: false,
                message: 'Game not found'
            });
        }


        res.json({
            succes: true,
            message: 'Game deleted succesfully'
        })

    } catch (error) {
        
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Failed to delete game'
        });

    }
}