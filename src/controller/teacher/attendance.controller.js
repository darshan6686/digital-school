import { json } from "express";
import { Attendance } from "../../model/attendance.model.js";
import { Student } from "../../model/student.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asynchandler } from "../../utils/asyncHandler.js";
import mongoose from "mongoose";


const addStudentInAttendance = asynchandler(async(req,res) => {
    const { grNumber } = req.body

    if (!grNumber) {
        throw new ApiError(400, "grNumber is required")
    }

    const student = await Student.findOne({
        grNumber
    })

    if (!student) {
        throw new ApiError(404, "Student not found")
    }

    const attendance =  await Attendance.create({
        studentId: student._id,
        teacher: req.teacher?._id
    })

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            attendance,
            "Student added to attendance"
        )
    )
})


const getAllAttendance = asynchandler(async(req,res) => {
    const attendance = await Attendance.aggregate([
        {
            $match: {
                teacher: req.teacher?._id,
                isDelete: false
            }
        },
        {
            $lookup: {
                from: "students",
                localField: "studentId",
                foreignField: "_id",
                as: "studentId",
                pipeline: [
                    {
                        $project: {
                            grNumber: 1,
                            firstName: 1,
                            middleName: 1,
                            lastName: 1,
                            standard: 1,
                            devision: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$studentId"
        },
        {
            $lookup: {
                from: "teachers",
                localField: "teacher",
                foreignField: "_id",
                as: "teacher",
                pipeline: [
                    {
                        $project: {
                            name: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$teacher"
        },
        {
            $sort:{
                createdAt: -1
            }
        },
        {
            $project: {
                isDelete: 0
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            attendance,
            "Attendance data fetched successfully"
        )
    )
})


const getAttendanceById = asynchandler(async(req,res) => {
    const { attandanceId } = req.params

    if (!attandanceId) {
        throw new ApiError(400, "attendanceId is missing")
    }

    const attendance = await Attendance.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(attandanceId)
            }
        },
        {
            $lookup: {
                from: "teachers",
                localField: "teacher",
                foreignField: "_id",
                as: "teacher",
                pipeline: [
                    {
                        $project: {
                            name: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$teacher"
        },
        {
            $lookup: {
                from: "students",
                localField: "studentId",
                foreignField: "_id",
                as: "studentId",
                pipeline: [
                    {
                        $project: {
                            grNumber: 1,
                            firstName: 1,
                            middleName: 1,
                            lastName: 1,
                            standard: 1,
                            devision: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$studentId"
        },
        {
            $addFields: {
                attendance: {
                    $sortArray: {
                        input: "$attendance",
                        sortBy: { date: 1 }
                    }
                }
            }
        },
        {
            $project: {
                isDelete: 0
            }
        },
        {
            $addFields: {
                paresentDay: {
                    $size: {
                        $filter: {
                            input: "$attendance",
                            cond: {
                                $eq: ["$$this.status", "Present"]
                            }
                        }
                    }
                },
                absentDay: {
                    $size: {
                        $filter: {
                            input: "$attendance",
                            cond: {
                                $eq: ["$$this.status", "Absent"]
                            }
                        }
                    }
                },
                totalDay: {
                    $size: "$attendance"
                }
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            attendance,
            "Attendance data fetched successfully",
        )
    )
})


const deleteAttendance = asynchandler(async(req,res) =>  {
    const { attandanceId } = req.params
    
    if (!attandanceId) {
        throw new ApiError(400,  "attandanceId is missing")
    }

    const attandance = await Attendance.findByIdAndUpdate(
        attandanceId,
        {
            $set: {
                isDelete: true
            }
        },
        {
            new: true
        }
    )

    if (!attandance) {
        throw new ApiError(404, "canot delete this attandance")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "student attandance details deleted successfully"
        )
    )
})


const addAttendance = asynchandler(async(req,res) => {
    const { attendanceId } = req.params
    const { date, status } = req.body

    if (!attendanceId) {
        throw new ApiError(400, "attendnaceId is missing")
    }

    if (!(date && status)) {
        throw new ApiError(400, "All field is required")
    }

    const attendance = await Attendance.findById(attendanceId)

    if (!attendance) {
        throw new ApiError(404, "attandance details not found")
    }

    const existedAttendance = await Attendance.findOne({
        _id: attendanceId,
        "attendance.date": date
    })

    if (existedAttendance) {
        throw new ApiError(400, "Attendance already existed")
    }

    const newAttendance = await Attendance.findByIdAndUpdate(
        attendanceId,
        {
            $push: {
                attendance: {
                    date,
                    status
                }
            }
        },
        {
            new: true
        }
    )

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            newAttendance,
            "student attendance added succesfully"
        )
    )
})


const updateAttendance = asynchandler(async(req,res) => {
    const { attendanceId } = req.params
    const { status, date } = req.body

    if (!(date && status)) {
        throw new ApiError(400, "All field is required")
    }

    const attendance = await Attendance.findOneAndUpdate(
        {
            _id: attendanceId,
            "attendance.date": date
        },
        {
            $set: {
                "attendance.$.status": status
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            attendance,
            "Attendance updated successfully"
        )
    )
})


const removeAttendance = asynchandler(async(req,res) => {
    const { attendanceId } = req.params
    const { date } = req.body

    if (!date) {
        throw new ApiError(400, "date is required")
    }

    const attandance = await Attendance.findByIdAndUpdate(
        attendanceId,
        {
            $pull: {
                attendance: {
                    date: date
                }
            }
        },
        {
            new: true
        }
    )

    if (!attandance) {
        throw new ApiError(404, "This date is not in attendace")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Attendance removed successfully"
        )
    )
})


const getAttendanceByDate = asynchandler(async(req,res) => {
    const { date } = req.body

    if (!date) {
        throw new ApiError(400, "All field is required")
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const attendance = await Attendance.aggregate([
        {
            $match: {
                "attendance.date": {
                    $gte: startDate,
                    $lte: endDate
                },
                teacher: req.teacher?._id,
                isDelete: false
            }
        },
        {
            $lookup: {
                from: "students",
                localField: "studentId",
                foreignField: "_id",
                as: "studentId",
                pipeline: [
                    {
                        $project: {
                            grNumber: 1,
                            firstName: 1,
                            middleName: 1,
                            lastName: 1,
                            standard: 1,
                            devision: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$studentId"
        },
        {
            $lookup: {
                from: "teachers",
                localField: "teacher",
                foreignField: "_id",
                as: "teacher",
                pipeline: [
                    {
                        $project: {
                            name: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$teacher"
        },
        {
            $addFields: {
                attendance: {
                    $sortArray: {
                        input: "$attendance",
                        sortBy: { date: 1 }
                    }
                }
            }
        },
        {
            $project: {
                isDelete: 0
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            attendance,
            "Attendance fetched successfully"
        )
    )
})


const getAttendanceByStudent = asynchandler(async(req,res) => {
    const {grNumber} = req.body

    if (!grNumber) {
        throw new ApiError(400, "grNumber is required")
    }

    const student = await Student.findOne({
        grNumber
    })

    if (!student) {
        throw new ApiError(404, "Student not registed")
    }

    const attendance = await Attendance.aggregate([
        {
            $match: {
                studentId: student._id,
                isDelete: false
            }
        },
        {
            $lookup: {
                from: "teachers",
                localField: "teacher",
                foreignField: "_id",
                as: "teacher",
                pipeline: [
                    {
                        $project: {
                            name: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$teacher"
        },
        {
            $lookup: {
                from: "students",
                localField: "studentId",
                foreignField: "_id",
                as: "studentId",
                pipeline: [
                    {
                        $project: {
                            grNumber: 1,
                            firstName: 1,
                            middleName: 1,
                            lastName: 1,
                            standard: 1,
                            devision: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$studentId"
        },
        {
            $addFields: {
                attendance: {
                    $sortArray: {
                        input: "$attendance",
                        sortBy: { date: 1 }
                    }
                }
            }
        },
        {
            isDelete: 0
        },
        {
            $addFields: {
                paresentDay: {
                    $size: {
                        $filter: {
                            input: "$attendance",
                            cond: {
                                $eq: ["$$this.status", "Present"]
                            }
                        }
                    }
                },
                absentDay: {
                    $size: {
                        $filter: {
                            input: "$attendance",
                            cond: {
                                $eq: ["$$this.status", "Absent"]
                            }
                        }
                    }
                },
                totalDay: {
                    $size: "$attendance"
                }
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            attendance,
            "Attendance data fetched successfully"
        )
    )
})


const getAttendanceByMonth = asynchandler(async(req,res) => {
    const { month, year} = req.body

    if (!(month && year)) {
        throw new ApiError(400, "month and year field is required")
    }

    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 1)

    const attendance = await Attendance.aggregate([
        {
            $match: {
                "attendance.date": {
                    $gte: startDate,
                    $lte: endDate
                },
                teacher: req.teacher?._id,
                isDelete: false
            }
        },
        {
            $lookup: {
                from: "students",
                localField: "studentId",
                foreignField: "_id",
                as: "studentId",
                pipeline: [
                    {
                        $project: {
                            grNumber: 1,
                            firstName: 1,
                            middleName: 1,
                            lastName: 1,
                            standard: 1,
                            devision: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$studentId"
        },
        {
            $lookup: {
                from: "teachers",
                localField: "teacher",
                foreignField: "_id",
                as: "teacher",
                pipeline: [
                    {
                        $project: {
                            name: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$teacher"
        },
        {
            $addFields: {
                attendance: {
                    $sortArray: {
                        input: "$attendance",
                        sortBy: { date: 1 }
                    }
                }
            }
        },
        {
            isDelete: 0
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            attendance,
            "Attendance fetched successsfully by the month"
        )
    )
})


export {
    addStudentInAttendance,
    getAllAttendance,
    getAttendanceById,
    deleteAttendance,
    addAttendance,
    updateAttendance,
    removeAttendance,
    getAttendanceByDate,
    getAttendanceByStudent,
    getAttendanceByMonth,
}