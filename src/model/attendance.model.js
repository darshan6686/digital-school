import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema(
    {
        studentId: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "Teacher",
            required: true
        },
        attendance: [
            {
                date: {
                    type: Date,
                    required: true
                },
                status: {
                    type: String,
                    enum: ["Present", "Absent"],
                    required: true
                }
            }
        ],
        isDelete: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

export const Attendance = mongoose.model("Attendance", attendanceSchema)