# Taasu Soap - Backend Server

A robust Node.js/Express.js backend API for the Taasu Soap e-commerce website, built with TypeScript, MongoDB, and modern development practices.

## 🌐 Live Website

Visit the live website: [https://taasu-soap.web.app/](https://taasu-soap.web.app/)

## 🚀 Features

### Core Functionality
- **User Management**: Registration, authentication, and profile management
- **Product Management**: Complete CRUD operations for products and categories
- **Inventory Management**: Stock tracking and inventory control
- **Order Management**: Order processing and status tracking
- **Payment Integration**: Stripe payment gateway integration
- **Blog System**: Content management for blog posts
- **Shipping Address Management**: Customer address handling

### Technical Features
- **TypeScript**: Full type safety and better development experience
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT Authentication**: Secure token-based authentication
- **File Upload**: Cloudinary integration for image management
- **Input Validation**: Zod schema validation
- **Error Handling**: Comprehensive error handling middleware
- **CORS Support**: Cross-origin resource sharing configuration
- **Environment Configuration**: Secure environment variable management

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Payment**: Stripe
- **Validation**: Zod
- **Password Hashing**: bcrypt
- **Development**: ts-node-dev, ESLint, Prettier

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Cloudinary account
- Stripe account

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd taas-soap-website-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=mongodb://localhost:27017/taas-soap-db

# Authentication
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe Configuration
STRIPE_SECRET=your_stripe_secret_key
```

### 4. Database Setup
Ensure MongoDB is running and accessible. The application will automatically create the necessary collections.

### 5. Run the Application

**Development Mode:**
```bash
npm run start:dev
```

**Production Build:**
```bash
npm run build
npm run start:prod
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Available Endpoints

#### Authentication (`/auth`)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh-token` - Refresh access token

#### Users (`/users`)
- `GET /users` - Get all users (Admin only)
- `GET /users/profile` - Get user profile
- `PATCH /users/profile` - Update user profile
- `DELETE /users/:id` - Delete user (Admin only)

#### Products (`/product`)
- `GET /product` - Get all products
- `GET /product/:id` - Get product by ID
- `POST /product` - Create product (Admin only)
- `PATCH /product/:id` - Update product (Admin only)
- `DELETE /product/:id` - Delete product (Admin only)

#### Categories (`/category`)
- `GET /category` - Get all categories
- `POST /category` - Create category (Admin only)
- `PATCH /category/:id` - Update category (Admin only)
- `DELETE /category/:id` - Delete category (Admin only)

#### Inventory (`/inventory`)
- `GET /inventory` - Get inventory status
- `POST /inventory` - Add inventory (Admin only)
- `PATCH /inventory/:id` - Update inventory (Admin only)

#### Orders (`/orders`)
- `GET /orders` - Get user orders
- `POST /orders` - Create new order
- `PATCH /orders/:id` - Update order status (Admin only)

#### Payments (`/payments`)
- `POST /payments/create-payment-intent` - Create payment intent
- `POST /payments/confirm-payment` - Confirm payment

#### Shipping Addresses (`/shipping-addresses`)
- `GET /shipping-addresses` - Get user addresses
- `POST /shipping-addresses` - Add new address
- `PATCH /shipping-addresses/:id` - Update address
- `DELETE /shipping-addresses/:id` - Delete address

#### Blogs (`/blogs`)
- `GET /blogs` - Get all blog posts
- `GET /blogs/:id` - Get blog by ID
- `POST /blogs` - Create blog post (Admin only)
- `PATCH /blogs/:id` - Update blog post (Admin only)
- `DELETE /blogs/:id` - Delete blog post (Admin only)

## 🔧 Development Scripts

```bash
# Development
npm run start:dev          # Start development server with hot reload

# Production
npm run build              # Build TypeScript to JavaScript
npm run start:prod         # Start production server

# Code Quality
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint issues
npm run prettier           # Format code with Prettier
npm run prettier:fix       # Fix Prettier formatting
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── config/           # Configuration files
│   ├── DB/              # Database connection and seeding
│   ├── errors/          # Error handling utilities
│   ├── interface/       # TypeScript interfaces
│   ├── middlewares/     # Express middlewares
│   ├── modules/         # Feature modules
│   │   ├── auth/        # Authentication module
│   │   ├── user/        # User management
│   │   ├── product/     # Product management
│   │   ├── order/       # Order management
│   │   ├── payment/     # Payment processing
│   │   ├── blog/        # Blog management
│   │   └── ...          # Other modules
│   ├── routes/          # Route definitions
│   └── utils/           # Utility functions
├── app.ts               # Express app configuration
└── server.ts            # Server entry point
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Access Token**: Short-lived token for API access
2. **Refresh Token**: Long-lived token for refreshing access tokens

### Protected Routes
Most routes require authentication. Include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## 🚀 Deployment

### Vercel Deployment
The project is configured for Vercel deployment with the `vercel.json` file.

### Environment Variables for Production
Ensure all environment variables are properly set in your production environment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Note**: This backend is designed to work with the TAAS SOAP frontend application. Make sure to configure the CORS settings appropriately for your frontend domain.
