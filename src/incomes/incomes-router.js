const express = require('express');
const IncomesCategoriesService = require('../income-categories/income-categories-service');
const IncomesService = require('./incomes-service');
const incomesRouter = express.Router();
// const validUrl = require('valid-url');

incomesRouter
  .route('/')
  .get((req, res, next) => {
    const { id } = req.user;

    IncomesService.getAllIncomes(req.app.get('db'), id)
      .then((incomes) => {
        if (incomes) {
          res.send(incomes);
        }
      })
      .catch(next);
  })
  .all(validateIncome)
  .post((req, res, next) => {
    const { date, amount, description, income_category_id } = req.body;
    const { id } = req.user;
    const newIncome = {
      date,
      amount,
      description,
      income_category_id,
      user_id: id
    };

    IncomesService.createIncome(req.app.get('db'), newIncome)
      .then((income) => {
        if (income) {
          return res.status('201').location('/api/incomes').json(income);
        }
      })
      .catch(next);
  });

incomesRouter
  .route('/:id')
  .get((req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    IncomesService.getIncomeById(req.app.get('db'), id, userId)
      .then((income) => {
        if (income) {
          return res.status(200).json(income);
        } else return res.status(400).json({ error: 'Invalid id' });
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    IncomesService.getIncomeById(req.app.get('db'), id, userId).then(
      (income) => {
        if (!income)
          return res.status(400).json({ error: 'Income does not exists' });
      }
    );

    IncomesService.deleteIncome(req.app.get('db'), id, userId)
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  })
  .all(validateIncome)
  .patch((req, res, next) => {
    const { date, amount, description, income_category_id } = req.body;
    const { id } = req.params;
    const userId = req.user.id;
    const updateIncome = {
      date,
      amount,
      description,
      income_category_id
    };

    IncomesService.getIncomeById(req.app.get('db'), id, userId).then(
      (income) => {
        if (!income)
          return res.status(400).json({ error:  'Invalid id'  });
      }
    );
    IncomesService.updateIncome(req.app.get('db'), id, userId, updateIncome)
      .then(() => {
        return res.status('201').end();
      })
      .catch(next);
  });

incomesRouter.route('/find/:fromDate/:toDate').get((req, res, next) => {
  const { fromDate, toDate } = req.params;
  const { id } = req.user;

  IncomesService.getFilteredIncomes(req.app.get('db'), fromDate, toDate, id)
    .then((incomes) => {
      if (incomes) {
        res.send(incomes);
      }
    })
    .catch(next);
});

async function validateIncome(req, res, next) {
  const { date, description, amount, income_category_id } = req.body;

  const required = { date, description, amount, income_category_id };

  for (const [key, value] of Object.entries(required)) {
    if (!value) return res.status(400).json({ error: `${key} is required` });
  }
  const validateDate = new Date(date);
  if (validateDate == 'Invalid Date')
    return res.status(400).json({ error: `Introduce a valid Date` });

  if (isNaN(parseFloat(amount)))
    return res.status(400).json({ error: `Amount should be numeric` });

  const category = await IncomesCategoriesService.getIncomeCategoryById(
    req.app.get('db'),
    income_category_id
  );

  if (!category)
    return res.status(400).json({ error: `Invalid income_category_id ` });

  if (!description.trim()) {
    return res.status(400).json({ error: `Description is required` });
  }

  next();
}
module.exports = incomesRouter;
