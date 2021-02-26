const app = require('../src/app');
const knex = require('knex');
const supertest = require('supertest');
const helpers = require('./test-helpers');
const { expect } = require('chai');

describe('Balance endpoint', () => {
  let db;
  let users = helpers.makeUsersArray();
  let user = users[0];
  const sub = user.user_name;
  const payload = {
    user_id: user.id,
    name: user.name
  };
  let token = helpers.jwtToken(sub, payload);
  before('connect db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });
  after('disconnect db', () => db.destroy());
  beforeEach('clean table', () => helpers.cleanTables(db));
  afterEach('clean table', () => helpers.cleanTables(db));
  beforeEach('insert some users', () => {
    return db('users').insert(users);
  });
  describe('Get balances', () => {
    beforeEach('insert incomeCategories', () =>
      db('income_categories').insert(helpers.makeIncomeCategoriesArray())
    );
    beforeEach('insert incomes', () =>
      db('incomes').insert(helpers.makeIncomessArray())
    );
    beforeEach('insert expenseCategories', () =>
      db('expense_categories').insert(helpers.makeExpensesCategoriesArray())
    );
    beforeEach('insert expenses', () =>
      db('expenses').insert(helpers.makeExpensesArray())
    );
    it('GET /api/balances send 200 status an object', () => {
      return supertest(app)
        .get('/api/balances')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.keys(
            'starting_balance',
            'incomes',
            'expenses',
            'current_balance'
          );
        });
    });
  });
});
