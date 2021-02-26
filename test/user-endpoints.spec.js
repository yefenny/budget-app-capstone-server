const app = require('../src/app');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const supertest = require('supertest');
const helpers = require('./test-helpers');
const { expect, expectCt } = require('helmet');

describe('User endpoints', () => {
  let db;
  let users = helpers.makeUsersArray();
  const testUser = users[0];
  before('connect db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });
  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  /**
   * @description Register a users and populate their fields
   **/
  describe(`POST /api/users`, () => {
    beforeEach('insert users', () => helpers.seedUserTable(db, users));

    const requiredFields = ['user_name', 'password', 'name'];

    requiredFields.forEach((field) => {
      const registerAttemptBody = {
        user_name: 'test user_name',
        password: 'test password',
        name: 'test name'
      };

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete registerAttemptBody[field];

        return supertest(app)
          .post('/api/users')
          .send(registerAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`
          });
      });
    });

    it(`responds 400 'Password be longer than 8 characters' when empty password`, () => {
      const userShortPassword = {
        user_name: 'test user_name',
        password: '1234567',
        name: 'test name'
      };
      return supertest(app)
        .post('/api/users')
        .send(userShortPassword)
        .expect(400, { error: `Password be longer than 8 characters` });
    });

    it(`responds 400 'Password be less than 72 characters' when long password`, () => {
      const userLongPassword = {
        user_name: 'test user_name',
        password: '*'.repeat(73),
        name: 'test name'
      };
      return supertest(app)
        .post('/api/users')
        .send(userLongPassword)
        .expect(400, { error: `Password be less than 72 characters` });
    });

    it(`responds 400 error when password starts with spaces`, () => {
      const userPasswordStartsSpaces = {
        user_name: 'test user_name',
        password: ' 1Aa!2Bb@',
        name: 'test name'
      };
      return supertest(app)
        .post('/api/users')
        .send(userPasswordStartsSpaces)
        .expect(400, {
          error: `Password must not start or end with empty spaces`
        });
    });

    it(`responds 400 error when password ends with spaces`, () => {
      const userPasswordEndsSpaces = {
        user_name: 'test user_name',
        password: '1Aa!2Bb@ ',
        name: 'test name'
      };
      return supertest(app)
        .post('/api/users')
        .send(userPasswordEndsSpaces)
        .expect(400, {
          error: `Password must not start or end with empty spaces`
        });
    });

    it(`responds 400 error when password isn't complex enough`, () => {
      const userPasswordNotComplex = {
        user_name: 'test user_name',
        password: '11AAaabb',
        name: 'test name'
      };
      return supertest(app)
        .post('/api/users/')
        .send(userPasswordNotComplex)
        .expect(400, {
          error: `Password must contain one upper case, lower case, number and special character`
        });
    });

    it(`responds 400 'User name already taken' when user_name isn't unique`, () => {
      const duplicateUser = {
        user_name: testUser.user_name,
        password: '11AAaa!!',
        name: 'test name'
      };
      return supertest(app)
        .post('/api/users/')
        .send(duplicateUser)
        .expect(400, { error: `User_name already taken` });
    });

    describe(`Given a valid users`, () => {
      it('returns 200 user_name and password are valid', () => {
        const user = {
          user_name: 'name1',
          name: 'name 1',
          password: 'MyPassword@1'
        };

        return supertest(app).post('/api/users/').send(user).expect(200);
      });
    });
  });
});
