//require ('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";


dotenv.config({
    path: './env'
})
connectDB()

.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(` Server is running at port: ${
            process.env.PORT}`)
            
    })
})

.catch((err)=>{
    console.log("MONGODB connection failed !!! ", err);
})






/*
import express from "express"

const app = express()

;( async ()=>{
    try
    {
        Mongoose.connect(`${process_params.env.MONGODB_URI}/$
            {DB_NAME}`)
            app.on("error", () =>{
                console.log("ERR:", error)
                throw err
            })

            app.listen(process.env.PORT, ()=>{
                console.log(`App is listening on port ${
                    process.env.PORT}`);
            })
    }catch
    {
        console.error("Error: ", error)
        throw err
    }
})()

*/