const app = require('../src/app');
const knex = require('knex');
const supertest = require('supertest');
const helpers = require('./test-helpers');
const { expect } = require('chai');

describe('Expense categories endpoint', () => {
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
  describe('Get all expense categories', () => {
    beforeEach('insert expenseCategories', () =>
      db('expense_categories').insert(helpers.makeExpensesCategoriesArray())
    );
    it('GET /api/expense-categories send 200 status and array', () => {
      return supertest(app)
        .get('/api/expense-categories')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(2);
        });
    });
  });
});
