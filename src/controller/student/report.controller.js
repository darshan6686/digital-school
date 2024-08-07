import { Report } from "../../model/report.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asynchandler } from "../../utils/asyncHandler.js";


const getReport = asynchandler(async(req,res) => {
    const report = await Report.aggregate([
        {
            $match: {
                isDelete: false
            }
        },
        {
            $project: {
                isDelete: 0,
                __v: 0
            }
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
            report,
            "Report fetched successfully"
        )
    )
})


const getReportById = asynchandler(async(req,res) => {
    const { reportId } = req.params

    const report = await Report.findById(
        reportId
    ).select(
        "-isDelete -__v"
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


export {
    getReport,
    getReportById
}