
# 🧶 Naxxa Crochet Backend

A scalable, full-featured e-commerce API built with TypeScript, Express, and Prisma for the Naxxa Crochet store. It handles everything from authentication, orders, and reviews to payments and image uploads.

---

## ⚙️ Tech Stack

- **Node.js** + **Express.js (v5)**
- **TypeScript**
- **Prisma ORM** + PostgreSQL
- **JWT** + **Google OAuth**
- **Zod** for schema validation
- **Cloudinary** for media uploads
- **Multer** for file handling
- **Paystack Webhooks**
- **Nodemailer** for emails

---

## 📁 Project Structure

```

src/
├── config/            # App config (passport, multer, cors)
├── controllers/       # Business logic handlers
├── db/                # Prisma client
├── generated/         # Prisma-generated types
├── lib/               # Zod schemas & reusable types
├── middlewares/       # Auth, validation, file parsing
├── routes/            # Express routers
├── services/          # Business layer utilities
├── utils/             # Helpers (e.g. JWT, email)
├── app.ts             # Express app config
└── server.ts          # Entry point

````

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/IamHenryOkeke/naxxa-crochet-backend.git
cd naxxa-crochet-backend
npm install
````

### 2. Set Up Environment

* Create a `.env` file based on `.env.example`
* Example:

```env
PORT=5000
DATABASE_URL=xxxxx
JWT_SECRET=xxxxxx
GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
SMTP_USER=xxxx
SMTP_PASS=xxxxx
PAYSTACK_SECRET_KEY=xxxxx
```

### 3. Run Dev Server

```bash
npx prisma migrate dev --name init
npm run dev
```

---

## 🧪 Scripts

| Script              | Description              |
| ------------------- | ------------------------ |
| `npm run dev`       | Start server in dev mode |
| `npm run build`     | Build TypeScript project |
| `npm start`         | Start production build   |
| `npx prisma studio` | Visual DB management UI  |

---

## 🔐 Authentication

* JWT (30-min expiry)
* Google OAuth login
* Email verification & password reset
* Middleware: `isAuthenticated`, `isAdmin`

### Auth Routes

| Method | Endpoint                              | Description                  |
| ------ | ------------------------------------- | ---------------------------- |
| POST   | `/api/auth/sign-up`                   | Register user                |
| POST   | `/api/auth/login`                     | Login with email & password  |
| GET    | `/api/auth/verify-account`            | Verify email via token       |
| POST   | `/api/auth/request-verification-link` | Resend verification link     |
| POST   | `/api/auth/request-password-reset`    | Send reset email             |
| POST   | `/api/auth/reset-password`            | Reset password               |
| GET    | `/api/auth/google`                    | Google OAuth login           |
| GET    | `/api/auth/google/callback`           | OAuth callback (returns JWT) |

---

## 🛒 Cart API

| Method | Endpoint                | Description           |
| ------ | ----------------------- | --------------------- |
| GET    | `/api/cart`             | Get items in cart     |
| POST   | `/api/cart`             | Add item to cart      |
| PUT    | `/api/cart/:cartItemId` | Update item quantity  |
| DELETE | `/api/cart/:cartItemId` | Remove item from cart |

> Requires user to be authenticated.

---

## 🗂️ Category API

| Method | Endpoint                      | Access     | Description             |
| ------ | ----------------------------- | ---------- | ----------------------- |
| GET    | `/api/categories/all`         | Public     | List all categories     |
| GET    | `/api/categories/:categoryId` | Public     | Get single category     |
| POST   | `/api/categories`             | Admin only | Create new category     |
| PUT    | `/api/categories/:categoryId` | Admin only | Update category + image |
| DELETE | `/api/categories/:categoryId` | Admin only | Delete category         |

---

## 🗂️ Product API

| Method | Endpoint                           | Access     | Description                        |
| ------ | ---------------------------------- | ---------- | ---------------------------------- |
| GET    | `/api/products/all`                | Public     | List all products (with filters)   |
| GET    | `/api/products/:productId`         | Public     | Get a specific product             |
| GET    | `/api/products/:productId/related` | Public     | Get related products               |
| POST   | `/api/products`              | Admin only | Create a new product (with images) |
| PUT    | `/api/products/:productId`   | Admin only | Update a product (with images)     |
| DELETE | `/api/products/:productId`   | Admin only | Delete a product                   |


## 📦 Orders API

| Method | Endpoint                            | Access     | Description                   |
| ------ | ----------------------------------- | ---------- | ----------------------------- |
| POST   | `/api/orders`                       | Optional   | Create order (guests allowed) |
| GET    | `/api/orders/all`                   | Auth only  | Get user's orders             |
| GET    | `/api/orders/:orderId`              | Auth only  | Get specific order            |
| DELETE | `/api/orders/:orderId`              | Auth only  | Delete user's order           |
| GET    | `/api/orders/admin/all`             | Admin only | Get all orders                |
| GET    | `/api/orders/admin/:orderId`        | Admin only | Get order by ID               |
| PUT    | `/api/orders/admin/:orderId/status` | Admin only | Update order status           |
| DELETE | `/api/orders/admin/:orderId`        | Admin only | Admin deletes order           |

---

## 📝 Review API

| Method | Endpoint                          | Access    | Description                   |
| ------ | --------------------------------- | --------- | ----------------------------- |
| GET    | `/api/reviews/product/:productId` | Public    | Get all reviews for a product |
| GET    | `/api/reviews/:reviewId`          | Public    | Get a single review           |
| POST   | `/api/reviews`                    | Auth only | Create a review               |
| PUT    | `/api/reviews/:reviewId`          | Auth only | Update your review            |
| DELETE | `/api/reviews/:reviewId`          | Auth only | Delete your review            |

---

## 👤 User Profile API

| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| GET    | `/api/user/profile` | Get current user info   |
| PUT    | `/api/user/profile` | Update profile & avatar |
| DELETE | `/api/user/profile` | Delete account          |

---

## 📤 File Uploads

* Category creation & user update support **image uploads**
* Uploads handled via **Multer + Cloudinary**
* Middleware stack: `upload.single(...)` + `addFilePathToBody(...)`

---

## 🔔 Webhooks

### 📬 Paystack Webhook

| Method | Endpoint                | Description                      |
| ------ | ----------------------- | -------------------------------- |
| POST   | `/api/webhook/paystack` | Handles Paystack payment updates |

* Parses raw JSON using `express.raw`
* Controller: `handlePaystackWebhook`

---

## ✅ Validation

* All input validation is handled via **Zod**
* Middleware: `validate()` for `body`, `params`, and `query`

---

## 🧼 Linting & Formatting

* ESLint + Prettier configured
* Husky + lint-staged for pre-commit hooks

---
