import db from '../db/queries.js';

async function categoryListGet(req, res) {
  const categories = await db.getAllCategory();
  res.render('pages/index', {
    categories,
    title: 'Home',
  });
}

export default { categoryListGet };
