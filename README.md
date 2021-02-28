# Budget app

Don't know how you expend all your money ? Budget app can help you, This app allows you to track your expenses and incomes easily an get in control of your spending!

### 1. Working Prototype

You can access a working prototype of the React app here:https://budget-app-capstone-client.vercel.app/ and Node app here: https://budget-app-capstone.herokuapp.com/

### 2. User Stories

###### Landing Page (Importance - High) (Est: 1h)

- as a visitor
- I want to understand what I can do with this app (or sign up, or log in)
- so I can decide if I want to use it

###### Login Page (Importance - High) (Est: 3h)

- As a returning register user
- I want to enter my password and username to use this app,
- So I can have access to my account.

###### Sign Up (Importance - High) (Est: 3h)

- As a visitor
- I want to register to use this app
- So I can create a personal account.

###### Home Page (Importance - Medium) (Est: 2h)

- As a logged-in user,
- I want to be able to preview the content of the app,
- So i can decide what section I want to navigate to.
- I can see the month initial balance.
- I can see the total amount of my month expenses.
- I can see the total amount of my month incomes.
- I would be able to see the current balance.

###### Expenses Page (Importance - Medium) (Est: 3h)

- As a logged-in user,
- I would be able to see all month expenses,
- I can choose to edit or delete any expense,
- I can filter all expenses by date.

###### New Expense Page (Importance - Medium) (Est: 3h)

- As a logged-in user,
- I would be able to add a new expense.
- The new expense will have date, category, title and amount.

###### Edit Expense Page (Importance - Medium) (Est: 3h)

- As a logged-in user,
- I would be able to edit a existing expense.

###### Incomes Page (Importance - Medium) (Est: 3h)

- As a logged-in user,
- I would be able to see all month incomes,
- I can choose to edit or delete any income,
- I can filter all incomes by date.

###### New Income Page (Importance - Medium) (Est: 3h)

- As a logged-in user,
- I would be able to add a new income.
- The new income will have date, category, title and amount.

###### Edit Income Page (Importance - Medium) (Est: 3h)

- As a logged-in user,
- I would be able to edit a existing income.

### 3. Functionality

The app's functionality includes:

- Every User has the ability to create an account and log in.
- A logged in User has the ability to add see the total amount of incomes and expenses.
- A logged in User can add new incomes and expenses.
- A logged in User can filter incomes and expenses by date.
- A logged in user can delete or edit an income or expense.

### 4. Technology

- Front-End: HTML5, CSS3, JavaScript ES6, React
- Back-End: Node.js, Express.js, Mocha, Chai, RESTful API Endpoints, Postgres
- Development Environment: Heroku, DBeaver

### 5. Wireframes (to do now)

Landing Page
:-------------------------:
![Landing Page](./github-images/wireframes/Budget-app-landigpage.png)
Sign Up Page
![Sign Up Page](./github-images/wireframes/Budget-app-signup.png)
Log in Page
![Log in Page](./github-images/wireframes/Budget-app-login.png)
Dashboard Page
![Dashboard Page](./github-images/wireframes/Budget-app-home-page.png)
Incomes Page
![Incomes Page](./github-images/wireframes/Budget-app-incomes-page.png)
New Income Page
![New income Page](./github-images/wireframes/Budget-app-new-income.png)
Edit Income Page
![Edit income Page](./github-images/wireframes/Budget-app-edit-income.png)
Expenses Page
![Expense Page](./github-images/wireframes/Budget-app-expenses.png)
New Expense Page
![New expense Page](./github-images/wireframes/Budget-app-new-expense.png)
Edit Expense Page
![Edit Expense Page](./github-images/wireframes/Budget-app-edit-expense.png)

### 6. Front-end Structure - React Components Map (to do later)

- (Example) **Index.js** (stateless)
  - **App.js** (stateful)
    - **LandingPage.js** (stateful) - gets the _"prop name"_ and the _"callback prop name"_ from the **App.js**
      - **Login.js** (stateful) -
      - **Register.js** (stateful) -
    - **Navbar.js** (stateless) -

### 7. Back-end Structure - Business Objects

- users (database table)

  - id (auto-generated)
  - username (email validation)
  - password (at least 8 chars, at least one alpha and a special character validation)

- income_categories (database table)

  - id (auto-generated)
  - title (varchar validation)

- incomes (database table)

  - id (auto-generated)
  - user_id (foreign key from users table)
  - date (date validation)
  - description (varchar (255) not null)
  - amount (double not null )
  - income_category_id (foreign key from income_category table);

- expense_categories (database table)

  - id (auto-generated)
  - title (varchar validation)

- expenses (database table)
  - id (auto-generated)
  - user_id (foreign key from users table)
  - date (date validation)
  - description (varchar (255) not null)
  - amount (double not null )
  - expense_category_id (foreign key from income_category table);

### 8. API Documentation (to do later)

API Documentation details:

```text
/api
.
├── /incomes
│   └── GET
│       ├── /
│       ├── /find/:fromDate/:toDate
│       ├── /:id
│   └── POST
│       ├── /
│   └── PATCH
│       ├── /:id
│   └── DELETE
│       ├── /:id
├── /users
│   └── POST
│       ├── /
├── /auth
│   └── POST
│       └── /token
├── /expenses
│   └── GET
│       ├── /
│       ├── /:id
│       ├── /find/:fromDate/:toDate
│   └── POST
│       └── /
│   └── PATCH
│       └── /:id
│   └── DELETE
│       └── /:id
├── /expense-categories
│   └── GET
│       ├── /
├── /income-categories
│   └── GET
│       ├── /
```

#### GET `/api/incomes/`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// res.body
[

     {
        "id": 7,
        "date": "2021-02-25T05:00:00.000Z",
        "description": "Other",
        "amount": 100,
        "category": "Other Income"
    },
    {
        "id": 3,
        "date": "2021-02-01T05:00:00.000Z",
        "description": "Supermarket 22",
        "amount": 40,
        "category": "Financial Aid"
    },
    {
        "id": 8,
        "date": "2021-02-01T05:00:00.000Z",
        "description": "Supermarket 1",
        "amount": 35.2,
        "category": "Financial Aid"
    },
   ...
]
```

#### GET `/api/incomes/:id`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// req.params
{
  id:id
}

// res.body

 {
        "id": 8,
        "date": "2021-02-01T05:00:00.000Z",
        "description": "Supermarket 1",
        "amount": 35.2,
        "category": "Financial Aid"
}


```

#### GET `/api/income-categories/`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// res.body
[

    {
        "id": 1,
        "title": "Salary"
    },
    {
        "id": 2,
        "title": "Dividends"
    },
    {
        "id": 3,
        "title": "Financial Aid"
    },
   ...
]
```

#### GET `/api/incomes/find/:fromDate/:toDate`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}
// req.params
{
  fromDate:fromDate,
  toDate:toDate
}

// res.body
[

     {
        "id": 2,
        "date": "2021-01-29T05:00:00.000Z",
        "description": "Aid 2",
        "amount": 500,
        "category": "Financial Aid"
    },
   ...
]
```

#### POST `/api/incomes/`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// req.body

 {"user_id": "1",
  "date": "2021/02/01",
  "description": "Supermarket 1",
  "amount": "35.20",
  "income_category_id":"3"}

// res.body

{
    "id": 9,
    "user_id": 1,
    "date": "2021-02-01T05:00:00.000Z",
    "description": "Supermarket 1",
    "amount": 35.2,
    "income_category_id": 3
}

```

#### PATCH `/api/incomes/:id`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// req.body
{
  id: id
}
// res.body

 { "date": "2021/02/11",
 "description": "Supermarket 2",
 "amount": "35.20",
 "income_category_id":"3"}

// res.body

  {

}

```

#### Delete `/api/incomes/:id`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// req.params
{
  id:id
}


// res.body

  {

}

```

#### POST `/api/auth/token`

```js

// req.body


  {
    "user_name": "user test",
"password": "password"
}


// res.body


{
    "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2MTE4Nzk2NzUsInN1YiI6ImR1bmRlckBnbWFpbC5jb20ifQ.ku3rU1lGeWVEUvA-_NWDQoM7hauIZU1V4K0EmPgMwlY"
}


```

#### POST `/api/users/`

```js

// req.body

{
"user_name": "test@gmail.com",
"name": "test name",
"password": "testpassword"
}



// res.body


{
    "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2MTE4Nzk2NzUsInN1YiI6ImR1bmRlckBnbWFpbC5jb20ifQ.ku3rU1lGeWVEUvA-_NWDQoM7hauIZU1V4K0EmPgMwlY"
}


```

#### GET `/api/expenses/

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// res.body
[
   {
        "id": 5,
        "date": "2021-02-25T05:00:00.000Z",
        "description": "G",
        "amount": 333,
        "category": "Groceries"
    },
    {
        "id": 3,
        "date": "2021-02-12T05:00:00.000Z",
        "description": "Rent",
        "amount": 1200,
        "category": "Mortgage / Rent"
    },
    ...
]


```

#### GET `/api/expenses/:id`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// req.params
{
  id: id
}

// res.body

   {
        "id": 5,
        "date": "2021-02-25T05:00:00.000Z",
        "description": "G",
        "amount": 333,
        "category": "Groceries"
    }



```

#### GET `/api/expenses/find/:fromDate/:toDate`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// req.params
{
  fromDate:fromDate,
  toDate:toDate
}

// res.body

   [
    {
        "id": 2,
        "date": "2021-02-06T05:00:00.000Z",
        "description": "Supermarket 3",
        "amount": 40.01,
        "category": "Groceries"
    },
    {
        "id": 3,
        "date": "2021-02-12T05:00:00.000Z",
        "description": "Rent",
        "amount": 1200,
        "category": "Mortgage / Rent"
    },
]


```

#### POST `/api/expenses/`

```js

// req.header
{
    "Authorization": "Bearer ${token}",
}
// req.body

{"user_id": "1",
 "date": "2021/02/01",
 "description": "Supermarket 1",
 "amount": "35.20",
 "expense_category_id":"3"
 }



// res.body


{
    "id": 7,
    "user_id": 1,
    "date": "2021-02-01T05:00:00.000Z",
    "description": "Supermarket 1",
    "amount": 35.2,
    "expense_category_id": 3
}


```

#### PATCH `/api/expenses/:id`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// req.params
{
  id: id
}

// req.body

{ "date": "2021/02/11",
"description": "Supermarket 2",
"amount": "35.20",
"expense_category_id":"3"
}

```

#### DELETE `/api/expenses/:id`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// req.params
{
  id:id
}

// res.body

{
}

```

#### GET `/api/expense-categories/`

```js
// req.header
{
    "Authorization": "Bearer ${token}",
}

// res.body
[

    {
        "id": 1,
        "title": "Alimony"
    },
    {
        "id": 2,
        "title": "Car Insurance"
    },
    {
        "id": 3,
        "title": "Car Payment"
    },
    {
        "id": 4,
        "title": "Car Repair / Licenses"
    },
   ...
]
```

### 9. Screenshots (to do later)

(Example) Landing Page
:-------------------------:
![Landing Page](/github-images/screenshots/landing-page-screenshot.png)
Register Page
![Register Page](/github-images/screenshots/register-page-screenshot.png)

### 10. Development Roadmap (to do later)

This is v1.0 of the app, but future enhancements are expected to include:

- (Example) add more functionality

### 11. How to run it (done)

Use command line to navigate into the project folder and run the following in terminal

##### Local React scripts

- To install the react project ===> npm install
- To run react (on port 3000) ===> npm start
- To run tests ===> npm run test

##### Local Node scripts

- To install the node project ===> npm install
- To migrate the database ===> npm run migrate -- 1
- To run Node server (on port 8000) ===> npm run dev
- To run tests ===> npm run test
