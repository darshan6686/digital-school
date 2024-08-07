import express from "express";
const app = express()
import cors from "cors";
import cookieParser from "cookie-parser";

app.use(cors({
    origin: process.env.CORES_ORIGIN,
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))




// school routes
import schoolRoute from "./routes/school/school.routes.js";
import schoolTeacherRoute from "./routes/school/teacher.routes.js";
import schoolTransportRoute from "./routes/school/transport.routes.js"
import schoolHostelRoute from "./routes/school/hostel.routes.js"
import schoolFeesRoute from "./routes/school/fees.routes.js"
import schoolReportRoute from "./routes/school/report.routes.js"
import dashboardRoute from "./routes/school/dashboard.routes.js"

app.use("/api/v1/school", schoolRoute)
app.use("/api/v1/s/teacher", schoolTeacherRoute)
app.use("/api/v1/s/transport", schoolTransportRoute)
app.use("/api/v1/s/hostel", schoolHostelRoute)
app.use("/api/v1/s/fee", schoolFeesRoute)
app.use("/api/v1/s/report", schoolReportRoute)
app.use("/api/v1/s/dashboard", dashboardRoute)




// teacher routes
import teacherRoute from "./routes/teacher/teacher.routes.js";
import teacherStudentRoute from "./routes/teacher/student.routes.js"
import teacherHomeworkRoute from "./routes/teacher/homework.routes.js"
import teacherAttendanceRoute from "./routes/teacher/attendance.routes.js"
import teacherResultRoute from "./routes/teacher/result.routes.js"

app.use("/api/v1/teachers", teacherRoute)
app.use("/api/v1/t/students", teacherStudentRoute)
app.use("/api/v1/t/homeworks", teacherHomeworkRoute)
app.use("/api/v1/t/attendance", teacherAttendanceRoute)
app.use("/api/v1/t/results", teacherResultRoute)



// student routes
import studentRoute from "./routes/student/student.routes.js"
import studentHomeworkRoute from "./routes/student/homework.routes.js"
import studentTransportRoute from "./routes/student/transport.routes.js"
import studentHostelRoute from "./routes/student/hostel.routes.js"
import studentAttendanceRoute from "./routes/student/attendance.routes.js"
import studentFeesRoute from "./routes/student/fees.routes.js"
import studentResultRoute from "./routes/student/result.routes.js"
import studentReportRoute from "./routes/student/report.routes.js"

app.use("/api/v1/student", studentRoute)
app.use("/api/v1/s/homeworks", studentHomeworkRoute)
app.use("/api/v1/s/transports", studentTransportRoute)
app.use("/api/v1/s/hostels", studentHostelRoute)
app.use("/api/v1/s/attendance", studentAttendanceRoute)
app.use("/api/v1/s/fees", studentFeesRoute)
app.use("/api/v1/s/result", studentResultRoute)
app.use("/api/v1/s/reports", studentReportRoute)



export {
    app
}