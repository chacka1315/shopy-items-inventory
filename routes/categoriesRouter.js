import express from 'express';
import categoriesController from '../controllers/categoriesController.js';

const categoriesRouter = express.Router();

categoriesRouter.param('id', (req, res, next, id) => {
  req.categoryId = id;
  next();
});

categoriesRouter.get('/create', categoriesController.categoryCreateGet);
categoriesRouter.post('/create', categoriesController.categoryCreatePost);
categoriesRouter.get('/:categoryName', categoriesController.getItemList);
categoriesRouter.get('/:id/update', categoriesController.categoryUpdateGet);
categoriesRouter.post('/:id/update', categoriesController.categoryUpdatePost);
categoriesRouter.post(
  '/:id/update/confirm',
  categoriesController.categoryConfirmUpdate,
);
categoriesRouter.get('/:id/delete', categoriesController.categoryDeleteGet);
categoriesRouter.post(
  '/:id/delete/confirm',
  categoriesController.categoryDeletePost,
);
export default categoriesRouter;
