/**
 * Middleware untuk membatasi akses berdasarkan role user.
 *
 * @param  {...string} allowedRoles - Role yang diperbolehkan
 */


export const authorize  = (... allowedRoles) => {

    return (req, res, next) => {
        // req.user berasal dari authenticate middleware.
        //
        // Contoh:
        // req.user = {
        //     id: 4,
        //     role: 'CUSTOMER'
        // }

        if (!req.user){
            
            return res.status(401).json({
                succes : false,
                message: 'Unauthorized'
            })

        }

        // Cek apakah role user diperbolehkan
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                succes: false,
                message: 'Forbiden'
            })
        }
        
        // Role sesuai → lanjut ke controller
        next();
    }
}