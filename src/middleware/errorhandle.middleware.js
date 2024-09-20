import { ApiError } from "../utils/ErrorHandler.js";


const errorHandlerMiddleware = (err, req, res, next)=>{
    if(err instanceof ApiError){
        return res.status(err.statusCode).json({message: err.message})
    }
    else{
        return res.status(500).json({message: "internal server Error"})
    }
}
  
  export default errorHandlerMiddleware;
  