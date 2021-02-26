const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../src/config');
require('dotenv').config();

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      name: 'Test user 1',
      password: 'password'
    },
    {
      id: 2,
      user_name: 'test-user-2',
      name: 'Test user 2',
      password: 'password'
    }
  ];
}
function makeExpensesCategoriesArray() {
  return [
    {
      id: 1,
      title: 'test category 1'
    },
    {
      id: 2,
      title: 'test category 2'
    }
  ];
}

function makeExpensesArray() {
  return [
    {
      id: 1,
      user_id: 1,
      date: new Date(),
      description: 'expense description 1',
      amount: 100,
      expense_category_id: 1
    },
    {
      id: 2,
      user_id: 1,
      date: new Date(),
      description: 'expense description 1',
      amount: 100,
      expense_category_id: 1
    }
  ];
}

function makeIncomeCategoriesArray() {
  return [
    {
      id: 1,
      title: 'test income category 1'
    },
    {
      id: 2,
      title: 'test income category 2'
    }
  ];
}

function makeIncomessArray() {
  return [
    {
      id: 1,
      user_id: 1,
      date: new Date(),
      description: 'income description 1',
      amount: 100,
      income_category_id: 1
    },
    {
      id: 2,
      user_id: 1,
      date: new Date(),
      description: 'income description 1',
      amount: 100,
      income_category_id: 1
    }
  ];
}

function makeExerciseMuscleArray() {
  return [
    { id: 1, exercise_id: 1, muscle_id: 10 },
    { id: 2, exercise_id: 2, muscle_id: 10 }
  ];
}

async function seedIncomeCategories(db, incomeCategories) {
  await db.transaction(async (trx) => {
    await trx.into('income_categories').insert(incomeCategories);

    await Promise.all([
      trx.raw(`SELECT setval('income_categories_id_seq', ?)`, [
        incomeCategories[incomeCategories.length - 1].id
      ])
    ]);
  });
}
async function seedIncomes(db, incomes) {
  await db.transaction(async (trx) => {
    await trx.into('incomes').insert(incomes);

    await Promise.all([
      trx.raw(`SELECT setval('incomes_id_seq', ?)`, [
        incomes[incomes.length - 1].id
      ])
    ]);
  });
}
async function seedExpenseCategories(db, expenseCategories) {
  await db.transaction(async (trx) => {
    await trx.into('expense_categories').insert(expenseCategories);

    await Promise.all([
      trx.raw(`SELECT setval('expense_categories_id_seq', ?)`, [
        expenseCategories[expenseCategories.length - 1].id
      ])
    ]);
  });
}
async function seedExpenses(db, expenses) {
  await db.transaction(async (trx) => {
    await trx.into('expenses').insert(expenses);

    await Promise.all([
      trx.raw(`SELECT setval('expenses_id_seq', ?)`, [
        expenses[expenses.length - 1].id
      ])
    ]);
  });
}

function cleanTables(db) {
  return db.transaction((mdb) =>
    mdb
      .raw(
        'TRUNCATE users, income_categories, incomes, expense_categories , expenses, pancake'
      )
      .then(() =>
        Promise.all([
          mdb.raw(
            `TRUNCATE  users, income_categories, incomes, expense_categories , expenses, pancake RESTART IDENTITY CASCADE`
          )
        ])
      )
  );
}
function seedUserTable(db, users) {
  const hashedUser = users.map((user) => {
    return {
      ...user,
      password: bcrypt.hashSync(user.password, 7)
    };
  });
  return db('users')
    .insert(hashedUser)
    .then(() => {
      return db.raw(
        `SELECT setval('users_id_seq',?)`,
        users[users.length - 1].id
      );
    });
}

function jwtToken(subject, payload) {
  return jwt.sign(payload, config.JWT_SECRET, {
    subject,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
}

module.exports = {
  makeUsersArray,
  cleanTables,
  seedUserTable,
  jwtToken,
  makeExpensesCategoriesArray,
  makeExpensesArray,
  makeIncomessArray,
  makeIncomeCategoriesArray,
  seedExpenseCategories,
  seedExpenses,
  seedIncomeCategories,
  seedIncomes
};
