const app = require('../src/app');
const knex = require('knex');
const supertest = require('supertest');
const helpers = require('./test-helpers');
const { expect } = require('chai');

describe('Incomes endpoint', () => {
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
  describe('Get all incomes', () => {
    beforeEach('insert incomeCategories', () =>
      db('income_categories').insert(helpers.makeIncomeCategoriesArray())
    );
    beforeEach('insert incomes', () =>
      db('incomes').insert(helpers.makeIncomessArray())
    );
    it('GET /api/incomes send 200 status and array', () => {
      return supertest(app)
        .get('/api/incomes')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(2);
        });
    });
  });
  describe('Get income by id', () => {
    beforeEach('insert incomeCategories', () =>
      db('income_categories').insert(helpers.makeIncomeCategoriesArray())
    );
    beforeEach('insert incomes', () =>
      db('incomes').insert(helpers.makeIncomessArray())
    );
    it('GET /api/incomes send 200 status and object', () => {
      return supertest(app)
        .get('/api/incomes/1')
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
            'income_category_id'
          );
        });
    });
    it('Send 400 invalid id', () => {
      return supertest(app)
        .get('/api/incomes/100')
        .set('Authorization', `bearer ${token}`)
        .expect(400, { error: 'Invalid id' });
    });
  });
  describe('POST incomes', () => {
    beforeEach('insert incomeCategories', () =>
      db('income_categories').insert(helpers.makeIncomeCategoriesArray())
    );
    it('Sends a 200 status code and an array', () => {
      let newExpense = {
        user_id: 1,
        date: new Date('2021/02/01'),
        description: 'Supermarket 1',
        amount: '35.20',
        income_category_id: 1
      };
      return supertest(app)
        .post('/api/incomes')
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
        income_category_id: 2
      };
      return supertest(app)
        .post('/api/incomes')
        .set('Authorization', `bearer ${token}`)
        .send(newExpense)
        .expect(400, {
          error: `Introduce a valid Date`
        });
    });
    it('returns status code 400 when invalid income_category_id', () => {
      let newExpense = {
        user_id: '1',
        date: '2021/02/1',
        description: 'Supermarket 1',
        amount: '10.3',
        income_category_id: '20'
      };
      return supertest(app)
        .post('/api/incomes')
        .set('Authorization', `bearer ${token}`)
        .send(newExpense)
        .expect(400, {
          error: `Invalid income_category_id `
        });
    });
    it('returns status code 400 when invalid amount', () => {
      let newExpense = {
        user_id: 1,
        date: '2021/02/1',
        description: 'Supermarket 1',
        amount: 'sss',
        income_category_id: 1
      };
      return supertest(app)
        .post('/api/incomes')
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
        income_category_id: 1
      };
      return supertest(app)
        .post('/api/incomes')
        .set('Authorization', `bearer ${token}`)
        .send(newExpense)
        .expect(400, {
          error: `Description is required`
        });
    });
  });
  describe('DELETE income', () => {
    beforeEach('insert incomeCategories', () =>
      db('income_categories').insert(helpers.makeIncomeCategoriesArray())
    );
    beforeEach('insert incomes', () =>
      db('incomes').insert(helpers.makeIncomessArray())
    );
    it('DELETE /api/incomes/:id send 204 status ', () => {
      return supertest(app)
        .delete('/api/incomes/1')
        .set('Authorization', `bearer ${token}`)
        .expect(204);
    });
    it('send 400 when invalid id ', () => {
      return supertest(app)
        .delete('/api/incomes/100')
        .set('Authorization', `bearer ${token}`)
        .expect(400, { error: 'Income does not exists' });
    });
  });
  describe('UPDATE incomes', () => {
    beforeEach('insert incomeCategories', () =>
      db('income_categories').insert(helpers.makeIncomeCategoriesArray())
    );
    beforeEach('insert incomes', () =>
      db('incomes').insert(helpers.makeIncomessArray())
    );
    it('Returns 201 status code', () => {
      let toUpdate = {
        date: '2021/02/11',
        description: 'Supermarket 2',
        amount: '35.20',
        income_category_id: 2
      };

      return supertest(app)
        .patch('/api/incomes/1')
        .set('Authorization', `bearer ${token}`)
        .send(toUpdate)
        .expect(201)
        .then(() => {
          return supertest(app)
            .get('/api/incomes/1')
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
        income_category_id: 2
      };
      return supertest(app)
        .patch('/api/incomes')
        .set('Authorization', `bearer ${token}`)
        .send(newExpense)
        .expect(400, {
          error: `Introduce a valid Date`
        });
    });
    it('returns status code 400 when invalid income_category_id', () => {
      let newExpense = {
        user_id: '1',
        date: '2021/02/1',
        description: 'Supermarket 1',
        amount: '10.3',
        income_category_id: '20'
      };
      return supertest(app)
        .patch('/api/incomes')
        .set('Authorization', `bearer ${token}`)
        .send(newExpense)
        .expect(400, {
          error: `Invalid income_category_id `
        });
    });
    it('returns status code 400 when invalid amount', () => {
      let newExpense = {
        user_id: 1,
        date: '2021/02/1',
        description: 'Supermarket 1',
        amount: 'sss',
        income_category_id: 1
      };
      return supertest(app)
        .patch('/api/incomes')
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
        income_category_id: 1
      };
      return supertest(app)
        .patch('/api/incomes')
        .set('Authorization', `bearer ${token}`)
        .send(newExpense)
        .expect(400, {
          error: `Description is required`
        });
    });
  });
  describe('FILTER incomes by query', () => {
    beforeEach('insert incomeCategories', () =>
      db('income_categories').insert(helpers.makeIncomeCategoriesArray())
    );
    beforeEach('insert incomes', () =>
      db('incomes').insert(helpers.makeIncomessArray())
    );
    it('returns 200 and an array of objects', () => {
      return supertest(app)
        .get('/api/incomes/find/1-29-2021/01-29-2021')
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array');
        });
    });
  });
});
