import mongoose, { Schema } from "mongoose";

const feeSchema = new Schema(
    {
        studentId: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        paymentDate: {
            type: Date,
            required: true
        },
        paymentMethod: {
            type: String,
            enum: ["CASH", "UPI", "CHECK"],
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ["PAID", "UNPAID"],
            required: true
        },
        isDelete: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

export const Fee = mongoose.model("Fee", feeSchema)