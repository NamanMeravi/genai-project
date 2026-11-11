import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username already taken"],
        required: true
    },

    email: {
        type: String,
        unique: [true, "email already taken"],
        required: true
    },
    password: {
        type: String,
        required: true
    }

})

export const User = mongoose.model("users",UserSchema)