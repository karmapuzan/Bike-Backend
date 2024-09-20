

class ApiResponse {
    constructor (satusCode=200, data={}, message="success"){
        this.satusCode = satusCode,
        this.data = data
        this.message = message
        this.success = true
    }
}


export {ApiResponse}