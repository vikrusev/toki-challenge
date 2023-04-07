class ApplicationException {
    statusCode = 400;
    message = "";

    constructor(statusCode: number, message: string) {
        this.statusCode = statusCode;
        this.message = message;
    }
}

class BadRequestException extends ApplicationException {
    constructor(message: string) {
        super(400, message);
    }
}

class ServerException {
    statusCode = 500;
    externalMessage = "";
    internalMessage = "";

    constructor(
        statusCode: number,
        externalMessage: string,
        internalMessage?: string
    ) {
        this.statusCode = statusCode;
        this.externalMessage = externalMessage;
        this.internalMessage = internalMessage ?? "";
    }
}

export { ApplicationException, BadRequestException, ServerException };
