import express from "express";
import cors from "cors"
import cookieParser from "Cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"}))

app.use(express.static("public"))

app.use(cookieParser())

app.use('./public/temp', express.static('public'));

//routes
import userRouter  from "./router/user.router.js";
import adminRouter from "./router/admin.router.js";
import bikeRouter from "./router/bike.router.js";
import rentalRouter from "./models/rental.model.js";


app.use('/api/v1/user', userRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/bike', bikeRouter)
app.use('/api/v1/router', rentalRouter)

export{app}


