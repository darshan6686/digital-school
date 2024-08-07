import { Attendance } from "../../model/attendance.model.js";
import { Fee } from "../../model/fees.model.js";
import { Student } from "../../model/student.model.js";
import { Teacher } from "../../model/teacher.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asynchandler } from "../../utils/asyncHandler.js";


const getStudentAndTeacherData = asynchandler(async(req,res) =>  {
    const numberOfStudent = await Student.find().countDocuments()

    const numberOfTeacher = await Teacher.find().countDocuments()

    const totalEarning = await Fee.aggregate([
        {
            $match: {
                isDelete: false
            }
        },
        {
            $group: {
                _id: null,
                totalEarning: { $sum: "$amount" }
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                totalStudent: numberOfStudent,
                totalTeacher: numberOfTeacher,
                totalEarning: totalEarning[0].totalEarning
            },
            "Data fetched successfully"
        )
    )
})


const getBoysandGirls = asynchandler(async(req,res) => {
    const boys = await Student.find({ gender: "male" }).countDocuments()

    const girls = await Student.find({ gender: "female" }).countDocuments()

    const total = boys + girls

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                boys,
                girls,
                total
            },
            "Data fetched successfully"
        )
    )
})


const getAttendanceByDate = asynchandler(async(req,res) => {
    const { date } = req.body

    if (!date) {
        throw new ApiError(400, "Date field is required")
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999)

    const attendanceData = await Attendance.aggregate([
        {
            $unwind: "$attendance"
        },
        {
            $match: {
                "attendance.date": {
                    $gte: startDate,
                    $lte: endDate
                },
                isDelete: false
            }
        }
    ])

    const result = attendanceData.reduce((acc, index) => {
        if (index.attendance.status === "Present") {
            acc.present++
        } 
        else if (index.attendance.status === "Absent") {
            acc.absent++
        }
        return acc
    }, { present: 0, absent: 0 })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            result,
            "Attendance fetched successfully"
        )
    )
})


export {
    getStudentAndTeacherData,
    getBoysandGirls,
    getAttendanceByDate
}