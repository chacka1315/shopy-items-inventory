import db from '../db/queries.js';
import MyNotFoundError from '../errors/MyNotFoundError.js';
import { body, matchedData, validationResult } from 'express-validator';

function itemCreateGet(req, res) {
  const { categoryId } = req.params;
  res.render('pages/addItem', {
    title: 'New item',
    categoryId: categoryId,
    item: {},
  });
}

const priceErr = `The price must have at the most two decimal digits. Ex: 30.00 or 30`;
const imgLinkErr = `The image link must point to an image (jpg, jpeg, png, gif, webp, avif)`;

const itemValidationChain = [
  body('item_name')
    .trim()
    .isAlphanumeric('fr-FR', { ignore: ' ' })
    .withMessage('Then item name must only contain letters and numbers.')
    .isLength({ min: 2, max: 100 })
    .withMessage('The item name must be between 2 and 100 characters.'),
  body('item_price')
    .trim()
    .isDecimal({ decimal_digits: 2 })
    .withMessage(priceErr),
  body('item_stock')
    .trim()
    .isInt({ min: 1, max: 1000000 })
    .withMessage('The stock must be an integer between 1 and 1 000 000.'),
  body('item_img_link')
    .optional({ values: 'falsy' })
    .trim()
    .isURL()
    .withMessage('The image link must a valid URL.')
    .matches(/\.(jpg|jpeg|png|gif|webp|avif)$/i)
    .withMessage(imgLinkErr),
  body('item_description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 10 })
    .withMessage('The description must have at least 10 characters'),
];

const itemCreatePost = [
  itemValidationChain,
  async (req, res) => {
    const { categoryId } = req.params;
    const category = await db.findCategoryById(categoryId);
    if (category.length === 0) {
      throw new MyNotFoundError('This category does not exists!');
    }

    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const errors = validationErrors.array();
      const item = {
        item_name: req.body.item_name,
        item_price: req.body.item_price,
        item_stock: req.body.item_stock,
        item_img_link: req.body.item_img_link,
        item_description: req.body.item_description,
      };

      return res.render('pages/addItem', {
        categoryId,
        item,
        errors,
        title: 'New item',
      });
    }

    const {
      item_name,
      item_price,
      item_stock,
      item_img_link,
      item_description,
    } = matchedData(req);

    const item = {
      name: item_name,
      price: item_price,
      stock: item_stock,
      image_link: item_img_link || '',
      description: item_description || '',
    };

    await db.addItem(categoryId, item);
    res.redirect(`/category/${category[0].name}`);
  },
];

async function itemUpdateGet(req, res) {
  const item = await db.findItemById(req.itemId);
  if (item.length === 0) {
    throw new MyNotFoundError('Cannot find such item!');
  }

  res.render('pages/updateItem', {
    title: 'Update',
    item: item[0],
  });
}

const itemUpdatePost = [
  itemValidationChain,
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const errors = validationErrors.array();
      const item = {
        id: req.itemId,
        name: req.body.item_name,
        price: req.body.item_price,
        stock: req.body.item_stock,
        image_link: req.body.item_img_link,
        description: req.body.item_description,
      };

      return res.render('pages/updateItem', {
        item,
        errors,
        title: 'Update',
      });
    }

    const {
      item_name,
      item_price,
      item_stock,
      item_img_link,
      item_description,
    } = matchedData(req);

    const item = {
      name: item_name,
      price: item_price,
      stock: item_stock,
      image_link: item_img_link || '',
      description: item_description || '',
    };

    res.render('pages/CRUDconfirmItem', {
      item,
      confirmType: 'update',
      id: req.itemId,
    });
  },
];

async function confirmUpdate(req, res) {
  const { password } = req.body;
  const item = {
    name: req.body.item_name,
    price: req.body.item_price,
    stock: req.body.item_stock,
    image_link: req.body.item_img_link,
    description: req.body.item_description,
  };

  if (password !== process.env.ADMIN_PASSWORD) {
    const errors = [{ msg: '❌ Incorrect password!' }];
    return res.render('pages/CRUDconfirmItem', {
      item,
      errors,
      id: req.itemId,
      confirmType: 'update',
    });
  }

  await db.updateItem(req.itemId, item);
  const categoryName = await db.findItemCategoryName(req.itemId);
  res.redirect(`/category/${categoryName}`);
}

function itemDeleteGet(req, res) {
  if (!req.itemId) {
    throw new MyNotFoundError('This page does not exist');
  }

  res.render('pages/CRUDconfirmItem', {
    title: 'Confirm',
    item: {},
    id: req.itemId,
    confirmType: 'delete',
  });
}

async function itemDeletePost(req, res) {
  const { password } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    const errors = [{ msg: '❌ Incorrect password!' }];
    return res.render('pages/CRUDconfirmItem', {
      title: 'Confirm',
      item: {},
      id: req.itemId,
      confirmType: 'delete',
      errors: errors,
    });
  }

  const categoryName = await db.findItemCategoryName(req.itemId);
  await db.deleteItem(req.itemId);
  res.redirect(`/category/${categoryName}`);
}

export default {
  itemCreateGet,
  itemCreatePost,
  itemUpdateGet,
  itemUpdatePost,
  confirmUpdate,
  itemDeleteGet,
  itemDeletePost,
};
