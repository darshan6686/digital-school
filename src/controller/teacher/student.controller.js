import { Student } from "../../model/student.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asynchandler } from "../../utils/asyncHandler.js";


const addStudent = asynchandler(async(req,res) => {
    const {
        grNumber, 
        firstName,
        middleName,
        lastName, 
        dateOfBirth,
        gender,
        address,
        city,
        state,
        zipCode,
        standard,
        devision,
        mobileNumber,
        previousSchool,
        fatherFirstName,
        fatherMiddleName,
        fatherLastName, 
        profession,
        fatherMobileNumber,
        anuualIncome
    } = req.body

    if ([
        grNumber, 
        firstName,
        middleName,
        lastName, 
        dateOfBirth,
        gender,
        address,
        city,
        state,
        zipCode,
        standard,
        devision,
        mobileNumber,
        fatherFirstName,
        fatherMiddleName,
        fatherLastName, 
        profession,
        fatherMobileNumber,
        anuualIncome
    ].some((value) => value === undefined || value === null)
    ) {
        throw new ApiError(400, "All field is required")
    }

    const existedStudent = await Student.findOne({
        grNumber
    })

    if (existedStudent) {
        throw new ApiError(400, "This grNumber already existed")
    }

    const student = await Student.create({
        grNumber,
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        gender,
        address,
        city,
        state,
        zipCode,
        standard,
        devision,
        mobileNumber,
        previousSchool: previousSchool || "",
        fatherFirstName,
        fatherMiddleName,
        fatherLastName,
        profession,
        fatherMobileNumber,
        anuualIncome
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            student,
            "Student created successfully"
        )
    )

})


const getAllStudent = asynchandler(async(req,res) => {
    const { page = 1, limit = 10 } = req.query

    const students = await Student.aggregate([
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
                refreshToken: 0
            }
        }
    ])

    const totalStudent = await Student.countDocuments()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                totalStudent,
                students
            },
            "All students fetched successfully"
        )
    )
})


const getStudentById = asynchandler(async(req,res) => {
    const { studentId } = req.params

    if (!studentId) {
        throw new ApiError(400, "studentId is missing")
    }

    const student = await Student.findById(studentId).select(
        "-refreshToken"
    )

    if (!student) {
        throw new ApiError(404, "student not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            student,
            "Student fetched successfully"
        )
    )
})


const updateStudentDetails = asynchandler(async(req,res) => {
    const { studentId } = req.params

    const {
        grNumber, 
        firstName,
        middleName,
        lastName, 
        dateOfBirth,
        gender,
        address,
        city,
        state,
        zipCode,
        standard,
        devision,
        mobileNumber,
        previousSchool,
        fatherFirstName,
        fatherMiddleName,
        fatherLastName, 
        profession,
        fatherMobileNumber,
        anuualIncome
    } = req.body

    if ([
        grNumber, 
        firstName,
        middleName,
        lastName, 
        dateOfBirth,
        gender,
        address,
        city,
        state,
        zipCode,
        standard,
        devision,
        mobileNumber,
        fatherFirstName,
        fatherMiddleName,
        fatherLastName, 
        profession,
        fatherMobileNumber,
        anuualIncome
    ].some(value => value === undefined || value === null)
    ) {
        throw new ApiError(400, "All field is required")
    }

    if (!studentId) {
        throw new ApiError(400, "studentId is missing")
    }

    const student = await Student.findByIdAndUpdate(
        studentId,
        {
            $set: {
                grNumber,
                firstName,
                middleName,
                lastName,
                dateOfBirth,
                gender,
                address,
                city,
                state,
                zipCode,
                standard,
                devision,
                mobileNumber,
                fatherFirstName,
                fatherMiddleName,
                fatherLastName,
                profession,
                fatherMobileNumber,
                anuualIncome,
                previousSchool: previousSchool || ""
            }
        },
        {
            new: true
        }
    ).select(
        "-refreshToken"
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            student,
            "Student details updated successfully"
        )
    )
})


const deleteStudent = asynchandler(async(req,res) => {
    const { studentId } = req.params

    const student = await Student.findByIdAndDelete(
        studentId
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            null,
            "Student deleted successfully"
        )
    )
})


const searchStudent = asynchandler(async(req,res) => {
    const { search } = req.body

    const students = await Student.find(
        {
            $or: [
                { grNumber: { $regex: search, $options: "i" } },
                { firstName: { $regex: search, $options: "i" } },
                { middleName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } }
            ]
        }
    ).select(
        "-refershToken"
    )

    if (!students) {
        new ApiResponse(
            404,
            null,
            "Student not found"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            students,
            "Student fetched successfully"
        )
    )
})


export {
    addStudent,
    getAllStudent,
    getStudentById,
    updateStudentDetails,
    deleteStudent,
    searchStudent
}