"use strict";

import logger from '../../utils/logger';
import { GeneralErrors, getErrorMessage } from '../../errors/errors';
import { QueryData, QueryError } from '../../duty/types';
import { Client, Pool, QueryResult } from 'pg'
import * as dotenv from "dotenv";
dotenv.config({});

// Create DB Connection
const pool = new Pool({
  database: 'duty',
  user: 'postgres',
  password: "mysecretpassword",
});


/** @function
 * @name getPool
 * Get the Pool connection
 * Return the Pool connection
 * @returns {Pool} - The Pool connection
*/
export const getPool = () => pool;

/** @function
 * @name queryWithPoolConnection
 * High order and high-level function
 * Handle the logging and ROLLBACK if the transactions(fn) fails
 * Should use this function whenever you need a DB connection
 * @param {function(pool: Pool)(...*)} fn - Where the DB transactions happen, controlled by the function caller 
 * @returns {function(...*): Promise<QueryData<QueryResult<R>> | QueryError<GeneralErrors>>} - Result can be Error or Query Result
*/
export const queryWithPoolConnection = <P, R>(fn: (pool: Pool) => (...args: P[]) => Promise<QueryResult<R>>) => async (...args: P[]) => {
  try {
    const pool = getPool();
    await pool.query('BEGIN');
    const start = Date.now();
    const queryResult = await fn(pool)(...args);
    const duration = Date.now() - start;
    await pool.query('COMMIT');
    const result: QueryData<typeof queryResult> = { data: queryResult };
    logger.log('info', `[queryWithPoolConnection] queryResult duration: ${duration}, rows: ${queryResult.rowCount}, result: ${JSON.stringify(result)} }`);
    return result;
  } catch (error) {
    await pool.query('ROLLBACK');
    logger.log('error', `[queryWithPoolConnection] error: ${JSON.stringify(error)}}`);
    const result: QueryError<GeneralErrors> = { name: GeneralErrors.DatabaseError, description: getErrorMessage(error) };
    return Promise.resolve(result);
  } 
};

/** @function
 * @name initalizeDutyTable
 * Initalize duty Table if not exist
*/
export const initalizeDutyTable = async (pool: Pool) => {
  const createDutyTableQuery = `CREATE TABLE IF NOT EXISTS DUTY(id UUID PRIMARY KEY DEFAULT gen_random_uuid(), NAME TEXT NOT NULL);`
  return await pool.query(createDutyTableQuery);
}

/** @function
 * @name initalizeDataBase
 * Initalize DB if not exist
*/
export const initalizeDataBase = (isProd: boolean) => (pool: Pool) => (dbNames: string[]) => async () => {
  const client = new Client({
    user: 'postgres',
    password: "mysecretpassword",
  });
  try {
    if (isProd) return logger.log('info', "Skip creating databases in Prod");

    await client.connect();
  
    const dbToBeCreated = dbNames;
    const queryPromises = dbToBeCreated.map(dbName => client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${dbName}'`));
    
    const results = await Promise.all(queryPromises);
    const createDBPromises = results.map((result, index) => {
      if (result.rowCount === 0) {
        logger.log('info', `${dbToBeCreated[index]} database not found, creating...`);
        return client.query(`CREATE DATABASE "${dbToBeCreated[index]}";`);
      } else {
        logger.log('info', `${dbToBeCreated[index]} database already exists, skip creating...`);
      }
    });

    // Initalize DB and Duty Table
    await Promise.all(createDBPromises);
    await initalizeDutyTable(pool);
  } catch (error) {
    logger.log('error', `[initalizeDataBase] error: ${JSON.stringify(error)}}`);
  } finally {
    logger.log('info', "release client");
    client && await client.end();
  }
};

const isProd = process.env.NODE_ENV === 'production';
export const initalizeDutyDataBase = initalizeDataBase(isProd)(pool)(["duty"]);
