const express = require('express');
const BalancesService = require('./balances-service');

const balanceRouter = express.Router();

balanceRouter.route('/').get((req, res, next) => {
  const { id } = req.user;
  BalancesService.getBalance(req.app.get('db'),id).then((results) => {
    res.send(results);
  });
});

module.exports = balanceRouter;
