class SuccessResponse {
    constructor(data = {}, message = 'Success', status = 200) {
        this.success = true;
        this.message = message;
        this.data = data;
        this.status = status;
    }
}

class ErrorResponse {
    constructor(status = 500, error = {}, message = "Error") {
        this.success = false;
        this.message = message;
        this.error = error;
        this.status = status;
    }
}

module.exports = { SuccessResponse, ErrorResponse }