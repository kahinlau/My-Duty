"use strict";

import * as express from 'express';
import { 
  getDutyRequestHandlers,
  getDutiesRequestHandlers,
  postDutyRequestHandlers,
  postDutiesRequestHandlers,
  putDutyRequestHandlers,
  defaultRequestHandlers,
} from '../duty/requests';

const router = express.Router();

/**
 * Route serving get duty.
 * @name get/duty/:id
 */
router.get('/duty/:id', 
  ...getDutyRequestHandlers
);

/**
 * Route serving get duties.
 * @name get/duties
 */
router.get('/duties',
  ...getDutiesRequestHandlers
);

/**
 * Route serving post duty.
 * @name post/duty
 */
router.post('/duty',
  ...postDutyRequestHandlers
);

/**
 * Route serving insert duites.
 * @name post/duites
 */
router.post('/duties',
  ...postDutiesRequestHandlers
);

/**
 * Route serving update duty.
 * @name put/duty
 */
router.put('/duty',
  ...putDutyRequestHandlers
);

/**
 * Route serving root.
 * @name all/
 */
router.all("/", ...defaultRequestHandlers);

export default router;
