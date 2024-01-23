"use strict";

import { validationResult } from "express-validator";
import logger from "../utils/logger";
import { ERROR_STATUS_CODE_MAPPING, GeneralErrors, getErrorResponse } from "../errors/errors";
import { NextFunction, Response, Request } from "express";

/** @function
 * @name checkValidationResult
 * Validate the inputs
 * @param {Request} req - The request
 * @param {Response} res - The response
 * @param {NextFunction} next - The next function
 * @returns {Response<unknown, Record<string, unknown>>} 
*/
const checkValidationResult = (req: Request, res: Response, next: NextFunction) => {
	const validationErrorResult = validationResult(req);
	logger.log('info', `[checkValidationResult] error: ${JSON.stringify(validationErrorResult)}`);

	// If input errors
	if (!validationErrorResult.isEmpty()) {
		logger.log('error', `[checkValidationResult] error: ${JSON.stringify(validationErrorResult)}`);
		const errorStatus = GeneralErrors.InvalidAPIInputError;
		const errorMessage = validationErrorResult.array().map(error => {
			if ("path" in error) {
				return `'${error.path}' with ${error.msg}`
			};
			return error.msg
		}).join(", ")
		// return 422 status 
		return res.status(ERROR_STATUS_CODE_MAPPING[errorStatus]).json(getErrorResponse(`${errorStatus} ${errorMessage}`));
	}
	// No input errors
	next();
};

export default checkValidationResult;