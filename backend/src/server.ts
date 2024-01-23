"use strict";

import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import router from './routes';
import logger from './utils/logger';
import { initalizeDutyDataBase } from './db/postgres';
import * as swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./swagger.json";

// Minimal setup for a server  
const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

initalizeDutyDataBase();

const isProd = process.env.NODE_ENV === 'production';
// Swagger doc
if (!isProd) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
}


app.use('/', router);

app.listen(port, () => {
  logger.info(`Server is running on : localhost:${port}!`);
});