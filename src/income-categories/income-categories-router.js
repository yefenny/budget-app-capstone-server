const express = require('express');
const IncomesCategoriesService = require('./income-categories-service');
const incomeCategoriesRouter = express.Router();

incomeCategoriesRouter.route('/').get((req, res, next) => {
  IncomesCategoriesService.getAllIncomeCategories(req.app.get('db')).then(
    (results) => {
      res.send(results);
    }
  );
});

module.exports = incomeCategoriesRouter;
