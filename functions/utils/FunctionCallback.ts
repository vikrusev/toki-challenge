class ApiCallback {
    public static success = (json: object): ApiCallback => {
        return new ApiCallback(200, json);
    };

    public static exception = (json: object, code = 500): ApiCallback => {
        return new ApiCallback(code, json);
    };

    public static error = (json: object, code = 500): ApiCallback => {
        return new ApiCallback(code, json);
    };

    private statusCode = 200;
    private body: object = {};

    private constructor(statusCode = 200, body = {}) {
        this.statusCode = statusCode;
        this.body = body;
    }

    public generateResponseJSON(response: any) {
        response.status(this.statusCode);
        response.send({
            headers: {
                // simply allow CORS from all origins
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(this.body),
        });
    }
}

export { ApiCallback };
