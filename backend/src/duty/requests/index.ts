"use strict";

import * as express from 'express';
import { body, param } from "express-validator";
import logger from '../../utils/logger';
import { 
  getDuty,
  createDuty,
  updateDuty,
  getDuties,
  upsertDuties,
} from '../../duty';
import { DutyRecordErrors, ERROR_STATUS_CODE_MAPPING, GeneralErrors, getErrorResponse } from '../../errors/errors';
import checkValidationResult from '../../middleware/validationResult';
import { DataResponse, Duty, ErrorResponse } from '../types';

/** @function
 * @name getDutyRequestHandler
 * Get /duty Request Handler
 * Query the DB and return the duty
 * @param {express.Request<{ id: Duty["id"]}, ErrorResponse | DataResponse<Duty>>} req - The request
 * @param {express.Response<ErrorResponse | DataResponse<Duty>>} res - The response
 * @returns {express.Response<ErrorResponse | DataResponse<Duty>>} 
*/
export const getDutyRequestHandler = async (req: express.Request<{ id: Duty["id"]}, ErrorResponse | DataResponse<Duty>>, res: express.Response<ErrorResponse | DataResponse<Duty>>) => {
  try {  
    const { id } = req.params;
    const dutyResult = await getDuty(id);
    logger.log('info', `[GET /duty/:id] id: ${id} dutyResult: ${JSON.stringify(dutyResult)}`);

    // If no DB error
    if ("data" in dutyResult) {
      const data = dutyResult.data.rows[0];
      logger.log('info', `[GET /duty/:id] data: ${JSON.stringify(data)}`);

      // No record found
      if (!data) {
        const errorStatus = DutyRecordErrors.NotFoundError;
        res.status(ERROR_STATUS_CODE_MAPPING[errorStatus]).json(getErrorResponse(errorStatus));
      } else {
        // Record found
        const result = { data };
        res.status(200).json(result);
      }
    } else {
      // DB error
      const { name, description } = dutyResult;
      logger.log('error', `[GET /duty/:id] error name: ${name} description: ${description}`);
      res.status(ERROR_STATUS_CODE_MAPPING[name]).json(getErrorResponse(name));
    }
  } catch (error) {
    // handle other unexpected errors
    logger.log('error', `[GET /duty/:id] error: ${JSON.stringify(error)}`);
    const errorStatus = GeneralErrors.InternalServerError;
    res.status(ERROR_STATUS_CODE_MAPPING[errorStatus]).json(getErrorResponse(errorStatus));
  }
};

// Apply some middleware to validate the inputs
export const getDutyRequestHandlers = [
  [
    param("id").exists().isUUID(),
  ], 
  checkValidationResult,
  getDutyRequestHandler
];

/** @function
 * @name getDutiesRequestHandler
 * Get /duties Request Handler
 * Query the DB and return the duties
 * @param {express.Request} req - The request
 * @param {express.Response<ErrorResponse | DataResponse<Duty[]>>} res - The response
 * @returns {express.Response<ErrorResponse | DataResponse<Duty[]>>} 
*/
export const getDutiesRequestHandler = async (_: express.Request, res: express.Response<ErrorResponse | DataResponse<Duty[]>>) => {
  try {  
    const dutyResult = await getDuties();
    logger.log('info', `[GET /duties] dutyResult: ${JSON.stringify(dutyResult)}`);

    // If no DB error
    if ("data" in dutyResult ) {
      const data = dutyResult.data.rows;
      logger.log('info', `[GET /duties] data: ${JSON.stringify(data)}`);
      const result = { data };
      res.status(200).json(result);
    } else {
      // DB error
      const { name, description } = dutyResult;
      logger.log('error', `[GET /duties] error name: ${name} description: ${description}`);
      res.status(ERROR_STATUS_CODE_MAPPING[name]).json(getErrorResponse(name));
    }
  } catch (error) {
    // handle other unexpected errors
    logger.log('error', `[GET /duties] error: ${JSON.stringify(error)}`);
    const errorStatus = GeneralErrors.InternalServerError;
    res.status(ERROR_STATUS_CODE_MAPPING[errorStatus]).json(getErrorResponse(errorStatus));
  }
};

// Apply some middleware to validate the inputs
export const getDutiesRequestHandlers = [
  getDutiesRequestHandler
];

/** @function
 * @name postDutyRequestHandler
 * POST /duty Request Handler
 * Query and insert the duty record in the DB and return the inserted duty
 * @param {express.Request<unknown, ErrorResponse | DataResponse<Duty>, { name: Duty["name"] }>} req - The request
 * @param {express.Response<ErrorResponse | DataResponse<Duty>>} res - The response
 * @returns {express.Response<ErrorResponse | DataResponse<Duty>>} 
*/
export const postDutyRequestHandler = async (req: express.Request<unknown, ErrorResponse | DataResponse<Duty>, { name: Duty["name"]}>, res: express.Response<ErrorResponse | DataResponse<Duty>>) => {
  try {  
    const { name } = req.body;
    const dutyResult = await createDuty(name);
    logger.log('info', `[POST /duty] name:${name} dutyResult: ${JSON.stringify(dutyResult)}`);

    // If no DB error
    if ("data" in dutyResult ) {
      const data = dutyResult.data.rows[0];
      logger.log('info', `[POST /duty] data:${JSON.stringify(data)}`);
      const result = { data };
      res.status(200).json(result);
    } else {
      // DB error
      const { name, description } = dutyResult;
      logger.log('error', `[POST /duty] error name: ${name} description: ${description}`);
      res.status(ERROR_STATUS_CODE_MAPPING[name]).json(getErrorResponse(name));
    }
  } catch (error) {
    // handle other unexpected errors
    logger.log('error', `[POST /duty] error: ${JSON.stringify(error)}`);
    const errorStatus = GeneralErrors.InternalServerError;
    res.status(ERROR_STATUS_CODE_MAPPING[errorStatus]).json(getErrorResponse(errorStatus));
  }
};

// Apply some middleware to validate the inputs
export const postDutyRequestHandlers = [
  [
    body("name").notEmpty().isString(),
  ],
  checkValidationResult,
  postDutyRequestHandler
];

/** @function
 * @name postDutiesRequestHandler
 * POST /duties Request Handler
 * Query, insert or update the duty records in the DB and return the latest duties
 * The logic in this endpoint is more Domain specific:
 * 1. If the duty id has a prefix "temp-", it will treated as a new duty item and will be inserted into the DB
 * 2. If the duty id is a UUID without any prefix, will try to update the record with that id if it exists. It WILL NOT be inserted into the DB if the id doesn't exist in the DB
 * 
 * @param {express.Request<{ duties: Duty[]}, ErrorResponse | DataResponse<Duty>>} req - The request
 * @param {express.Response<ErrorResponse | DataResponse<Duty[]>>} res - The response
 * @returns {express.Response<ErrorResponse | DataResponse<Duty[]>>} 
*/
export const postDutiesRequestHandler = async (req: express.Request<{ duties: Duty[]}, ErrorResponse | DataResponse<Duty>>, res: express.Response<ErrorResponse | DataResponse<Duty[]>>) => {
  try {  
    const { duties } = req.body;
    const dutyResult = await upsertDuties(duties);
    logger.log('info', `[POST /duties] duties:${JSON.stringify(duties)} dutyResult: ${JSON.stringify(dutyResult)}`);

    // If no DB error
    if ("data" in dutyResult ) {
      const data = dutyResult.data.rows;
      logger.log('info', `[POST /dutes] data:${JSON.stringify(data)}`);
      const result = { data };
      res.status(200).json(result);
    } else {
      // DB error
      const { name, description } = dutyResult;
      logger.log('error', `[POST /duties] error name: ${name} description: ${description}`);
      res.status(ERROR_STATUS_CODE_MAPPING[name]).json(getErrorResponse(name));
    }
  } catch (error) {
    // handle other unexpected errors
    logger.log('error', `[POST /duties] error: ${JSON.stringify(error)}`);
    const errorStatus = GeneralErrors.InternalServerError;
    res.status(ERROR_STATUS_CODE_MAPPING[errorStatus]).json(getErrorResponse(errorStatus));
  }
};

// Apply some middleware to validate the inputs
export const postDutiesRequestHandlers = [
  [
    body("duties").isArray(),
    body("duties.*.id").exists(),
    body("duties.*.name").exists(),
  ],
  checkValidationResult,
  postDutiesRequestHandler
];

/** @function
 * @name putDutyRequestHandler
 * PUT /duties Request Handler
 * Query and update the duty records in the DB and return the updated duty
 * @param {express.Request<{ duties: Duty[]}, ErrorResponse | DataResponse<Duty>>} req - The request
 * @param {express.Response<ErrorResponse | DataResponse<Duty[]>>} res - The response
 * @returns {express.Response<ErrorResponse | DataResponse<Duty[]>>} 
*/
export const putDutyRequestHandler = async (req: express.Request, res: express.Response<ErrorResponse | DataResponse<Duty>>) => {
  try {  
    const { id, name } = req.body;
    const dutyResult = await updateDuty({ id, name });
    logger.log('info', `[PUT /duty] id: ${id} name: ${name} dutyResult:${JSON.stringify(dutyResult)}`);

     // If no DB error
    if ("data" in dutyResult ) {
      const data = dutyResult.data.rows[0] ;
      logger.log('info', `[PUT /duty] data:${JSON.stringify(data)}`);

      // No record found
      if (!data) {
        const errorStatus = DutyRecordErrors.NotFoundError;
        res.status(ERROR_STATUS_CODE_MAPPING[errorStatus]).json(getErrorResponse(errorStatus));
      } else {
        // Record found
        const result = { data };
        res.status(200).json(result);
      }
    } else {
      // DB error
      const { name, description } = dutyResult;
      logger.log('error', `[PUT /duty] error name: ${name} description: ${description}`);
      res.status(ERROR_STATUS_CODE_MAPPING[name]).json(getErrorResponse(name));
    }
  } catch (error) {
    // handle other unexpected errors
    logger.log('error', `[PUT /duty] error: ${JSON.stringify(error)}`);
    const errorStatus = GeneralErrors.InternalServerError;
    res.status(ERROR_STATUS_CODE_MAPPING[errorStatus]).json(getErrorResponse(errorStatus));
  }
};

// Apply some middleware to validate the inputs
export const putDutyRequestHandlers = [
  [
    body("id").notEmpty().isString(),
    body("name").notEmpty().isString(),
  ],
  checkValidationResult,
  putDutyRequestHandler
];

/** @function
 * @name defaultRequestHandler
 * ALL / Request Handler
 * Dummy root page handling
 * @param {express.Request} req - The request
 * @param {express.Response<DataResponse<string>>} res - The response
 * @returns {express.Response<DataResponse<string>>} 
*/
export const defaultRequestHandler = async (req: express.Request, res: express.Response<DataResponse<string>>) => {
  logger.log('info', `defaultHandler`);
  res.status(200).json({ data: "Hello" });
};

// Middlewares are not needed for this
export const defaultRequestHandlers = [
  defaultRequestHandler
];
