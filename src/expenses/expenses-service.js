const ExpensesService = {
  getAllExpenses(db, userId) {
    const query = `select e.id, e.date, e.description, e.amount, ec.title as category from expenses e join expense_categories ec on ec.id = e.expense_category_id where e.user_id = ${userId} ORDER BY e.date DESC;`;
    return db.raw(query).then((res) => res.rows);
  },
  getFilteredExpenses(db, fromDate, toDate, userId) {
    const query = `select e.id, e.date, e.description, e.amount, ec.title as category from expenses e join expense_categories ec on ec.id = e.expense_category_id where e.user_id = ${userId} and (e.date >= '${fromDate}' and e.date <= '${toDate} 23:59:59')`;
    return db.raw(query).then((res) => res.rows);
  },
  getExpenseById(db, id, userId) {
    return db('expenses').select('*').where({ user_id: userId, id: id }).first();
  },
  createExpense(db, values) {
    return db('expenses')
      .insert(values)
      .returning('*')
      .then((rows) => rows[0]);
  },
  deleteExpense(db, id, userId) {
    return db('expenses').where({ user_id: userId, id: id }).delete();
  },
  updateExpense(db, id, userId, values) {
    return db('expenses').where({ user_id: userId, id: id }).update(values);
  }
};
module.exports = ExpensesService;
