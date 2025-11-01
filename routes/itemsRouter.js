import express from 'express';
import itemsController from '../controllers/itemsController.js';

const itemsRouter = express.Router();

itemsRouter.param('id', (req, res, next, id) => {
  req.itemId = id;
  next();
});
itemsRouter.get('/create/:categoryId', itemsController.itemCreateGet);
itemsRouter.post('/create/:categoryId', itemsController.itemCreatePost);
itemsRouter.get('/:id/update', itemsController.itemUpdateGet);
itemsRouter.post('/:id/update', itemsController.itemUpdatePost);
itemsRouter.post('/:id/update/confirm', itemsController.confirmUpdate);
itemsRouter.get('/:id/delete', itemsController.itemDeleteGet);
itemsRouter.post('/:id/delete/confirm', itemsController.itemDeletePost);
export default itemsRouter;
