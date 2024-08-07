import mongoose, { Schema } from "mongoose";

const homeworkSchema = new Schema(
    {
        subject: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: 'Teacher'
        },
        standard: {
            type: Number,
            required: true
        },
        division: {
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

export const Homework = mongoose.model("Homework", homeworkSchema)