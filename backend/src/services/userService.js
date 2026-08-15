import { User } from "../models/index.js";

// Import bcrypt untuk melakukan hashing password
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


/**
 * Membuat user baru
 *
 * @param {Object} data - Data user dari request
 * @returns {Object} User yang berhasil dibuat
 */

export const createUser = async (data) => {

    //cek email udah digunain atau belom
    const existinguser = await User.findOne({
        where: {
            email: data.email
        }
    })


    //jika email udah ada stop
    if(existinguser){
        throw new Error('Email already registered')
    }


    //hash pasword sebelum di simpen
    const hashedPassword = await bcrypt.hash(data.password, 10);

    //buat user baru
    const user = await User.create({
        name: data.name,
        email: data.email,

        //pake password yang udah di hasj
        password: hashedPassword,

          // User yang register dari website
        // otomatis menjadi CUSTOMER
        role: 'CUSTOMER',

        status: 0
    });

    const result = user.toJSON();

    delete result.passowrd;

    return result;

}


/**
 * Login user
 *
 * @param {string} email
 * @param {string} password
 * @returns {Object} User dan JWT token
 */



export const loginUser = async (email, password)=> {

    const user = await User.findOne({
        where: {
            email: email
        }
    })

    if(!user){
        throw new Error('Invalid email or password');
    }

    if(user.status == 1){
        throw new Error('User still active');
    }

    //bandingkan password yang di kirim dengan yang sudah di encrypt di db
    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if(!passwordMatch){
        throw new Error("Invalid email or password");
    }

    // Buat payload yang akan disimpan di dalam JWT
    const payload = {
        id: user.id,
        role: user.role
    }

    // Buat JWT token
    const token = jwt.sign(
        payload,

        // Secret key untuk menandatangani token
        process.env.JWT_SECRET,

        //token berlaku selama 1 hari

        {
            expiresIn: '1d'
        }

    )


    const result = user.toJSON();

    delete result.password;

    return {
        user: result,
        token: token
    };
}


export const getUserById = async (id) => {

    // cari user berdasarkan id 
    const user = await User.findByPk(id);

    //user ga nemu
    if(!user){
        return null;
    }

    // Convert Sequelize object menjadi object biasa
    const result = user.toJSON();

     // Jangan kirim password
    delete result.password;

    return result;


}