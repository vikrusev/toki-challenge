import { Request } from "express";
import { ApiCallback } from "../utils/FunctionCallback";
import { ApplicationException } from "./exceptions";

type ApiHandler = (request: Request) => Promise<object>;

/**
 * Wraps the @param handler in try catch
 * @param handler - a function to be called as the main business layer
 * @returns {Promise<ApiCallback>} the result of the execution of @param handler
 *  - it can also be an Application Error or Internal Server Error
 */
const appErrorWrapper = (handler: ApiHandler) => {
    return async (request: Request): Promise<ApiCallback> => {
        try {
            const handlerResult = await handler(request);
            return ApiCallback.success(handlerResult);
        } catch (error) {
            if (error instanceof ApplicationException) {
                console.error(`Application Error: ${JSON.stringify(error)}`);
                return ApiCallback.exception(
                    {
                        message: error.message,
                    },
                    400
                );
            }

            console.error(
                `Internal Server Error: ${(error as Error).toString()}`
            );
            return ApiCallback.error(
                {
                    message: `My not so encoded Internal Server Error: ${
                        (error as Error)?.message || "Unknown Error"
                    }`,
                },
                500
            );
        }
    };
};

export default appErrorWrapper;
