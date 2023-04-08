class ApplicationException extends Error {
    statusCode = 400;
    message = "";

    constructor(statusCode: number, message: string) {
        super();
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
    _externalMessage = "";
    _internalMessage = "";

    constructor(
        externalMessage: string,
        internalMessage?: string,
        statusCode?: number
    ) {
        this._externalMessage = externalMessage;
        this._internalMessage = internalMessage ?? externalMessage;
        this.statusCode = statusCode ?? this.statusCode;
    }

    public get externalMessage() {
        return this._externalMessage ?? "Unknown Error";
    }

    public get internalMessage() {
        return (
            this._internalMessage ??
            `Missing internal message. External is: ${this.externalMessage}`
        );
    }
}

class ServiceUnavailable extends ServerException {
    constructor(externalMessage: string, internalMessage?: string) {
        super(externalMessage, internalMessage, 503);
    }
}

export {
    ApplicationException,
    BadRequestException,
    ServerException,
    ServiceUnavailable,
};
