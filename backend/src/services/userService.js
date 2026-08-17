import { User } from "../models/index.js";
import { Op } from 'sequelize';
// Import bcrypt untuk melakukan hashing password
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import User from '../models/User.js';
import Order from '../models/Order.js';

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



/**
 * Login user
 *
 * Alur:
 * 1. Cari user berdasarkan email
 * 2. Pastikan user aktif
 * 3. Bandingkan password
 * 4. Generate JWT
 * 5. Return token
 */
export const loginUser = async (email, password) => {

    // ========================================
    // 1. Cari user berdasarkan email
    // ========================================

    const user = await User.findOne({

        where: {
            email: email
        }

    });


    // ========================================
    // 2. User tidak ditemukan
    // ========================================

    if (!user) {

        throw new Error(
            'Invalid email or password'
        );

    }


    // ========================================
    // 3. Periksa status user
    // ========================================
    //
    // 1 = ACTIVE
    // 0 = INACTIVE
    //
    // User yang nonaktif tidak boleh login.

    if (user.status !== 1) {

        throw new Error(
            'User account is inactive'
        );

    }


    // ========================================
    // 4. Bandingkan password
    // ========================================
    //
    // Password dari request dibandingkan
    // dengan password hash yang ada di database.

    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );


    // ========================================
    // 5. Password salah
    // ========================================

    if (!passwordMatch) {

        throw new Error(
            'Invalid email or password'
        );

    }


    // ========================================
    // 6. Buat JWT
    // ========================================
    //
    // Data yang disimpan di dalam token:
    // - id
    // - role

    const token = jwt.sign(

        {
            id: user.id,
            role: user.role
        },

        process.env.JWT_SECRET,

        {
            expiresIn: '24h'
        }

    );


    // ========================================
    // 7. Return hasil login
    // ========================================

    return {

        token,

        user: {

            id: user.id,

            name: user.name,

            email: user.email,

            role: user.role,

            status: user.status

        }

    };

};


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


/**
 * Mengambil daftar user untuk Admin
 *
 * Fitur:
 * - Pagination
 * - Search nama
 * - Search email
 * - Filter status
 */
export const getAllUsersAdmin = async ({
    page = 1,
    limit = 10,
    search,
    status
} = {}) => {

    // ========================================
    // 1. Hitung offset
    // ========================================

    const offset = (page - 1) * limit;


    // ========================================
    // 2. Buat filter
    // ========================================

    const where = {};


    // ========================================
    // 3. Search nama / email
    // ========================================

    if (search) {

        where[Op.or] = [

            {
                name: {
                    [Op.like]: `%${search}%`
                }
            },

            {
                email: {
                    [Op.like]: `%${search}%`
                }
            }

        ];

    }


    // ========================================
    // 4. Filter status
    // ========================================

    if (status !== undefined) {

        where.status = status;

    }


    // ========================================
    // 5. Ambil data user
    // ========================================

    const result = await User.findAndCountAll({

        where,

        // Jangan pernah mengembalikan password
        // ke response API.

        attributes: [
            'id',
            'name',
            'email',
            'role',
            'status',
            'created_at',
            'updated_at'
        ],

        limit,

        offset,

        order: [
            ['id', 'DESC']
        ]

    });


    // ========================================
    // 6. Hitung total halaman
    // ========================================

    const totalPages = Math.ceil(
        result.count / limit
    );


    // ========================================
    // 7. Return hasil
    // ========================================

    return {

        data: result.rows,

        pagination: {

            page,

            limit,

            total: result.count,

            totalPages

        }

    };

};


/**
 * Mengambil detail user untuk Admin
 *
 * Data yang ditampilkan:
 * - Informasi user
 * - Jumlah order
 */
export const getUserByIdAdmin = async (id) => {

    // ========================================
    // 1. Cari user berdasarkan ID
    // ========================================

    const user = await User.findByPk(id, {

        // Password tidak boleh dikirim
        // ke response API.

        attributes: [
            'id',
            'name',
            'email',
            'role',
            'status',
            'created_at',
            'updated_at'
        ],

        // ========================================
        // Ambil order milik user
        // ========================================

        include: [
            {
                model: Order,
                as: 'orders',

                // Kita hanya membutuhkan ID
                // untuk menghitung jumlah order.

                attributes: [
                    'id'
                ]
            }
        ]

    });


    // ========================================
    // 2. User tidak ditemukan
    // ========================================

    if (!user) {

        return null;

    }


    // ========================================
    // 3. Ubah hasil Sequelize menjadi object
    // ========================================

    const userData = user.toJSON();


    // ========================================
    // 4. Hitung jumlah order
    // ========================================

    userData.total_orders =
        userData.orders.length;


    // ========================================
    // 5. Hapus detail order
    // ========================================
    //
    // Karena kita hanya membutuhkan jumlahnya,
    // array orders tidak perlu dikirim.

    delete userData.orders;


    // ========================================
    // 6. Return data
    // ========================================

    return userData;

};


/**
 * Mengubah status user oleh Admin
 *
 * Status:
 * 1 = ACTIVE
 * 0 = INACTIVE
 */
export const updateUserStatusAdmin = async (id, status) => {

    // ========================================
    // 1. Validasi status
    // ========================================
    //
    // Status yang diperbolehkan hanya:
    //
    // 1 = aktif
    // 0 = tidak aktif

    if (status !== 0 && status !== 1) {

        throw new Error('Invalid user status');

    }


    // ========================================
    // 2. Cari user
    // ========================================

    const user = await User.findByPk(id);


    if (!user) {

        return null;

    }


    // ========================================
    // 3. Update status
    // ========================================

    user.status = status;

    await user.save();


    // ========================================
    // 4. Return user
    // ========================================
    //
    // Password tidak dikembalikan.

    return await User.findByPk(id, {

        attributes: [
            'id',
            'name',
            'email',
            'role',
            'status',
            'created_at',
            'updated_at'
        ]

    });

};