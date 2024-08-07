import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import { School } from "../model/school.model.js"
import { Teacher } from "../model/teacher.model.js"
import { Student } from "../model/student.model.js"


const commonMiddleware = (cookieName, model, variableName) => {
    return async (req, res, next) => {
        try {
            const token = req.cookies?.[cookieName] || req.headers["authorization"]?.replace("Bearer ", "")

            if (!token) {
                throw new ApiError(400, "unauthorized request")
            }

            const userId = jwt.verify(token, process.env.ACCESS_TOKEN_SCRECT)
            const variable = await model.findById(userId)

            if (!variable) {
                throw new ApiError(400, `Invalid ${variableName} access token`)
            }

            req[variableName] = variable
            next()
        } catch (error) {
            next(new ApiError(400, `Invalid ${variableName} access token`))
        }
    }
}

export const verifySchool = commonMiddleware("schoolAccessToken", School, "school")


export const verifyTeacher = commonMiddleware("teacherAccessToken", Teacher, "teacher")


export const verifyStudent = commonMiddleware("studentAccessToken", Student, "student")