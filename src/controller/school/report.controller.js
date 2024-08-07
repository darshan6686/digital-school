import { Report } from "../../model/report.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asynchandler } from "../../utils/asyncHandler.js";


const addReport = asynchandler(async(req,res) => {
    const { title, description } = req.body

    if (!(title && description)) {
        throw new ApiError(400, "title and description are required")
    }

    const report = await Report.create({
        title,
        description
    })

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            report,
            "Report added successfully"
        )
    )
})


const getAllReport = asynchandler(async(req,res) => {
    const reports = await Report.aggregate([
        {
            $match: {
                isDelete: false
            }
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
            reports,
            "All reports fetched successfully"
        )
    )
})


const getReportById = asynchandler(async(req,res) => {
    const { reportId } = req.params

    if (!reportId) {
        throw new ApiError(400, "reportId is missing")
    }

    const report = await Report.findById(
        reportId
    ).select(
        "-isDelete"
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            report,
            "Report fetched successfully"
        )
    )
})


const updateReport = asynchandler(async(req,res) => {
    const { reportId } = req.params
    const { title, description } = req.body

    if (!reportId) {
        throw new ApiError(400, "reportId is missing")
    }

    if (!(title && description)) {
        throw new ApiError(400, "title and description are required")
    }

    const report = await Report.findByIdAndUpdate(
        reportId,
        {
            $set: {
                title,
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
            report,
            "Report updated successfully"
        )
    )
})


const deleteReport  = asynchandler(async(req,res) => {
    const { reportId } = req.params

    if (!reportId) {
        throw new ApiError(400, "reportId is missing")
    }

    await Report.findByIdAndUpdate(
        reportId,
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
            "Report deleted successfully"
        )
    )
})


export {
    addReport,
    getAllReport,
    getReportById,
    updateReport,
    deleteReport
}