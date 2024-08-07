import jwt from "jsonwebtoken"
import { Teacher } from "../../model/teacher.model.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { asynchandler } from "../../utils/asyncHandler.js"


const genarateAccessTokenAndRefreshToken = async(teacherId) => {
    try {
        const teacher = await Teacher.findById(teacherId)
        const accessToken = await teacher.generateAccessToken()
        const refreshToken = await teacher.generateRefreshToken()
        teacher.refreshToken = refreshToken
        await teacher.save({ validateBeforeSave: false})

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(400, "something went to wrong generate access and refresh token")
    }
}


const loginTeacher = asynchandler(async(req,res) => {
    const {email, password} = req.body

    if (!(email && password)) {
        throw new ApiError(400, "All field is required")
    }

    const teacher = await Teacher.findOne({
        email
    })

    if (!teacher) {
        throw new ApiError(400, "Teacher not found")
    }

    const isPasswordCorrect = await teacher.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid password")
    }

    const {accessToken, refreshToken} = await genarateAccessTokenAndRefreshToken(teacher._id)

    const loggedInTeacher = await Teacher.findById(teacher._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("teacherAccessToken", accessToken, options)
    .cookie("teacherRefreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                teacher: loggedInTeacher,
                accessToken,
                refreshToken
            },
            "Teacher logged in suucessfully"
        )
    )
})


const logoutTeacher = asynchandler(async(req,res) => {
    await Teacher.findByIdAndUpdate(
        req.teacher._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("teacherAccessToken", options)
    .clearCookie("teacherRefreshToken", options)
    .json(
        new ApiResponse(
            200,
            {},
            "Teacher logged out successfully"
        )
    )
})


const getCurrentTeacher = asynchandler(async(req,res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            req.teacher,
            "Teacher fetched successfully"
        )
    )
})


const refreshAccessToken = asynchandler(async(req,res) => {
    const incommingtoken = req.cookies?.teacherRefreshToken || req.body.teacherRefreshToken

    if (!incommingtoken) {
        throw new ApiError(400, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incommingtoken,
            process.env.REFRESH_TOKEN_SCRECT
        )

        const teacher = await Teacher.findById(decodedToken?._id)

        if (!teacher) {
            throw new ApiError(400, "Invalid refresh token")
        }

        if (incommingtoken !== teacher.refreshToken) {
            throw new ApiError(400, "Invalid refresh token or userd refresh token")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const {accessToken, refreshToken} = await genarateAccessTokenAndRefreshToken(teacher._id)

        return res
        .status(200)
        .cookie("teacherAccessToken", accessToken, options)
        .cookie("teacherRefreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken
                },
                "access token refreshed successfully"
            )
        )
        
    } catch (error) {
        throw new ApiError(400, "Invalid refresh token")
    }
})


const updateTeacherDetails = asynchandler(async(req,res) => {
    const {name, admissionDate, email, phone, qualifaction, subject, dateOfBirth, address, previousSchool} = req.body

    if (!(name && admissionDate && email && phone && qualifaction && subject && dateOfBirth && address)) {
        throw new ApiError(400, "All field is required")
    }

    const teacher = await Teacher.findByIdAndUpdate(
        req.teacher?._id,
        {
            $set: {
                name,
                admissionDate,
                email,
                phone,
                qualifaction,
                subject,
                dateOfBirth,
                address,
                previousSchool
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
            teacher,
            "Teacher details updated successfully"
        )
    )
})


const changeCurrentPassword = asynchandler(async(req,res) => {
    const {oldPassword, newPassword} = req.body

    if (!(oldPassword && newPassword)) {
        throw new ApiError(400, "All field is required")
    }

    const teacher = await Teacher.findById(req.teacher?._id)

    const isPasswordCorrect = await teacher.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid password")
    }

    teacher.password = newPassword
    await teacher.save({ validateBeforeSave: false })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Password changed successfully"
        )
    )
})


export {
    loginTeacher,
    logoutTeacher,
    getCurrentTeacher,
    refreshAccessToken,
    updateTeacherDetails,
    changeCurrentPassword
}