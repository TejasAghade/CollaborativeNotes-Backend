export default class ApiResponse {

    success: boolean;
    message: string;
    statusCode: number;
    data: any = null;
    errors: any;

    /**
        * generate structured api response
        * @param success - boolean
        * @param statusCode - number
        * @param message - string - message
        * @param errors - list of string - for errors
        * @param data - dynamic - type for any type of data to send
        * 
    */

    constructor(
        message: string = "something went wrong!",
        errors = [],
        data = null,
        statusCode = 500,
    ) {
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
        this.errors = errors;
        if (statusCode >= 400) {
            this.success = false
        } else {
            this.success = true;
        }
    }
}


export const serverError = (err: any) => {
    return new ApiResponse("something went wrong", [err], null, 500);
}