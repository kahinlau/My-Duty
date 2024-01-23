import { ErrorResponse } from "../duty/types";

export enum GeneralErrors {
	DatabaseError = "A database error was found.",
	InternalServerError = "An unexpected server error was found.",
	InvalidAPIInputError = "Invalid input values."
};

export enum DutyRecordErrors {
	NotFoundError = "Record not found.",
};

export const ERROR_STATUS_CODE_MAPPING = {
  [GeneralErrors.DatabaseError]: 500,
  [GeneralErrors.InternalServerError]: 500,
	[GeneralErrors.InvalidAPIInputError]: 422,
	[DutyRecordErrors.NotFoundError]: 404,
};

/** @function
 * @name getErrorMessage
 * Standardize the return error message
 * @param {Error | string | unknown} error - The error
 * @returns {string} 
*/
export const getErrorMessage = (error: Error | string | unknown) => {
		// Check if it is en Error type or not
		if (error && error instanceof Error) {
			return error.message;
		} else if (error && typeof error === "string") {
			return error;
		}
    return "Unknown error type";
};

/** @function
 * @name getErrorResponse
 * Format the return error response
 * @param {string} errorMessage - The error message
 * @returns {{error: string}} 
*/
export const getErrorResponse = (errorMessage: string): ErrorResponse => {
	return {error: errorMessage};
};