import mongoose, { Schema } from "mongoose";

const transportSchema = new Schema(
    {
        studentGrNumber: {
            type: String,
            required: true,
            unique: true
        },
        busNumber: {
            type: String,
            required: true
        },
        busRoute: {
            type: String,
            required: true
        },
        busStop: {
            type: String,
            required: true
        },
        busDriverName: {
            type: String,
            required: true
        },
        busDriverContact: {
            type: String,
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

export const Transport = mongoose.model("Transport", transportSchema)