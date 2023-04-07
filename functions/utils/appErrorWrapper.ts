import { Request } from "express";
import { ApiCallback } from "../utils/FunctionCallback";
import { ApplicationException, ServerException } from "./exceptions";

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
            // handle application exceptions
            if (error instanceof ApplicationException) {
                console.error(
                    `Application Exception: ${JSON.stringify(error)}`
                );
                return ApiCallback.exception(
                    {
                        message: error.message,
                    },
                    error.statusCode
                );
            }

            // handle server exceptions
            if (error instanceof ServerException) {
                console.error(
                    `Internal Server Exception: ${error.internalMessage}`
                );
                return ApiCallback.exception(
                    {
                        message: error.externalMessage,
                    },
                    error.statusCode
                );
            }

            // handle any other faulty exceptions
            console.error(`Server Error: ${JSON.stringify(error as Error)}`);
            return ApiCallback.error(
                {
                    message: (error as Error)?.message ?? "Unknown Error",
                },
                500
            );
        }
    };
};

export default appErrorWrapper;
