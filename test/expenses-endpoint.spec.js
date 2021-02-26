const app = require('../src/app');
const knex = require('knex');
const supertest = require('supertest');
const helpers = require('./test-helpers');
const { expect } = require('chai');

describe('Expenses endpoint', () => {
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
  describe('Get all expenses', () => {
    beforeEach('insert expenseCategories', () =>
      db('expense_categories').insert(helpers.makeExpensesCategoriesArray())
    );
    beforeEach('insert expenses', () =>
      db('expenses').insert(helpers.makeExpensesArray())
    );
    it('GET /api/expenses send 200 status and array', () => {
      return supertest(app)
        .get('/api/expenses')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(2);
        });
    });
  });
  describe('Get expense by id', () => {
    beforeEach('insert expenseCategories', () =>
      db('expense_categories').insert(helpers.makeExpensesCategoriesArray())
    );
    beforeEach('insert expenses', () =>
      db('expenses').insert(helpers.makeExpensesArray())
    );
    it('GET /api/expenses send 200 status and object', () => {
      return supertest(app)
        .get('/api/expenses/1')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.keys(
            'user_id',
            'id',
            'date',
            'description',
            'amount',
            'expense_category_id'
          );
        });
    });
    it('Send 400 invalid id', () => {
      return supertest(app)
        .get('/api/expenses/100')
        .set('Authorization', `bearer ${token}`)
        .expect(400, { error: 'Invalid id' });
    });
  });
  describe('POST expenses', () => {
    beforeEach('insert expenseCategories', () =>
      db('expense_categories').insert(helpers.makeExpensesCategoriesArray())
    );
    it('Sends a 200 status code and an array', () => {
      let newExpense = {
        user_id: 1,
        date: new Date('2021/02/01'),
        description: 'Supermarket 1',
        amount: '35.20',
        expense_category_id: 1
      };
      return supertest(app)
        .post('/api/expenses')
        .set('Authorization', `bearer ${token}`)
        .send(newExpense)
        .expect(201)
        .then((res) => {
          expect(res.body).to.be.an('object');
        });
    });
    it('returns status code 400 when invalid date', () => {
      let newExpense = {
        user_id: 1,
        date: '2021/02/41',
        description: 'Supermarket 1',
        amount: '35.20',
        expense_category_id: 2
      };
      return supertest(app)
        .post('/api/expenses')
        .set('Authorization', `bearer ${token}`)
        .send(newExpense)
        .expect(400, {
          error: `Introduce a valid Date`
        });
    });
    it('returns status code 400 when invalid expense_category_id', () => {
      let newExpense = {
        user_id: '1',
        date: '2021/02/1',
        description: 'Supermarket 1',
        amount: '10.3',
        expense_category_id: '20'
      };
      return supertest(app)
        .post('/api/expenses')
        .set('Authorization', `bearer ${token}`)
        .send(newExpense)
        .expect(400, {
          error: `Invalid expense_category_id `
        });
    });
    it('returns status code 400 when invalid amount', () => {
      let newExpense = {
        user_id: 1,
        date: '2021/02/1',
        description: 'Supermarket 1',
        amount: 'sss',
        expense_category_id: 1
      };
      return supertest(app)
        .post('/api/expenses')
        .set('Authorization', `bearer ${token}`)
        .send(newExpense)
        .expect(400, {
          error: `Amount should be numeric`
        });
    });
    it('returns status code 400 when empty description', () => {
      let newExpense = {
        user_id: 1,
        date: new Date('2021/02/01'),
        description: ' ',
        amount: '35.20',
        expense_category_id: 1
      };
      return supertest(app)
        .post('/api/expenses')
        .set('Authorization', `bearer ${token}`)
        .send(newExpense)
        .expect(400, {
          error: `Description is required`
        });
    });
  });
  describe('DELETE expense', () => {
    beforeEach('insert expenseCategories', () =>
      db('expense_categories').insert(helpers.makeExpensesCategoriesArray())
    );
    beforeEach('insert expenses', () =>
      db('expenses').insert(helpers.makeExpensesArray())
    );
    it('DELETE /api/expenses/:id send 204 status ', () => {
      return supertest(app)
        .delete('/api/expenses/1')
        .set('Authorization', `bearer ${token}`)
        .expect(204);
    });
    it('send 400 when invalid id ', () => {
      return supertest(app)
        .delete('/api/expenses/100')
        .set('Authorization', `bearer ${token}`)
        .expect(400, { error: 'Expense does not exists' });
    });
  });
  describe('UPDATE expenses', () => {
    beforeEach('insert expenseCategories', () =>
      db('expense_categories').insert(helpers.makeExpensesCategoriesArray())
    );
    beforeEach('insert expenses', () =>
      db('expenses').insert(helpers.makeExpensesArray())
    );
    it('Returns 201 status code', () => {
      let toUpdate = {
        date: '2021/02/11',
        description: 'Supermarket 2',
        amount: '35.20',
        expense_category_id: 2
      };

      return supertest(app)
        .patch('/api/expenses/1')
        .set('Authorization', `bearer ${token}`)
        .send(toUpdate)
        .expect(201)
        .then(() => {
          return supertest(app)
            .get('/api/expenses/1')
            .set('Authorization', `bearer ${token}`)
            .expect(200)
            .then((res) => {
              expect(res.body).to.be.an('object');
            });
        });
    });
    it('returns status code 400 when invalid date', () => {
      let newExpense = {
        user_id: 1,
        date: '2021/02/41',
        description: 'Supermarket 1',
        amount: '35.20',
        expense_category_id: 2
      };
      return supertest(app)
        .patch('/api/expenses')
        .set('Authorization', `bearer ${token}`)
        .send(newExpense)
        .expect(400, {
          error: `Introduce a valid Date`
        });
    });
    it('returns status code 400 when invalid expense_category_id', () => {
      let newExpense = {
        user_id: '1',
        date: '2021/02/1',
        description: 'Supermarket 1',
        amount: '10.3',
        expense_category_id: '20'
      };
      return supertest(app)
        .patch('/api/expenses')
        .set('Authorization', `bearer ${token}`)
        .send(newExpense)
        .expect(400, {
          error: `Invalid expense_category_id `
        });
    });
    it('returns status code 400 when invalid amount', () => {
      let newExpense = {
        user_id: 1,
        date: '2021/02/1',
        description: 'Supermarket 1',
        amount: 'sss',
        expense_category_id: 1
      };
      return supertest(app)
        .patch('/api/expenses')
        .set('Authorization', `bearer ${token}`)
        .send(newExpense)
        .expect(400, {
          error: `Amount should be numeric`
        });
    });
    it('returns status code 400 when empty description', () => {
      let newExpense = {
        user_id: 1,
        date: new Date('2021/02/01'),
        description: ' ',
        amount: '35.20',
        expense_category_id: 1
      };
      return supertest(app)
        .patch('/api/expenses')
        .set('Authorization', `bearer ${token}`)
        .send(newExpense)
        .expect(400, {
          error: `Description is required`
        });
    });
  });
  describe('FILTER expenses by query', () => {
    beforeEach('insert expenseCategories', () =>
      db('expense_categories').insert(helpers.makeExpensesCategoriesArray())
    );
    beforeEach('insert expenses', () =>
      db('expenses').insert(helpers.makeExpensesArray())
    );
    it('returns 200 and an array of objects', () => {
      return supertest(app)
        .get('/api/expenses/find/1-29-2021/01-29-2021')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array');
        });
    });
  });
});
