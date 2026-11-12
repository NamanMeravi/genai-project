import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
 
import jwt from 'jsonwebtoken'
 

export const signup = async(req,res,next)=>{
    try {
        const {username,email,password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({
            message:"Please provide all field"
        })
    }

    const userexist = await User.findOne({
        $or:[{username},{email}]
    });

    if(userexist){
        return res.status(500).json({
            message:"user already exist"
        })
    }

    const hash = await bcrypt.hash(password,10);

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
    } catch (error) {
        console.log(error, "error in signup controller");
        
    }

}


export const login = async(req,res,next)=>{
  try {
      
    const {email,password} = req.body;

    const user = await User.findOne({email});

    if(!user){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }


    const isPasswordValid = await bcrypt.compare(password,user.password);
    
    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }

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


  } catch (error) {
    console.log(error, "error in login controller");
    
  }
}


