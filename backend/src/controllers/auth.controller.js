import { User } from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
 

export const signup = async()=>{
    const {username,email,password} = req.body;

    if(!username || !email || !password){
        return resizeBy.status(400).json({
            message:"Please provide all field"
        })
    }

    const userexist = await User.findOne({
        $or:[{username},{email}]
    });

    if(userexist){
        return resizeBy.status(500).json({
            message:"user already exist"
        })
    }

    const hash = await bcryptjs.hash(password,10);

    const user = await User.create({

        username,
        email,
        password:hash
    }
    )


    const token = jwt.sign({id:user._id,username:user.username},process.env.JWT_KEY,{
        expiresIn:"1d"
    })

    
    res.cookie("token",token);

    res.status(201).json({
        message:"User registered successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })




}