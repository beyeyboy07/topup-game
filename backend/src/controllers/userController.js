import User from "../models/User.js";
import { createUser, loginUser, getUserById } from "../services/userService.js";


export const register = async (req, res) => {

    try {

        // Ambil data dari request
        const { name, email, password } = req.body;

        // Validasi data wajib
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required'
            });
        }

        // Kirim data yang sudah divalidasi ke service
        const user = await createUser({
            name,
            email,
            password
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: user
        });

    } catch (error) {

        console.error(error);

        if (error.message === 'Email already registered') {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to register user'
        });
    }
};


export const login = async (req, res) => {

    try {
        
        const {email, password} = req.body;

        //validasi input
        if(!email || !password){
            return res.status(400).json({
                success: true,
                message: 'Email or Password are required'
            })
        }

        // jalankan proses login di service

        const user = await loginUser(
            email,
            password
        )

        res.json({
            success: true,
            message: 'Login succesfully',
            data: user
        });
        

    } catch (error) {

        console.error(error);

        if(error.message == 'Invalid email or password'){

            return res.status(401).json({
                success: false,
                message: error.message
            });
        }

        if(error.message == 'User still active'){

            return res.status(403).json({
                success: false,
                message: error.message
            });
            
        }
        
    }

}


export const getMe = async (req, res) => {

    try {
        
        // req.user berasal dari authMiddleware
        //
        // Contoh:
        // req.user = {
        //     id: 1,
        //     role: 'CUSTOMER'
        // }

        const user = await getUserById (req.user.id);

        if(!User){
            return res.status(404).json({
                success: failed,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });

    } catch (error) {
        
        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Failed to get user'
        });

    }

}