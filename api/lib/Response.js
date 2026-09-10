import Enum from "../config/Enum.js";
import CustomError from "./Error.js";

class Response {
    constructor() { }

    static successResponse(data, code = 200) {
        return {
            code,
            data,
        };
    }
    static errorResponse(error, code) {
        if (error instanceof CustomError) {
            return {
                code: error.code,
                error: {
                    message: error.message,
                    description: error.description,
                },
            };
        }
        return {
            code: Enum.HTTP_CODES.INT_SERVER_ERROR,
            error: {
                message: "Unknown Error!",
                description: error.message,
            },
        };
    }
}

export default Response;
