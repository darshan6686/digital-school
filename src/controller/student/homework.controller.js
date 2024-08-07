import mongoose from "mongoose";
import { Homework } from "../../model/homework.model.js";
import { Student} from "../../model/student.model.js"
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asynchandler } from "../../utils/asyncHandler.js";


const getStudentAllHomework = asynchandler(async(req,res) => {

    const student = await Student.findById(req.student?._id)

    const homeworks = await Homework.aggregate([
        {
            $match: {
                standard: student.standard,
                division: student.devision,
                isDelete: false
            }
        },
        {
            $lookup: {
                from: 'teachers',
                localField: 'teacher',
                foreignField: '_id',
                as: 'teacher',
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
            $unwind: '$teacher'
        },
        {
            $project: {
                isDelete: 0
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            homeworks,
            "Student All homework fetched successfully"
        )
    )
})


const getStudentHomeworkById = asynchandler(async(req,res) => {
    const { homeworkId } = req.params

    const homework = await Homework.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(homeworkId)
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
            $project: {
                isDelete: 0
            }
        },
        {
            $unwind: "$teacher"
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            homework,
            "Student Homework fetched successfully"
        )
    )
})


const homeworkBySubject = asynchandler(async(req,res) => {
    const { subject } = req.body

    const student = await Student.findById(req.student?._id)

    const homework = await Homework.aggregate([
        {
            $match: {
                standard: student.standard,
                division: student.devision,
                subject: subject,
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
            $project: {
                isDelete: 0
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            homework,
            "Homework list fetched successfully"
        )
    )
})


export {
    getStudentAllHomework,
    getStudentHomeworkById,
    homeworkBySubject
}