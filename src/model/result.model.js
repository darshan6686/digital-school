import mongoose, { Schema } from "mongoose";

const resultSchema = new Schema(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "Teacher",
            required: true
        },
        subjects: [{
            subject: {
                type: String,
                required: true
            },
            totalMark: {
                type: Number,
                required: true
            },
            obtainedMark: {
                type: Number,
                required: true
            }
        }],
        totalMark: {
            type: Number,
            required: true
        },
        obtainedMark: {
            type: Number,
            required: true
        },
        percentage: {
            type: Number,
            required: true
        },
        grade: {
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

resultSchema.pre("validate", function(next){
    if(!this.isModified("obtainedMark")) return null

    const totalMark = this.totalMark
    const obtainedMark = this.obtainedMark
    const percentage = (obtainedMark / totalMark) * 100
    this.percentage = percentage

    if(percentage >= 90){
        this.grade = "A+"
    }
    else if(percentage >= 80){
        this.grade = "A"
    }
    else if(percentage >= 70){
        this.grade = "B"
    }
    else if(percentage >= 60){
        this.grade = "C"
    }
    else if(percentage >= 50){
        this.grade = "D"
    }
    else if(percentage >= 33){
        this.grade = "E"
    }
    else{
        this.grade = "F"
    }
    next()
})

export const Result = mongoose.model("Result", resultSchema)