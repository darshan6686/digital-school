import mongoose from "mongoose";
import { Fee } from "../../model/fees.model.js";
import { Student } from "../../model/student.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asynchandler } from "../../utils/asyncHandler.js";


const addFees = asynchandler(async(req,res) => {
    const { grNumber, amount, paymentDate, paymentMethod, paymentStatus } = req.body

    if (!(grNumber && amount && paymentDate && paymentMethod && paymentStatus)) {
        throw new ApiError(400, "All field is required")
    }

    const student = await Student.findOne({
        grNumber
    })

    if (!student) {
        throw new ApiError(404, "student not found")
    }

    const fees = await Fee.create({
        studentId: student._id,
        amount,
        paymentDate,
        paymentMethod: paymentMethod.toUpperCase(),
        paymentStatus: paymentStatus.toUpperCase()
    })

    return res
    .status(201)
    .json(
        new ApiResponse(
            200,
            fees,
            "Fees added successfully"
        )
    )
})


const getAllFees = asynchandler(async(req,res) => {
    const { page = 1, limit = 10} = req.query

    const fees = await Fee.aggregate([
        {
            $match: {
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
            $project: {
                isDelete: 0
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: parseInt(page - 1) * parseInt(limit)
        },
        {
            $limit: parseInt(limit)
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            fees,
            "Fees list fetched successfully"
        )
    )
})


const getFeesById = asynchandler(async(req,res) => {
    const { feeId } = req.params
    
    if (!feeId) {
        throw new ApiError(400, "feeId is missing")
    }

    const fees = await Fee.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(feeId)
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
            fees,
            "Fees data fetched successfully"
        )
    )
})


const updateFees = asynchandler(async(req,res) => {
    const { feeId } = req.params
    const { amount, paymentDate, paymentMethod, paymentStatus } = req.body

    if (!feeId) {
        throw new ApiError(400, "feeId is missing")
    }

    if (!(amount && paymentDate && paymentMethod && paymentStatus)) {
        throw new ApiError(400, "All field is required")
    }

    const fees = await Fee.findByIdAndUpdate(
        feeId,
        {
            $set: {
                amount,
                paymentDate,
                paymentMethod: paymentMethod.toUpperCase(),
                paymentStatus: paymentStatus.toUpperCase()
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
            fees,
            "Fees data updated successfully"
        )
    )
})


const deleteFees = asynchandler(async(req,res) => {
    const { feeId } = req.params

    if (!feeId) {
        throw new ApiError(400, "feeId is missing")
    }

    await Fee.findByIdAndUpdate(
        feeId,
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
            {},
            "Fees data deleted successfully"
        )
    )
})


const getAllFeesByClass = asynchandler(async(req,res) => {
    const { standard, devision } = req.body

    if (!(standard && devision)) {
        throw new ApiError(400, "standard and devision field is required")
    }

    const fees = await Fee.aggregate([
        {
            $match: {
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
            $match: {
                "studentId.standard": standard,
                "studentId.devision": devision
            }
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
            "Fees data fetched successfully"
        )
    )
})


export {
    addFees,
    getAllFees,
    getFeesById,
    updateFees,
    deleteFees,
    getAllFeesByClass
}