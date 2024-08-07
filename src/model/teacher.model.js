import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const teacherSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        admissionDate: {
            type: Date,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        qualifaction: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        previousSchool: {
            type: String
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

teacherSchema.pre("save", async function(next){
    if(!this.isModified("password")) return null

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

teacherSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

teacherSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SCRECT,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE
        }
    )
}

teacherSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SCRECT,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE
        }
    )
}

export const Teacher = mongoose.model("Teacher", teacherSchema)