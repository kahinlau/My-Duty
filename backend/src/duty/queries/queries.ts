"use strict"

import logger from "../../utils/logger";
import { Duty } from "../types";

/** @function
 * @name getSelectQueryText
 * Get Select Query Text
 * Return all duties if no id is provided
 * @param {string} [id] - Optional, the duty id
 * @returns {string} - The query text
*/
export const getSelectQueryText = (id?: Duty["id"]) =>  {
  // return all duties if no id is provided
  const queryText = id ? `SELECT id, name FROM duty WHERE id = '${id}'` : 'SELECT * FROM duty';
  logger.log('info', `[getSelectQueryText] queryText: ${queryText}`);
  return queryText;
};

/** @function
 * @name getUpdateQueryText
 * Get Update Query Text
 * Return the updated duties
 * @param {Duty[]} duties - The duties to be updated
 * @returns {string} - The query text
*/
export const getUpdateQueryText = (duties: Duty[]) =>  {
  const params = duties.map(duty => `('${duty.id}','${duty.name}')`);
  const values = params.join(", ");
    // return empty query text if duties is an empty array
  const queryText = values ? `UPDATE duty as d SET name=c.name FROM (VALUES ${values}) AS c(id, name) WHERE d.id::text = c.id::text RETURNING *` : "";
  logger.log('info', `[getUpdateQueryText] queryText: ${queryText}`);
  return queryText;
};

/** @function
 * @name getInsertSingleQueryText
 * Get Insert Single Duty Query Text
 * Return the inserted duty
 * @param {string} name - The name of duty to be inserted
 * @returns {string} - The query text
*/
export const getInsertSingleQueryText = (name: Duty["name"]) => {
  const queryText = `INSERT INTO duty(name) VALUES('${name}') RETURNING *`;
  logger.log('info', `[getInsertSingleQueryText] queryText: ${queryText}`);
  return queryText;
};

/** @function
 * @name getInsertQueryText
 * Get Insert Query Text
 * Return the inserted duties
 * @param {Duty[]} duties - The duties to be inserted
 * @returns {string} - The query text
*/
export const getInsertQueryText = (duties: Duty[]) =>  {
  const values = duties.map(duty => `('${duty.name}')`).join(", ");
  // return empty query text if duties is an empty array
  const queryText = values ? `INSERT INTO duty(name) VALUES ${values} RETURNING *` : "";
  logger.log('info', `[getInsertQueryText] queryText: ${queryText}`);
  return queryText;
};