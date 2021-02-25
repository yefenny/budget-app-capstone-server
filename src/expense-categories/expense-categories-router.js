const express = require('express');
const ExpensesCategoriesService = require('./expense-categories-service');
const expenseCategoriesRouter = express.Router();

expenseCategoriesRouter.route('/').get((req, res, next) => {
  ExpensesCategoriesService.getAllExpenseCategories(req.app.get('db')).then(
    (results) => {
      res.send(results);
    }
  );
});

module.exports = expenseCategoriesRouter;
