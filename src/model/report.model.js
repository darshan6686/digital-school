import mongoose, { Schema } from "mongoose";

const reportRoute = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
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

export const Report = mongoose.model("Report", reportRoute)