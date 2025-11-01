import express from 'express';
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import indexRouter from './routes/indexRouter.js';
import itemsRouter from './routes/itemsRouter.js';
import categoriesRouter from './routes/categoriesRouter.js';
import MyNotFoundError from './errors/MyNotFoundError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsPath = path.join(__dirname, 'public');

//setup
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//global middlewares
app.use((req, res, next) => {
  console.log(`${req.method} reqauest with path ${req.path}`);
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath));

//routing
app.use('/', indexRouter);
app.use('/category', categoriesRouter);
app.use('/item', itemsRouter);

//Errors handleing
app.use((req, res) => {
  throw new MyNotFoundError('Page not found!');
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode || 500).render('pages/404');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }

  console.log('🌎 Server is running on PORT ', PORT);
});
