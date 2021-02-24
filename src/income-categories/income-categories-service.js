const IncomesCategoriesService = {
  getAllIncomeCategories(knex) {
    return knex('income_categories').select('*');
  },
  getIncomeCategoryById(knex, id) {
    return knex('income_categories').select('*').where('id', id).first();
  }
};

module.exports = IncomesCategoriesService;
