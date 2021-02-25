const IncomesService = {
  getAllIncomes(db, userId) {
    const query = `select i.id, i.date, i.description, i.amount, ic.title as category from incomes i join income_categories ic on ic.id = i.income_category_id where i.user_id = ${userId} ORDER BY i.date DESC;`;
    return db.raw(query).then((res) => res.rows);
  },
  getFilteredIncomes(db, fromDate, toDate, userId) {
    const query = `select i.id, i.date, i.description, i.amount, ic.title as category from incomes i join income_categories ic on ic.id = i.income_category_id where i.user_id = ${userId} and (i.date >= '${fromDate}' and i.date <= '${toDate} 23:59:59')`;
    return db.raw(query).then((res) => res.rows);
  },
  getIncomeById(db, id, userId) {
    return db('incomes').select('*').where({ user_id: userId, id: id }).first();
  },
  createIncome(db, values) {
    return db('incomes')
      .insert(values)
      .returning('*')
      .then((rows) => rows[0]);
  },
  deleteIncome(db, id, userId) {
    return db('incomes').where({ user_id: userId, id: id }).delete();
  },
  updateIncome(db, id, userId, values) {
    return db('incomes').where({ user_id: userId, id: id }).update(values);
  }
};
module.exports = IncomesService;
