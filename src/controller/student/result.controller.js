import mongoose from "mongoose";
import { Result } from "../../model/result.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asynchandler } from "../../utils/asyncHandler.js";


const getResult = asynchandler(async(req,res) => {
    const result = await Result.aggregate([
        {
            $match: {
                student: req.student?._id,
                isDelete: false
            }
        },
        {
            $lookup:{
                from: 'students',
                localField: 'student',
                foreignField: '_id',
                as: 'student'
            }
        },
        {
            $unwind: "$student"
        },
        {
            $project: {
                _id: 1,
                student: {
                    $concat: ["$student.firstName", " ", "$student.middleName", " ", "$student.lastName"]
                },
                standard: "$student.standard",
                devision: "$student.devision",
                subjects: 1,
                totalMark: 1,
                obtainedMark: 1,
                percentage: 1,
                grade: 1
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            result,
            "student result data fetched successfully"
        )
    )
})


const getResultById = asynchandler(async(req,res) => {
    const { resultId } = req.params

    const result = await Result.aggregate([
        {
           $match: {
                _id: new mongoose.Types.ObjectId(resultId)
           }
        },
        {
            $lookup:{
                from: 'students',
                localField: 'student',
                foreignField: '_id',
                as: 'student'
            }
        },
        {
            $unwind: "$student"
        },
        {
            $project: {
                _id: 1,
                student: {
                    $concat: ["$student.firstName", " ", "$student.middleName", " ", "$student.lastName"]
                },
                standard: "$student.standard",
                devision: "$student.devision",
                subjects: 1,
                totalMark: 1,
                obtainedMark: 1,
                percentage: 1,
                grade: 1
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            result,
            "result data fetched successfully"
        )
    )
})


export {
    getResult,
    getResultById
}