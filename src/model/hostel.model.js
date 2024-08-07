import mongoose, { Schema } from "mongoose";

const hostelSchema = new Schema(
    {
        hostelName: {
            type: String,
            required: true
        },
        hostelPhone: {
            type: Number,
            required: true
        },
        hostelManager: {
            type: String,
            required: true
        },
        roomNo: {
            type: Number,
            required: true
        },
        students: [{
            type: Schema.Types.ObjectId,
            ref: 'Student'
        }],
        isDelete: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

export const Hostel = mongoose.model("Hostel", hostelSchema)