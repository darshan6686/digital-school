import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const schoolSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        logo: {
            type: String
        },
        description: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

schoolSchema.pre("save", async function(next){
    if(!this.isModified("password")) return null

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

schoolSchema.methods.isCorrectPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

schoolSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SCRECT,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE
        }
    )
}

schoolSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SCRECT,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE
        }
    )
}

export const School = mongoose.model("School", schoolSchema)