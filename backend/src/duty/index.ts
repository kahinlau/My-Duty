"use strict";

import { Pool } from "pg";
import { Duty } from "./types";
import { queryWithPoolConnection } from "../db/postgres";
import { getInsertQueryText, getInsertSingleQueryText, getSelectQueryText, getUpdateQueryText } from "./queries";
import logger from "../utils/logger";

/** @function
 * @name createDutyWithPoolConnection
 * High order and curried function
 * Use the DB connection provided by queryWithPoolConnection to do the create duty queries
 * @param {Pool} pool - DB connection 
 * @returns {function(name: Duty["name"]): Promise<QueryResult<Duty>>} - Query Result
*/
export const createDutyWithPoolConnection = (pool: Pool) => async (name: Duty["name"]) => {
  try {
    const queryText = getInsertSingleQueryText(name);
    const queryResult = await pool.query<Duty>(queryText);
    logger.log('info', `[createDutyWithPoolConnection] queryResult: ${JSON.stringify(queryResult)}`);
    return queryResult;
  } catch (e) {
    logger.log('error', `[createDutyWithPoolConnection] error: ${JSON.stringify(e)}}`);
    throw e;
  }
};

/** @function
 * @name createDuty
 * Partial apply the queryWithPoolConnection function with createDutyWithPoolConnection function
 * @param {Parameters<ReturnType<typeof createDutyWithPoolConnection>>[0]} name: Duty["name"]
 * @returns {ReturnType<ReturnType<typeof queryWithPoolConnection>>} - Return queryWithPoolConnection (Promise<QueryData<QueryResult<Duty>> | QueryError<GeneralErrors>>)
*/
export const createDuty = queryWithPoolConnection<Duty["name"], Duty>(createDutyWithPoolConnection);

/** @function
 * @name getDutiesWithPoolConnection
 * High order and curried function
 * Use the DB connection provided by queryWithPoolConnection to do the get duties queries
 * @param {Pool} pool - DB connection 
 * @returns {function(): Promise<QueryResult<Duty>>} - Query Result
*/
export const getDutiesWithPoolConnection = (pool: Pool) => async () => {
  try {
    const queryText = getSelectQueryText();
    const queryResult = await pool.query<Duty>(queryText);
    logger.log('info', `[getDutiesWithPoolConnection] queryResult: ${JSON.stringify(queryResult)}`);
    return queryResult;
  } catch (e) {
    logger.log('error', `[getDutiesWithPoolConnection] error: ${JSON.stringify(e)}}`);
    throw e;
  }
};

/** @function
 * @name getDuties
 * Partial apply the queryWithPoolConnection function with getDutiesWithPoolConnection function
 * @returns {ReturnType<ReturnType<typeof queryWithPoolConnection>>} - Return queryWithPoolConnection (Promise<QueryData<QueryResult<Duty>> | QueryError<GeneralErrors>>)
*/
export const getDuties = queryWithPoolConnection<never, Duty>(getDutiesWithPoolConnection);

/** @function
 * @name getDutyWithPoolConnection
 * High order and curried function
 * Use the DB connection provided by queryWithPoolConnection to do the get duty queries
 * @param {Pool} pool - DB connection 
 * @returns {function(id: Duty["id"]): Promise<QueryResult<Duty>>} - Query Result
*/
export const getDutyWithPoolConnection = (pool: Pool) => async (id: Duty["id"]) => {
  try {
    const queryText = getSelectQueryText(id);
    const queryResult = await pool.query<Duty>(queryText);
    logger.log('info', `[getDutyWithPoolConnection] queryResult: ${JSON.stringify(queryResult)}`);
    return queryResult;
  } catch (e) {
    logger.log('error', `[getDutiesWithPoolConnection] error: ${JSON.stringify(e)}}`);
    throw e;
  }
};

/** @function
 * @name getDuty
 * Partial apply the queryWithPoolConnection function with getDutyWithPoolConnection function
 * @param {Parameters<ReturnType<typeof getDutyWithPoolConnection>>[0]} id: Duty["id"]
 * @returns {ReturnType<ReturnType<typeof queryWithPoolConnection>>} - Return queryWithPoolConnection (Promise<QueryData<QueryResult<Duty>> | QueryError<GeneralErrors>>)
*/
export const getDuty = queryWithPoolConnection<Duty["id"], Duty>(getDutyWithPoolConnection);

/** @function
 * @name updateDutyWithPoolConnection
 * High order and curried function
 * Use the DB connection provided by queryWithPoolConnection to do the update duty queries
 * @param {Pool} pool - DB connection 
 * @returns {function(id: Duty["id"]): Promise<QueryResult<Duty>>} - Query Result
*/
export const updateDutyWithPoolConnection = (pool: Pool) => async (duty: Duty) => {
  try {
    const queryText = getUpdateQueryText([duty]);
    const queryResult = await pool.query<Duty>(queryText);
    logger.log('info', `[updateDutyWithPoolConnection] queryResult: ${JSON.stringify(queryResult)}`);
    return queryResult;
  } catch (e) {
    logger.log('error', `[updateDutyWithPoolConnection] error: ${JSON.stringify(e)}}`);
    throw e;
  };
};

/** @function
 * @name updateDuty
 * Partial apply the queryWithPoolConnection function with updateDutyWithPoolConnection function
 * @param {Parameters<ReturnType<typeof updateDutyWithPoolConnection>>[0]} duty: Duty
 * @returns {ReturnType<ReturnType<typeof queryWithPoolConnection>>} - Return queryWithPoolConnection (Promise<QueryData<QueryResult<Duty>> | QueryError<GeneralErrors>>)
*/
export const updateDuty = queryWithPoolConnection<Duty, Duty>(updateDutyWithPoolConnection);

/** @function
 * @name updateDutiesWithPoolConnection
 * High order and curried function
 * Use the DB connection provided by queryWithPoolConnection to do the update duties queries
 * @param {Pool} pool - DB connection 
 * @returns {function(duties: Duty[]): Promise<QueryResult<Duty>>} - Query Result
*/
export const updateDutiesWithPoolConnection = (pool: Pool) => async (duties: Duty[]) => {
  try {
    const queryText = getUpdateQueryText(duties);
    const queryResult = await pool.query<Duty>(queryText);
    logger.log('info', `[updateDutiesWithPoolConnection] queryResult: ${JSON.stringify(queryResult)}`);
    return queryResult;
  } catch (e) {
    logger.log('error', `[updateDutiesWithPoolConnection] error: ${JSON.stringify(e)}}`);
    throw e;
  };
};

/** @function
 * @name updateDuties
 * Partial apply the queryWithPoolConnection function with updateDutiesWithPoolConnection function
 * @param {Parameters<ReturnType<typeof updateDutiesWithPoolConnection>>[0]} duties: Duty[]
 * @returns {ReturnType<ReturnType<typeof queryWithPoolConnection>>} - Return queryWithPoolConnection (Promise<QueryData<QueryResult<Duty>> | QueryError<GeneralErrors>>)
*/
export const updateDuties = queryWithPoolConnection<Duty[], Duty>(updateDutiesWithPoolConnection);

/** @function
 * @name upsertDutiesWithPoolConnection
 * High order and curried function
 * Use the DB connection provided by queryWithPoolConnection to do the insert/update duties and get the latest ones queries
 * @param {Pool} pool - DB connection 
 * @returns {function(duties: Duty[]): Promise<QueryResult<Duty>>} - Query Result
*/
export const upsertDutiesWithPoolConnection = (pool: Pool) => async (duties: Duty[]) => {
  try {
    const dutiesToBeInserted = duties.filter(duty => duty.id.startsWith("temp-"));
    const insertQueryText = getInsertQueryText(dutiesToBeInserted);
    logger.log('info', `[upsertDutiesWithPoolConnection] insertQueryText: ${insertQueryText}`);

    const dutiesToBeUpdated = duties.filter(duty => !duty.id.startsWith("temp-"));
    const updateQueryText = getUpdateQueryText(dutiesToBeUpdated);
    logger.log('info', `[upsertDutiesWithPoolConnection] updateQueryText: ${updateQueryText}`);
    
    const insertResult = !!insertQueryText ? await pool.query<Duty>(insertQueryText) : null;
    logger.log('info', `[upsertDutiesWithPoolConnection] insertResult: ${JSON.stringify(insertResult)}`);
    const updateResult = !!updateQueryText ? await pool.query<Duty>(updateQueryText) : null;
    logger.log('info', `[upsertDutiesWithPoolConnection] updateResult: ${JSON.stringify(updateResult)}`);
    const getResult = await pool.query<Duty>(getSelectQueryText());
    logger.log('info', `[upsertDutiesWithPoolConnection] getResult: ${JSON.stringify(getResult)}`);
    return getResult;
  } catch (e) {
    logger.log('error', `[upsertDutiesWithPoolConnection] error: ${JSON.stringify(e)}}`);
    throw e;
  };
};

/** @function
 * @name upsertDuties
 * Partial apply the queryWithPoolConnection function with upsertDutiesWithPoolConnection function
 * @param {Parameters<ReturnType<typeof upsertDutiesWithPoolConnection>>[0]} duties: Duty[]
 * @returns {ReturnType<ReturnType<typeof queryWithPoolConnection>>} - Return queryWithPoolConnection (Promise<QueryData<QueryResult<Duty>> | QueryError<GeneralErrors>>)
*/
export const upsertDuties = queryWithPoolConnection<Duty[], Duty>(upsertDutiesWithPoolConnection);