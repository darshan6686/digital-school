import mongoose from "mongoose";
import { Transport } from "../../model/transport.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js"
import { asynchandler } from "../../utils/asyncHandler.js";
import { Student } from "../../model/student.model.js";


const addStudentInTransport = asynchandler(async(req,res) => {
    const { studentGrNumber, busNumber, busRoute, busStop, busDriverName, busDriverContact} = req.body

    if ([studentGrNumber, busNumber, busRoute, busStop, busDriverName, busDriverContact]
        .some(field => field.trim() === "")) {
        throw new ApiError(400, "All field is required")
    }

    const student = await Student.findOne({
        grNumber: studentGrNumber
    })

    if (!student) {
        throw new ApiError(404, "This student not found")
    }

    const existedStudent = await Transport.findOne({
        studentGrNumber,
        isDelete: false
    })

    if (existedStudent) {
        throw new ApiError(400, "student already existed")
    }

    const transport = await Transport.create({
        studentGrNumber,
        busNumber,
        busRoute,
        busStop,
        busDriverName,
        busDriverContact
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            transport,
            "Student added successfully"
        )
    )
})


const getAllStudent = asynchandler(async(req,res) => {
    const { page = 1, limit = 10} = req.query

    const transports = await Transport.aggregate([
        {
            $match: {
                isDelete: false
            }
        },
        {
            $lookup: {
                from: "students",
                localField: "studentGrNumber",
                foreignField: "grNumber",
                as: "studentGrNumber",
                pipeline: [
                    {
                        $project: {
                            grNumber: 1,
                            firstName: 1,
                            middleName: 1,
                            lastName: 1,
                            address: 1,
                            city: 1,
                            standard: 1,
                            devision: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$studentGrNumber"
        },
        {
            $project: {
                isDelete: 0
            }
        },
        {
            $skip: parseInt(page - 1) * parseInt(limit)
        },
        {
            $limit: parseInt(limit)
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
            transports,
            "Transports data fetched successfully"
        )
    )
})


const getTransportStudentById = asynchandler(async(req,res) => {
    const { transportId } = req.params

    const transport = await Transport.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(transportId)
            }
        },
        {
            $lookup: {
                from: "students",
                localField: "studentGrNumber",
                foreignField: "grNumber",
                as: "studentGrNumber",
                pipeline: [
                    {
                        $project: {
                            grNumber: 1,
                            firstName: 1,
                            middleName: 1,
                            lastName: 1,
                            address: 1,
                            city: 1,
                            standard: 1,
                            devision: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$studentGrNumber"
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
            transport,
            "Transport fetched suucessfully"
        )
    )
})


const updateTransport = asynchandler(async(req,res) => {
    const { transportId } = req.params
    const { studentGrNumber, busNumber, busRoute, busStop, busDriverName, busDriverContact} = req.body

    if (!transportId) {
        throw new ApiError(400, "transportId is missing")
    }

    if ([studentGrNumber, busNumber, busRoute, busStop, busDriverName, busDriverContact]
        .some(field => field.trim() === "")) {
        throw new ApiError(400, "All field is required")
    }
    
    const transport = await Transport.findByIdAndUpdate(
        transportId,
        {
            $set: {
                studentGrNumber,
                busNumber,
                busRoute,
                busStop,
                busDriverName,
                busDriverContact
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
            transport,
            "Transport student data updated successfully"
        )
    )
})


const deleteTransport = asynchandler(async(req,res) => {
    const { transportId } = req.params

    if (!transportId) {
        throw new ApiError(400, "transportId is missing")
    }

    await Transport.findByIdAndUpdate(
        transportId,
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
            "Student data deleted in transport"
        )
    )
})


const getTransportByBusNumber = asynchandler(async(req,res) => {
    const { busNumber } = req.body
    const { page = 1, limit = 10} = req.query

    if (!busNumber) {
        throw new ApiError(400, "student grNumber is required")
    }

    const transport = await Transport.aggregate([
        {
            $match: {
                busNumber: busNumber,
                isDelete: false
            }
        },
        {
            $lookup: {
                from: "students",
                localField: "studentGrNumber",
                foreignField: "grNumber",
                as: "studentGrNumber",
                pipeline: [
                    {
                        $project: {
                            grNumber: 1,
                            firstName: 1,
                            middleName: 1,
                            lastName: 1,
                            address: 1,
                            city: 1,
                            standard: 1,
                            devision: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$studentGrNumber"
        },
        {
            $project: {
                isDelete: 0
            }
        },
        {
            $skip: parseInt(page - 1) * parseInt(limit)
        },
        {
            $limit: parseInt(limit)
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
            transport,
            "transport fetched successfully"
        )
    )
})


export {
    addStudentInTransport,
    getAllStudent,
    getTransportStudentById,
    updateTransport,
    deleteTransport,
    getTransportByBusNumber
}