import mongoose from "mongoose";
import { Homework } from "../../model/homework.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asynchandler } from "../../utils/asyncHandler.js";


const addHomework = asynchandler(async(req,res) => {
    const { subject, title, description, standard, division} = req.body

    if ([subject, title, description, standard, division]
        .some(field => field === undefined || field === null )) {
            throw new ApiError(400, "All field is required")
    }

    const homework = await Homework.create({
        subject,
        title,
        description,
        teacher: req.teacher._id,
        standard,
        division
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            homework,
            "Homework added successfully"
        )
    )
})


const getAllHomework = asynchandler(async(req,res) => {
    const homeworks = await Homework.aggregate([
        {
            $match: {
                teacher: req.teacher._id,
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
            $sort: {
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
            homeworks,
            "All homework fetched successfully"
        )
    )
})


const getHomeworkById = asynchandler(async(req,res) => {
    const { homeworkId } = req.params

    if (!homeworkId) {
        throw new ApiError(400, "homeworkId is missing")
    }

    const homework = await Homework.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(homeworkId)
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
            $unwind: "$teacher"
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
            homework,
            "Homework fetched successfully"
        )
    )
})


const updateHomework = asynchandler(async(req,res) => {
    const { homeworkId } = req.params
    const { subject, title, description, standard, division} = req.body

    if (!homeworkId) {
        throw new ApiError(400, "homeworkId is missing")
    }

    if (!(subject && title && description && standard && division)) {
        throw new ApiError(400, "All field is required")
    }

    const homework = await Homework.findByIdAndUpdate(
        homeworkId,
        {
            $set: {
                subject,
                title,
                description,
                standard,
                division
            }
        },
        {
            new: true
        }
    ).select(
        "-isDelete"
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            homework,
            "Homework updated successfully"
        )
    )
})


const deleteHomework = asynchandler(async(req,res) => {
    const { homeworkId } = req.params

    if (!homeworkId) {
        throw new ApiError(400, "homeworkId is missing")
    }

    await Homework.findByIdAndUpdate(
        homeworkId,
        {
            $set: {
                isDelete: true
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
            null,
            "Homework deleted successfully"
        )
    )
})


export {
    addHomework,
    getAllHomework,
    getHomeworkById,
    updateHomework,
    deleteHomework
}