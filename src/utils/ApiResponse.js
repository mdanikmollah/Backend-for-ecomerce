class ApiResponse {
    constructor(statusCode=200, message = "success", data = null){
        this.statusCode = statusCode
        this.message = message
        this.data = data
    }
    apiLoginRes(data){
        return new ApiResponse(201, "Login successfully done", data);
    }
    apiLogoutRes(data){
        return new ApiResponse(201, "Logout successfully done", data);
    }
}

export default ApiResponse