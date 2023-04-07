class ApplicationError {
    statusCode = 400;
    message = "";

    constructor(statusCode: number, message: string) {
        this.statusCode = statusCode;
        this.message = message;
    }
}

class BadRequestException extends ApplicationError {
    constructor(message: string) {
        super(400, message);
    }
}

class InternalServerException extends ApplicationError {
    constructor(message: string) {
        super(500, message);
    }
}

export { ApplicationError, BadRequestException, InternalServerException };
