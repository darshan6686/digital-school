import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"

const studentSchema = new Schema(
    {
        grNumber: {
            type: String,
            required: true,
            unique: true
        },
        firstName: {
            type: String,
            required: true
        },
        middleName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        dateOfBirth: {
            type: Date,
            required: true
        },
        gender: {
            type: String,
            required: true,
            eunm: ["male", "female", "other"]
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        standard: {
            type: Number,
            required: true
        },
        devision: {
            type: String,
            required: true
        },
        mobileNumber: {
            type: Number,
            required: true
        },
        previousSchool: {
            type: String
        },
        fatherFirstName: {
            type: String,
            required: true
        },
        fatherMiddleName: {
            type: String,
            required: true
        },
        fatherLastName: {
            type: String,
            required: true
        },
        profession: {
            type: String,
            required: true
        },
        fatherMobileNumber: {
            type: Number,
            required: true
        },
        anuualIncome: {
            type: Number,
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

studentSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            grNumber: this.grNumber
        },
        process.env.ACCESS_TOKEN_SCRECT,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE
        }
    )
}

studentSchema.methods.generateRefreshToken = function() {
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

export const Student = mongoose.model("Student", studentSchema)