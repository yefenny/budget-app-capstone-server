BEGIN;

TRUNCATE
  "users",
  "income_categories",
  "incomes",
  "expense_categories",
  "expenses",
  "pancake";



INSERT INTO "users" ("id", "user_name","name", "password")
VALUES
  (
    1,
    'admin',
    'test admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "income_categories" ("id", "title")
VALUES
  (1, 'Salary'),
  (2, 'Dividends'),
  (3, 'Financial Aid'),
  (4, 'Gifts Received'),
  (5, 'Car Replacement Fund'),
  (6, 'Other Income'),
  (7, 'Refunds/Reimbursements'),
  (8, 'Rental Income'),
  (9, 'Wages & Tips')  ;

INSERT INTO "incomes" ("id", "user_id", "date", "description", "amount","income_category_id")
VALUES
  (1, 1, TO_DATE('2021/01/28','YYYY/MM/DD'),'Monthly payment',2000.00,1),
  (2, 1, TO_DATE('2021/01/29','YYYY/MM/DD'),'Aid',500.00,3);

INSERT INTO "expense_categories" ("id", "title")
VALUES
  (1, 'Alimony'),
  (2, 'Car Insurance'),
  (3, 'Car Payment'),
  (4, 'Car Repair / Licenses'),
  (5, 'Car Replacement Fund'),
  (6, 'Charity'),
  (7, 'Child Care'),
  (8, 'Cleaning'),
  (9, 'Clothing'),
  (10, 'Debt'),
  (11, 'Dining'),
  (12, 'Discretionary'),
  (13, 'Doctor / Dentist'),
  (14, 'Education'),
  (15, 'Emergency Fund'),
  (16, 'Fuel'),
  (17, 'Fun / Entertainment'),
  (18, 'Furniture / Appliances'),
  (19, 'Gifts Given'),
  (20, 'Groceries'),
  (21, 'Health Insurance'),
  (22, 'Home Insurance'),
  (23, 'Home Supplies'),
  (24, 'Interest Expense'),
  (25, 'Life Insurance'),
  (26, 'Medicine'),
  (27, 'Miscellaneous'),
  (28, 'Mortgage / Rent'),
  (29, 'Savings'),
  (30, 'Other Savings'),
  (31, 'Other'),
  (32, 'Personal Supplies'),
  (33, 'Retirement Fund'),
  (34, 'Subscriptions/Dues'),
  (35, 'Taxes'),
  (36, 'Util. Electricity'),
  (37, 'Util. Gas'),
  (38, 'Util. Phone(s)'),
  (39, 'Util. TV / Internet'),
  (40, 'Util. Water');

    INSERT INTO "expenses" ("id", "user_id", "date", "description", "amount","expense_category_id")
VALUES
  (1, 1, TO_DATE ('2021/02/01', 'YYYY/MM/DD'),'Supermarket 1',35.20,20),
  (2, 1, TO_DATE ('2021/02/06','YYYY/MM/DD'),'Supermarket 3',40.01,20),
  (3, 1, TO_DATE ('2021/02/12','YYYY/MM/DD'),'Rent',1200.00,28);


-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('users_id_seq', (SELECT MAX(id) from "users"));
SELECT setval('income_categories_id_seq', (SELECT MAX(id) from "income_categories"));
SELECT setval('expense_categories_id_seq', (SELECT MAX(id) from "expense_categories"));
SELECT setval('incomes_id_seq', (SELECT MAX(id) from "incomes"));
SELECT setval('expenses_id_seq', (SELECT MAX(id) from "expenses"));
SELECT setval('pancake_id_seq', (SELECT MAX(id) from "pancake"));

COMMIT;
