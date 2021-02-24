require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const errorHandler = require('./middleware/error-handler');
const pancakeRouter = require('./pancake/pancake-router');
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');
const incomesRouter = require('./incomes/incomes-router');
const { requireAuth } = require('./middleware/jwt-auth');
const incomeCategoriesRouter = require('./income-categories/income-categories-router');

const jsonParser = express.json();
const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(
  morgan(morganOption, {
    skip: () => NODE_ENV === 'test'
  })
);
app.use(cors());
app.use(helmet());

app.use(express.static('public'));
app.use(jsonParser);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use(requireAuth);
app.use('/api/incomes', incomesRouter);
app.use('/api/income-categories', incomeCategoriesRouter);
app.use('/api/pancakes', pancakeRouter);
app.use(errorHandler);

module.exports = app;
