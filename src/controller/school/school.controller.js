import jwt from "jsonwebtoken";
import { School } from "../../model/school.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asynchandler } from "../../utils/asyncHandler.js";
import { removeCloudinary, uploadCloudinary } from "../../utils/cloudinary.js";


const generateAccessTokenAndRefreshToken = async(schoolId) => {
    try {
        const school = await School.findById(schoolId)
        const accessToken = school.generateAccessToken()
        const refreshToken = school.generateRefreshToken()
        school.refreshToken = refreshToken
        await school.save({ validateBeforeSave: false})

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(400, "something went wrong to generate access and refresh token")
    }
}


const registerSchool = asynchandler(async(req,res) => {
    const {name, address, phone, email, password, description} = req.body

    if(!(name && address && phone && email && password && description)){
        throw new ApiError(400, "All field is required")
    }

    const alreadySchool = await School.find({
        email: email
    })

    if (!alreadySchool) {
        throw new ApiError(400, "School is already existed")
    }

    const logoLocalFilePath = req.file?.path

    if (!logoLocalFilePath) {
        throw new ApiError(400, "logo is required")
    }

    const logo = await uploadCloudinary(logoLocalFilePath)

    if (!logo) {
        throw new ApiError(400, "school logo is required")
    }

    const school = await School.create({
        name,
        address,
        phone,
        email,
        password,
        description,
        logo
    })

    const createSchool = await School.findById(school._id).select(
        "-password -refreshToken"
    )

    if (!createSchool) {
        throw new ApiError(400, "something went wrong to register school")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            createSchool,
            "School is created successfully"
        )
    )

})


const login = asynchandler(async(req,res) => {
    const {email, password} = req.body

    if (!(email && password)) {
        throw new ApiError(400, "All field is requires")
    }

    const school = await School.findOne({
        email
    })

    if (!school) {
        throw new ApiError(400, "school does not register")
    }

    const isPasswordCorrect = await school.isCorrectPassword(password)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid password")
    }

    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(school._id)

    const loggedInSchool = await School.findById(school._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .cookie("schoolAccessToken", accessToken, options)
    .cookie("schoolRefreshToken", refreshToken, options)
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                school: loggedInSchool,
                accessToken,
                refreshToken
            },
            "school login successfully"
        )
    )
})


const logout = asynchandler(async(req,res) => {
    const school = await School.findByIdAndUpdate(
        req.school._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    return res
    .clearCookie("schoolAccessToken")
    .clearCookie("schoolRefreshToken")
    .status(200)
    .json(
        new ApiResponse(
            200,
            school,
            "school logout successfully"
        )
    )
})


const getSchool = asynchandler(async(req,res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            req.school,
            "school fetched successfully"
        )
    )
})


const refreshAccessToken = asynchandler(async(req,res) => {
    const incommingRefreshToken = req.cookies.schoolRefreshToken || req.body.schoolRefreshToken

    if (!incommingRefreshToken) {
        throw new ApiError(400, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incommingRefreshToken,
            process.env.REFRESH_TOKEN_SCRECT
        )

        const school = await School.findById(decodedToken._id)

        if (!school) {
            throw new ApiError(400, "Invalid refresh token")
        }

        if (incommingRefreshToken !== school.refreshToken) {
            throw new ApiError(400, "Invalid refresh token or used refresh token")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(school._id)

        return res
        .status(200)
        .cookie("schoolAccessToken", accessToken, options)
        .cookie("schoolRefreshToken", refreshToken, options)
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
        throw new ApiError(400, "unauthorized request")
    }
})


const updateSchoolDetails = asynchandler(async(req,res) => {
    const {name, address, phone, email, description} = req.body

    if (!(name && address && phone && email && description)) {
        throw new ApiError(400, "All field is required")
    }

    const school = await School.findByIdAndUpdate(
        req.school?._id,
        {
            $set: {
                name,
                address,
                phone,
                email,
                description
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
            school,
            "school details updated successfully"
        )
    )
})


const changeCurrentPassword = asynchandler(async(req,res) => {
    const {oldPassword, newPassword} = req.body

    if (!(oldPassword && newPassword)) {
        throw new ApiError(400, "All field is required")
    }

    const school = await School.findById(req.school?._id)

    if (!school) {
        throw new ApiError(400, "school not found")
    }

    const isPasswordCorrect = await school.isCorrectPassword(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid password")
    }

    school.password = newPassword
    await school.save({ validateBeforeSave: false })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "password changed successfully"
        )
    )
})


const changeSchoolLogo = asynchandler(async(req,res) => {
    const school = await School.findById(req.school?._id)

    if (!school) {
        throw new ApiError(400, "school not found")
    }

    const url = school.logo.split("/")
    const fileName = url[url.length - 1]
    const publicId = fileName.split(".")[0]

    const removeLogo = await removeCloudinary(publicId)

    const logoLocalPath = req.file?.path

    if (!logoLocalPath) {
        throw new ApiError(400, "logo is required")
    }

    const logo = await uploadCloudinary(logoLocalPath)

    if (!logo) {
        throw new ApiError(400, "logo is required")
    }

    school.logo = logo
    await school.save({ validateBeforeSave: false })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            logo,
            "logo changed successfully"
        )
    )
})


export {
    registerSchool,
    login,
    logout,
    getSchool,
    refreshAccessToken,
    updateSchoolDetails,
    changeCurrentPassword,
    changeSchoolLogo
}