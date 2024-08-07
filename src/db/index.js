import mongoose from "mongoose"
import { DB_NAME } from "../constant.js"

const connectDB = async() => {
    try {
        const connect = await mongoose.connect(`${process.env.MONDODB_URL}/${DB_NAME}`)
        console.log(`\n mongodb connected !! ${connect.connection.host}`);
    } catch (error) {
        console.log('mongodb not connect', error);
        process.exit(1)
    }
}

export default connectDB