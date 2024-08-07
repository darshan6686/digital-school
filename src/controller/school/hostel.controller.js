import mongoose from "mongoose";
import { Hostel } from "../../model/hostel.model.js";
import { Student } from "../../model/student.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asynchandler } from "../../utils/asyncHandler.js";


const addHostel = asynchandler(async(req,res) => {
    const { hostelName, hostelPhone, hostelManager, roomNo} = req.body

    if (!(hostelName && hostelPhone && hostelManager && roomNo)) {
        throw new ApiError(400, "All field is required")
    }

    const existedHostel = await Hostel.findOne({
        hostelName,
        roomNo,
        isDelete: false
    })

    if (existedHostel) {
        throw new ApiError(400, "This room number alrady existed")
    }

    const hostel = await Hostel.create({
        hostelName,
        hostelPhone,
        hostelManager,
        roomNo
    })

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            hostel,
            "Hostel added successfully"
        )
    )
})


const getAllhostel = asynchandler(async(req,res) => {
    const { page = 1, limit = 10 } = req.query

    const hostels = await Hostel.aggregate([
        {
            $match: {
                isDelete: false
            }
        },
        {
            $lookup: {
                from: 'students',
                localField: 'students',
                foreignField: '_id',
                as: 'students',
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
            $skip: parseInt(page - 1) * parseInt(limit)
        },
        {
            $limit: parseInt(limit)
        },
        {
            $sort: {
                roomNo: 1
            }
        },
        {
            $project: {
                isDelete: 0
            }
        },
        {
            $addFields: {
                numOfStudent: {
                    $cond: {
                        if: { $isArray: "$students" },
                        then: { $size: "$students" },
                        else: 0
                    }
                }
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            hostels,
            "Hostel data fetched successfully"
        )
    )
})


const getHostelById = asynchandler(async(req,res) => {
    const {hostelId} = req.params

    if (!hostelId) {
        throw new ApiError(400, "hostelId is missing")
    }

    const hostel = await Hostel.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(hostelId)
            }
        },
        {
            $lookup: {
                from: "students",
                localField: "students",
                foreignField: "_id",
                as: "students",
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
            $project: {
                isDelete: 0
            }
        },
        {
            $addFields: {
                numOfStudent: {
                    $cond: {
                        if: { $isArray: "$students" },
                        then: { $size: "$students" },
                        else: 0
                    }
                }
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            hostel,
            "Hostel data fetched successfully"
        )
    )
})


const updateHostelDetails = asynchandler(async(req,res) => {
    const { hostelId } = req.params
    const { hostelName, hostelPhone, hostelManager, roomNo } = req.body

    if (!hostelId) {
        throw new ApiError(400, "hostelId is missing")
    }

    if (!(hostelName && hostelPhone && hostelManager && roomNo)) {
        throw new ApiError(400, "All field is required")
    }

    const hostel = await Hostel.findByIdAndUpdate(
        hostelId,
        {
            $set: {
                hostelName,
                hostelPhone,
                hostelManager,
                roomNo
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
            hostel,
            "Hostel details updated successfully"
        )
    )
})


const deleteHostel = asynchandler(async(req,res) => {
    const { hostelId } = req.params

    if (!hostelId) {
        throw new ApiError(400, "hostelId is missing")
    }

    await Hostel.findByIdAndUpdate(
        hostelId,
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
            "Hostel deleted successfully"
        )
    )
})


const addToStudent = asynchandler(async(req,res) => {
    const { hostelId } = req.params
    const { grNumber } = req.body

    if (!hostelId) {
        throw new ApiError(400, "hostelId is missing")
    }

    if (!grNumber) {
        throw new ApiError(400, "All field is required")
    }

    const hostel = await Hostel.findById(hostelId)

    if (!hostel) {
        throw new ApiError(404, "hostel not found")
    }

    const student = await Student.findOne({
        grNumber: grNumber
    })

    if (!student) {
        throw new ApiError(404, "student not found")
    }

    const existedStudent = await Hostel.findOne({
        _id: hostelId,
        students: student._id
    })

    if (existedStudent) {
        throw new ApiError(400, "student already existed from hostel")
    }

    const newStudent = await Hostel.findByIdAndUpdate(
        hostelId,
        {
            $push: {
                students: student._id
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
            newStudent,
            "Student added from hostel successfully"
        )
    )
})


const removeToStudent = asynchandler(async(req,res) => {
    const {hostelId, studentId} = req.params

    if (!(hostelId && studentId)) {
        throw new ApiError(400, "hostelId and studentId is missing")
    }

    await Hostel.findByIdAndUpdate(
        hostelId,
        {
            $pull: {
                students: studentId
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
            "Student removed from hostel successfully"
        )
    )
})


export {
    addHostel,
    getAllhostel,
    getHostelById,
    updateHostelDetails,
    deleteHostel,
    addToStudent,
    removeToStudent
}