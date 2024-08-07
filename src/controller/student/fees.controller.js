import mongoose from "mongoose";
import { Fee } from "../../model/fees.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asynchandler } from "../../utils/asyncHandler.js";


const getFees = asynchandler(async(req,res) => {
    const fees = await Fee.aggregate([
        {
            $match: {
                studentId: req.student?._id,
                isDelete: false
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $lookup: {
                from: 'students',
                localField: 'studentId',
                foreignField: "_id",
                as: "studentId"
            }
        },
        {
            $unwind: "$studentId"
        },
        {
            $project: {
                _id: 1,
                studentName: {
                    $concat: ["$studentId.firstName", " ", "$studentId.middleName", " ", "$studentId.lastName"]
                },
                standard: "$studentId.standard",
                devision: "$studentId.devision",
                amount: 1,
                paymentDate: 1,
                paymentMethod: 1,
                paymentStatus: 1
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            fees,
            "student fees fetched successfully"
        )
    )
})


const getFeesById = asynchandler(async(req,res) => {
    const { feeId } = req.params

    const fees = await Fee.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(feeId)
            }
        },
        {
            $lookup: {
                from: 'students',
                localField: 'studentId',
                foreignField: "_id",
                as: "studentId"
            }
        },
        {
            $unwind: "$studentId"
        },
        {
            $project: {
                _id: 1,
                studentName: {
                    $concat: ["$studentId.firstName", " ", "$studentId.middleName", " ", "$studentId.lastName"]
                },
                standard: "$studentId.standard",
                devision: "$studentId.devision",
                amount: 1,
                paymentDate: 1,
                paymentMethod: 1,
                paymentStatus: 1
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            fees,
            "fees fetched successfully"
        )
    )
})


export {
    getFees,
    getFeesById
}