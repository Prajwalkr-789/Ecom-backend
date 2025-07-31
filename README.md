# 🛒 E-Commerce REST API

This is a fully functional **E-Commerce API** built using **Node.js**, **Express**, **Sequelize**, and **JWT authentication**. It supports admin-controlled product management, user registration/login, and image uploads using `multer`. It also includes robust input validation and protected routes.

---

## 📦 Tech Stack

- **Node.js** + **Express**
- **Sequelize** (PostgreSQL)
- **JWT Authentication**
- **Multer** (for file uploads)
- **Express Validator**
- **Swagger** (for API documentation)
- **Render** (for deployment)


---

## 📁 Project Structure
```txt

├── Backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── databse.js
│   │
│   ├── Controllers/
│   │   └── ...controller files here
│   │
│   ├── Middlewares/
│   │   ├── auth.js
│   │   └── upload.js
│   │
│   ├── Models/
│   │   └── ...model files here
│   │
│   ├── Routes/
│   │   └── ...route files here
│   │
│   ├── utils/
│   │   └── cloudinaryUpload.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── app.js
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── swaggerConfig.js

```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Prajwalkr-789/Ecom-backend
cd ecommerce-api

create a .env file and add the following with ur credentails

DATABASE_URL=your_postgresql_db_url
JWT_SECRET=your_JWT_secret
JWT_EXPIRE=7d (you can this as per requirement)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=8080

npm install
npm run dev
```
## Key Highlights
- Role-based Access Middleware (authorize('admin'))

- Sequelize Associations (User ↔ Products, etc.)

- Product Validations

- Image Storage using multer

- Centralized Error Handling

- Swagger Integration for real-time testing

- Ready for Deployment on platforms like Render
