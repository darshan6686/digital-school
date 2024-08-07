import jwt from "jsonwebtoken"
import { Student } from "../../model/student.model.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { asynchandler } from "../../utils/asyncHandler.js"


const generateAccessTokenAndRefreshToken = async(studentId) => {
    try {
        const student = await Student.findById(studentId)
        const accessToken = student.generateAccessToken()
        const refreshToken = student.generateRefreshToken()

        student.refreshToken = refreshToken
        await student.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(400, "something went to wrong generate access and refersh token")
    }
}


const loginStudent = asynchandler(async(req,res) => {
    const { grNumber} = req.body

    if (!grNumber) {
        throw new ApiError(400, "All field is required")
    }

    const student = await Student.findOne({
        grNumber
    })
    
    if (!student) {
        throw new ApiError(404, "student not registered")
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(student._id)

    const options = {
        httpOnly: true,
        secure: true
    }

    const loggedInStudent = await Student.findById(student._id).select(
        "-refreshToken"
    )

    return res
    .status(200)
    .cookie("studentAccessToken", accessToken, options)
    .cookie("studentRefreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                student: loggedInStudent,
                accessToken,
                refreshToken
            },
            "student loggedIn successfully"
        )
    )
})


const logoutStudent = asynchandler(async(req,res) => {
    Student.findByIdAndUpdate(
        req.student?._id,
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
    .clearCookie("studentAccessToken", options)
    .clearCookie("studentRefreshToken", options)
    .json(
        new ApiResponse(
            200,
            null,
            "student logged out successfully"
        )
    )
})


const getCurrentStudent = asynchandler(async(req,res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            req.student,
            "Student fetched successfully"
        )
    )
})


const refreshAccessToken = asynchandler(async(req,res) => {
    const incommingToken = req.cookies.studentRefreshToken || req.body.studentRefreshToken

    if (!incommingToken) {
        throw new ApiError(400, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incommingToken,
            process.env.REFRESH_TOKEN_SCRECT
        )
        
        const student = await Student.findById(
            decodedToken?._id
        )

        if (!student) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (student.refreshToken !== incommingToken) {
            throw new ApiError(400, "Invalid student token")
        }

        const { accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(student._id)
        
        student.refreshToken = refreshToken
        await student.save({ validateBeforeSave: false})
        
        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .cookie("studentAccessToken", accessToken, options)
        .cookie("studentRefreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken
                },
                "access token refreshed sccessfully"
            )
        )
    } catch (error) {
        throw new ApiError(400, "unauthorized request")
    }
})


export {
    loginStudent,
    logoutStudent,
    getCurrentStudent,
    refreshAccessToken
}