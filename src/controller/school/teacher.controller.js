import { Teacher } from "../../model/teacher.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asynchandler } from "../../utils/asyncHandler.js";


const addTeacher = asynchandler(async(req,res) => {
    const {name, admissionDate, email, password, phone, qualifaction, subject, dateOfBirth, address, previousSchool} = req.body

    if (!(name && admissionDate && email && password && phone && qualifaction && subject && dateOfBirth && address)) {
        throw new ApiError(400, "All field is required")
    }

    const existedTeacher = await Teacher.findOne({
        email
    })

    if (existedTeacher) {
        throw new ApiError(400, "Teacher with email already existed")
    }

    const teacher = await Teacher.create({
        name,
        admissionDate,
        email,
        password,
        phone,
        qualifaction,
        subject,
        dateOfBirth,
        address,
        previousSchool: previousSchool || null
    })

    const createdTeacher = await Teacher.findById(teacher._id).select(
        "-password -refreshToken"
    )

    if (!createdTeacher) {
        throw new ApiError(400, "something went wrong to create teacher")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            createdTeacher,
            "Teacher created successfully"
        )
    )
})


const getAllTeacher = asynchandler(async(req,res) => {
    const { page = 1, limit = 10} = req.query

    const teachers = await Teacher.aggregate([
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
        },
        {
            $project: {
                password: 0,
                refreshToken: 0
            }
        }
    ])

    const totalTeachers = await Teacher.countDocuments()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                totalTeachers,
                teachers
            },
            "All teachers fetched successfully"
        )
    )
})


const getTeacherById = asynchandler(async(req,res) => {
    const { teacherId } = req.params

    if (!teacherId) {
        throw new ApiError(400, "teacherId is missing")
    }

    const teacher = await Teacher.findById(teacherId).select(
        "-password -refreshToken"
    )

    if (!teacher) {
        throw new ApiError(404,"Teacher not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            teacher,
            "Teacher fetched successfully"
        )
    )
})


const searchTeacher = asynchandler(async(req,res) => {
    const {search} = req.body

    const teacher =await Teacher.find({
        $or: [
            {name: {$regex: search, $options: "i"}},
            {subject: {$regex: search, $options: "i"}}
        ]
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            teacher,
            "Teacher fetched successfully"
        )
    )
})


const deleteTeacher = asynchandler(async(req,res) => {
    const { teacherId } = req.params

    const teacher = await Teacher.findByIdAndDelete(
        teacherId
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            null,
            "Teacher deleted successfully"
        )
    )
})


export {
    addTeacher,
    getAllTeacher,
    getTeacherById,
    searchTeacher,
    deleteTeacher
}