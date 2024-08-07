import dotenv from  "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"
dotenv.config({
    path: "./.env"
})

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.log("error", error)
        throw error
    })

    app.listen(process.env.PORT || 8000, () => {
        console.log(`\n server is running on port ${process.env.PORT} \n`)
    })
})
.catch((error) => {
    console.log("mongodb connection failed", error)
})