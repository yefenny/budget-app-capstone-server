const ExpensesCategoriesService = {
  getAllExpenseCategories(knex) {
    return knex('expense_categories').select('*');
  },
  getExpenseCategoryById(knex, id) {
    return knex('expense_categories').select('*').where('id', id).first();
  }
};

module.exports = ExpensesCategoriesService;
