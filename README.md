# Express-TS Expense Tracker

A lightweight RESTful Expense Tracker API built with:

- **Express** & **TypeScript**
- **Mongoose** & **MongoDB**
- **JWT**-based authentication
- **ESLint** & **Prettier** for code quality
- **express-validator** for request validation

---

## 📦 Features

- **User signup / login** with JWT
- **CRUD** endpoints for categorized expenses
- **Date-range & preset filters** (past week, month, custom)
- **Type-safe** data models & request DTOs
- **Centralized** error handling (`AppError`)
- **Secure** routes via an `auth` middleware

---

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone git@github.com:yourUser/express-ts-expense-tracker.git
cd express-ts-expense-tracker
npm install
```

### 2. Environment

Copy the example and fill in your values

```bash
cp .env.example .env
```

Then edit your .env:

```bash
# .env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=1h
BCRYPT_SALT_ROUNDS=10
DUMMY_PASSWORD_HASH=<a bcrypt hash of any dummy string>
```

## 🔌 API Endpoints

### Auth

| Method | Path               | Body                  | Returns                             |
| ------ | ------------------ | --------------------- | ----------------------------------- |
| POST   | `/api/auth/signup` | `{ email, password }` | `{ success, data: { id, email }}`   |
| POST   | `/api/auth/login`  | `{ email, password }` | `{ success, data: { user, token }}` |

### Expenses (protected – include Authorization: Bearer <token>)

| Method | Path                       | Query / Body                                     | Returns                             |
| ------ | -------------------------- | ------------------------------------------------ | ----------------------------------- |
| GET    | `/api/expenses`            | `?start=YYYY-MM-DD&end=…` or `?period=past_week` | `{ success, data: IExpense[] }`     |
| POST   | `/api/expenses`            | `{ amount, category, date, notes? }`             | `{ success, data: IExpense }`       |
| GET    | `/api/expenses/:expenseId` | —                                                | `{ success, data: IExpense }`       |
| PUT    | `/api/expenses/:expenseId` | `Partial<{ amount, category, date, notes }>`     | `{ success, message }` (204 or 200) |
| DELETE | `/api/expenses/:expenseId` | —                                                | `{ success, message }` (204 or 200) |
