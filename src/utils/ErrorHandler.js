

class ApiError extends Error {
    constructor (statusCode = 400, message= "something went wrong",stack){
        super(message)
        this.statusCode = statusCode
        

        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this, this.constructor);
        }

     }
    
    

}



export {ApiError}