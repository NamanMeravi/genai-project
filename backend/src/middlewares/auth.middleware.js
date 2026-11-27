import jwt from 'jsonwebtoken'
import { tokenBlacklistModel } from '../models/blacklist.model.js'


export const authUser= async(req, res, next)=> {
    const token = req.cookies?.token

    if (!token) {
        return res.status(401).json({
            message: "Token not provided."
        })
    }

    try {
        const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token })
        if (isTokenBlacklisted) {
            return res.status(401).json({
                message: "token is invalid"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY)

        req.user = decoded

        return next()
    } catch (error) {
        if (error.name !== 'JsonWebTokenError' && error.name !== 'TokenExpiredError') {
            return next(error)
        }
        return res.status(401).json({
            message: "Invalid token."
        })
    }

}