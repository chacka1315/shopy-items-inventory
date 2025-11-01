import db from '../db/queries.js';
import MyNotFoundError from '../errors/MyNotFoundError.js';
import { body, matchedData, validationResult } from 'express-validator';

async function getItemList(req, res) {
  const { categoryName } = req.params;
  const category = await db.findCategoryByName(categoryName);
  if (category.length === 0) {
    throw new MyNotFoundError('This category does no eexist!');
  }

  const items = await db.getCategoryItems(category[0].id);
  res.render('pages/itemsList', {
    title: 'Items',
    items: items,
    category: category[0],
  });
}

function categoryCreateGet(req, res) {
  res.render('pages/addCategory', {
    title: 'New Category',
    category: {},
    rmWhitespace: true,
  });
}

const alphaErr = 'must only contain letters';
const lengthErr = 'must be bettween 2 and 50 characters';
const validationChain = [
  body('category_name')
    .trim()
    .isAlpha('fr-FR', { ignore: ' ' })
    .withMessage(`Category name ${alphaErr}`)
    .isLength({ min: 2, max: 50 })
    .withMessage(`Category name ${lengthErr}`),
  body('category_description')
    .trim()
    .optional({ values: 'falsy' })
    .isLength({ min: 10 })
    .withMessage('Description must have at least 10 characters'),
];

const checkCategoryExistsforAdd = async (category_name) => {
  const category = await db.findCategoryByName(category_name);
  if (category.length > 0) {
    throw new Error('A category already exists with same name!');
  }
};

const categoryCreatePost = [
  validationChain,
  body('category_name').custom(checkCategoryExistsforAdd),
  async (req, res) => {
    const validationErr = validationResult(req);

    if (!validationErr.isEmpty()) {
      const { category_name, category_description } = req.body;
      const category = { category_name, category_description };
      const errors = validationErr.array();

      return res.render('pages/addCategory', {
        title: 'New category',
        category,
        errors,
        rmWhitespace: true,
      });
    }

    const { category_name, category_description } = matchedData(req);
    const category = {
      name: category_name,
      description: category_description || '',
    };
    await db.addCategory(category);
    res.redirect('/');
  },
];

const categoryUpdateGet = async (req, res) => {
  if (!req.categoryId) {
    throw new MyNotFoundError('This page does not exist');
  }

  const category = await db.findCategoryById(req.categoryId);

  if (category.length === 0) {
    throw new MyNotFoundError('No category with this id');
  }

  res.render('pages/updateCategory', {
    title: 'Update',
    category: category[0],
  });
};

const checkCategoryExistsforUpdate = async (category_name, { req }) => {
  const category = await db.checkIfCategoryExistForUpdate(
    req.categoryId,
    category_name,
  );
  if (category.length > 0) {
    throw new Error('A category already exists with same name!');
  }
};

const categoryUpdatePost = [
  validationChain,
  body('category_name').custom(checkCategoryExistsforUpdate),
  async (req, res) => {
    const validationErr = validationResult(req);

    if (!validationErr.isEmpty()) {
      const { category_name, category_description } = req.body;
      const category = {
        name: category_name,
        description: category_description,
        id: req.categoryId,
      };

      const errors = validationErr.array();

      return res.render('pages/updateCategory', {
        title: 'Update',
        category,
        errors,
      });
    }

    const { category_name, category_description } = matchedData(req);
    const category = {
      name: category_name,
      description: category_description || '',
    };

    res.render('pages/CRUDconfirmCategory', {
      title: 'Confirm',
      category: category,
      route: 'category',
      id: req.categoryId,
      confirmType: 'update',
    });
  },
];

const categoryConfirmUpdate = async (req, res) => {
  const { category_name, category_description, password } = req.body;
  const category = {
    name: category_name,
    description: category_description,
  };

  if (password !== process.env.ADMIN_PASSWORD) {
    const errors = [{ msg: '❌ Incorrect password!' }];
    return res.render('pages/CRUDconfirmCategory', {
      title: 'Confirm',
      category: category,
      route: 'category',
      id: req.categoryId,
      confirmType: 'update',
      errors: errors,
    });
  }

  await db.updateCategory(req.categoryId, category);
  res.redirect('/');
};

const categoryDeleteGet = (req, res) => {
  if (!req.categoryId) {
    throw new MyNotFoundError('This page does not exist');
  }

  res.render('pages/CRUDconfirmCategory', {
    title: 'Confirm',
    category: {},
    route: 'category',
    id: req.categoryId,
    confirmType: 'delete',
  });
};

const categoryDeletePost = async (req, res) => {
  const { password } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    const errors = [{ msg: '❌ Incorrect password!' }];
    return res.render('pages/CRUDconfirmCategory', {
      title: 'Confirm',
      category: {},
      route: 'category',
      id: req.categoryId,
      confirmType: 'delete',
      errors: errors,
    });
  }

  await db.deleteCategory(req.categoryId);
  res.redirect('/');
};

export default {
  categoryCreateGet,
  categoryCreatePost,
  categoryUpdateGet,
  categoryUpdatePost,
  categoryConfirmUpdate,
  categoryDeleteGet,
  categoryDeletePost,
  getItemList,
};
