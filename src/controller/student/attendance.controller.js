import { Attendance } from "../../model/attendance.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asynchandler } from "../../utils/asyncHandler.js";


const getAttendanceByStudent = asynchandler(async(req,res) => {
    const attendance = await Attendance.aggregate([
        {
            $match: {
                studentId: req.student?._id,
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
            $lookup: {
                from: "teachers",
                localField: "teacher",
                foreignField: "_id",
                as: "teacher",
                pipeline: [
                    {
                        $project: {
                            name: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$teacher"
        },
        {
            $project: {
                isDelete: 0
            }
        },
        {
            $addFields: {
                attendance: {
                    $sortArray: {
                        input: "$attendance",
                        sortBy: { date: 1 }
                    }
                }
            }
        },
        {
            $addFields: {
                paresentDay: {
                    $size: {
                        $filter: {
                            input: "$attendance",
                            cond: {
                                $eq: ["$$this.status", "Present"]
                            }
                        }
                    }
                },
                absentDay: {
                    $size: {
                        $filter: {
                            input: "$attendance",
                            cond: {
                                $eq: ["$$this.status", "Absent"]
                            }
                        }
                    }
                },
                totalDay: {
                    $size: "$attendance"
                }
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            attendance,
            "student attendance data fetched successfully"
        )
    )
})


export {
    getAttendanceByStudent
}