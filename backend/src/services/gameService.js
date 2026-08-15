import { Game } from "../models/index.js";


export const getAllGames = async()=> {
    return await Game.findAll({
        order: [['id', 'DESC']]
    });
}


export const getGameById = async (id)=> {
    return await Game.findByPk(id);
}

export const createGame = async (data)=> {
    return await Game.create(data);
}

export const updateGame = async (id, data) => {
    const game = await Game.findByPk(id);

    if (!game) {
        return null;
    }

    await game.update(data);

    return game;
};


export const deleteGame = async (id)=> {
    const game = await Game.findByPk(id);

    if(!game){
        return null;
    }

    await game.destroy();

    return game;
}