import { ApiCallback } from "./utils/FunctionCallback";

import getPriceUsageData from "./handlers/getPriceUsage.handler";
import appErrorWrapper from "./utils/appErrorWrapper";

/**
 * Find a proper handler to be called based on the request data
 * @returns a function handler for business logic
 */
const retrieveHandler = (request: any) => {
    // do something w/ request to define which handler should be used
    // e.g. parse the body or query params
    return getPriceUsageData;
};

/**
 * Entrypoint of the Cloud Function
 * The handler to be called is wrapped in an Application Error Handler
 * Any caught exceptions are treated as Interal Server Errors
 */
const mainEntrypoint = async (request: any, response: any) => {
    try {
        // retrieve a proper handler
        const handler = retrieveHandler(request);

        // wrap the handler in Error Handler
        const result = await appErrorWrapper(handler)(request);

        // finally, generate a JSON response for the client based on the wrapper output
        return result.generateResponseJSON(response);
    } catch (error: any) {
        // handle Internal Server Error
        console.error(`Internal Server Error: ${JSON.stringify(error)}`);

        return ApiCallback.error({
            message: "Internal Server Error",
        }).generateResponseJSON(response);
    }
};

export { mainEntrypoint };
