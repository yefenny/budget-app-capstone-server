const BalancesService = {
  getBalance(knex, userId) {
    const query = `with incomes_total as (
      select sum(incomes.amount) as total from incomes where date < date_trunc('month', CURRENT_DATE) and user_id = ${userId}
    ), expenses_total as (
      select sum(expenses.amount) as total from expenses where date < date_trunc('month', CURRENT_DATE) and user_id = ${userId}
    ), month_incomes as (
      select sum(incomes.amount) as total from incomes where( date_part('month',  current_timestamp) =  date_part('month',  date)) and user_id = ${userId}
    ), month_expenses as (
        select sum(expenses .amount) as total from expenses where( date_part('month',  current_timestamp) =  date_part('month',  date)) and user_id = ${userId}
    )
    
    select (COALESCE(it.total, 0)- COALESCE(et.total,0) ) as starting_balance, coalesce(mi.total,0) as incomes, COALESCE(me.total,0) as expenses,(COALESCE(it.total, 0)- COALESCE(et.total,0)+ COALESCE(mi.total,0) - COALESCE(me.total,0)) as current_balance from incomes_total it, expenses_total et, month_incomes mi, month_expenses me;`;
    return knex.raw(query).then((res) => res.rows[0]);
  }
};

module.exports = BalancesService;
