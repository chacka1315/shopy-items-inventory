import express from 'express';
import indexController from '../controllers/indexController.js';

const indexRouter = express.Router();
indexRouter.get('/', indexController.categoryListGet);

export default indexRouter;
