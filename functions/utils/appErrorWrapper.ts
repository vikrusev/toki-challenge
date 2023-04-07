import { ApiCallback } from "../utils/FunctionCallback";
import { ApplicationError } from "./exceptions";

/**
 * Wraps the @param handler in try catch
 * @param handler - a function to be called as the main business layer
 * @returns {Promise<ApiCallback>} the result of the execution of @param handler
 *  - it can also be an Application Error or Internal Server Error
 */
const appErrorWrapper = (
    handler: (request: any, response?: any) => Promise<object>
) => {
    return async (request: any, response?: any): Promise<ApiCallback> => {
        try {
            const handlerResult = await handler(request);
            return ApiCallback.success(handlerResult);
        } catch (error) {
            if (error instanceof ApplicationError) {
                console.error(`Application Error: ${JSON.stringify(error)}`);
                return ApiCallback.exception(
                    {
                        message: error.message,
                    },
                    400
                );
            }

            throw error;
        }
    };
};

export default appErrorWrapper;
