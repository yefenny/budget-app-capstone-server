const express = require('express');
const ExpensesCategoriesService = require('../expense-categories/expense-categories-service');
const ExpensesService = require('./expenses-service');
const expensesRouter = express.Router();
// const validUrl = require('valid-url');

expensesRouter
  .route('/')
  .get((req, res, next) => {
    const { id } = req.user;

    ExpensesService.getAllExpenses(req.app.get('db'), id)
      .then((expenses) => {
        if (expenses) {
          res.send(expenses);
        }
      })
      .catch(next);
  })
  .all(validateExpense)
  .post((req, res, next) => {
    const { date, amount, description, expense_category_id } = req.body;
    const { id } = req.user;
    const newExpense = {
      date,
      amount,
      description,
      expense_category_id,
      user_id: id
    };

    ExpensesService.createExpense(req.app.get('db'), newExpense)
      .then((expense) => {
        if (expense) {
          return res.status('201').location('/api/expenses').json(expense);
        }
      })
      .catch(next);
  });

expensesRouter
  .route('/:id')
  .get((req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    ExpensesService.getExpenseById(req.app.get('db'), id, userId)
      .then((expense) => {
        if (expense) {
          return res.status(200).json(expense);
        } else return res.status(400).json({ error: 'Invalid id' });
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    ExpensesService.getExpenseById(req.app.get('db'), id, userId).then(
      (expense) => {
        if (!expense)
          return res.status(400).json({ error: 'Expense does not exists' });
      }
    );

    ExpensesService.deleteExpense(req.app.get('db'), id, userId)
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  })
  .all(validateExpense)
  .patch((req, res, next) => {
    const { date, amount, description, expense_category_id } = req.body;
    const { id } = req.params;
    const userId = req.user.id;
    const updateExpense = {
      date,
      amount,
      description,
      expense_category_id
    };

    ExpensesService.getExpenseById(req.app.get('db'), id, userId).then(
      (expense) => {
        if (!expense)
          return res.status(400).json({ error:  'Invalid id'  });
      }
    );
    ExpensesService.updateExpense(req.app.get('db'), id, userId, updateExpense)
      .then(() => {
        return res.status('201').end();
      })
      .catch(next);
  });

expensesRouter.route('/find/:fromDate/:toDate').get((req, res, next) => {
  const { fromDate, toDate } = req.params;
  const { id } = req.user;

  ExpensesService.getFilteredExpenses(req.app.get('db'), fromDate, toDate, id)
    .then((expenses) => {
      if (expenses) {
        res.send(expenses);
      }
    })
    .catch(next);
});

async function validateExpense(req, res, next) {
  const { date, description, amount, expense_category_id } = req.body;

  const required = { date, description, amount, expense_category_id };

  for (const [key, value] of Object.entries(required)) {
    if (!value) return res.status(400).json({ error: `${key} is required` });
  }
  const validateDate = new Date(date);
  if (validateDate == 'Invalid Date')
    return res.status(400).json({ error: `Introduce a valid Date` });

  if (isNaN(parseFloat(amount)))
    return res.status(400).json({ error: `Amount should be numeric` });

  const category = await ExpensesCategoriesService.getExpenseCategoryById(
    req.app.get('db'),
    expense_category_id
  );

  if (!category)
    return res.status(400).json({ error: `Invalid expense_category_id ` });

  if (!description.trim()) {
    return res.status(400).json({ error: `Description is required` });
  }

  next();
}
module.exports = expensesRouter;
