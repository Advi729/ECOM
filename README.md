# Heats Shoes - E-Commerce Platform

Heats Shoes is a full-stack e-commerce platform built for selling footwear online. The application provides a complete shopping experience for customers and a dedicated admin dashboard for managing products, orders, users, inventory, offers, and sales.

The project was built with the **MERN ecosystem and server-side rendering using Express Handlebars**, with MongoDB as the primary database.

## ✨ Features

### 👤 Customer Features

* User registration and login
* OTP-based authentication
* Secure password hashing with bcrypt
* User profile management
* Multiple delivery addresses
* Product browsing and detailed product pages
* Product search
* Category, subcategory, and brand filtering
* Product pagination
* Shopping cart
* Dynamic cart quantity updates
* Wishlist
* Coupon application
* Wallet functionality
* Checkout and order placement
* Cash on Delivery
* Razorpay online payments
* Order history
* Order tracking and status updates
* Product return requests
* Downloadable order invoices
* Responsive design for mobile and desktop

### 🛠️ Admin Dashboard

The admin panel provides tools for managing the complete e-commerce operation.

* Admin authentication
* Dashboard with sales statistics
* Product management
* Product stock management
* Product listing/unlisting
* Category management
* Subcategory management
* Brand management
* Banner management
* User management
* Block/unblock users
* Order management
* Order status updates
* Coupon management
* Coupon expiry management
* Sales reports
* Sales charts and analytics
* Invoice generation
* Return request management

## 🛒 Shopping Experience

Customers can browse the product catalog, search for products, filter products by category, subcategory, and brand, and view detailed product information.

The cart supports:

* Adding and removing products
* Increasing and decreasing quantities
* Stock validation
* Automatic subtotal calculation
* Dynamic cart updates

Users can also save products to their wishlist and move between their wishlist and cart.

## 💳 Payments

The application supports multiple payment methods:

* **Cash on Delivery**
* **Razorpay**

The checkout process calculates product totals, discounts, coupons, and the final payable amount before placing an order.

## 🎟️ Coupon System

The platform includes a coupon system that allows administrators to create and manage promotional offers.

Features include:

* Coupon creation
* Discount percentages
* Expiry dates
* Coupon usage tracking
* Applying coupons during checkout
* Preventing invalid or expired coupons

## 💰 Wallet

Users have access to a wallet system that can be used within the application for supported transactions.

Wallet-related functionality includes managing wallet balance and using wallet funds during eligible purchases.

## 📦 Order Management

Customers can view their previous orders and track their order status.

Administrators can manage orders through the dashboard and update their status throughout the fulfillment process.

Example order statuses include:

```text
Pending
Processing
Shipped
Delivered
Cancelled
Returned
```

The application also supports return requests and return-reason management.

## 🧾 Invoice Generation

Order invoices are generated as PDF documents using **PDFKit**.

Invoices contain important order information such as:

* Order details
* Customer information
* Products
* Quantities
* Pricing
* Discounts
* Final amount

## 📊 Admin Analytics

The admin dashboard provides visual insights into the store's performance.

Analytics include:

* Sales statistics
* Order statistics
* Revenue information
* Product performance
* Sales reports
* Time-based sales charts

**Chart.js** is used to visualize the sales data.

## 🔐 Authentication & Authorization

The application implements authentication and role-based access control.

### Customer authentication

* Registration
* Login
* OTP verification
* Password hashing
* Session-based authentication

### Admin authorization

Administrative functionality is protected so that only authenticated administrators can access the admin dashboard and management operations.

## 🗂️ Project Structure

The original project follows an MVC-style structure:

```text
ECOM/
│
├── controllers/
├── helpers/
├── middlewares/
├── models/
├── routes/
├── views/
│   ├── layouts/
│   ├── partials/
│   ├── user/
│   └── admin/
│
├── public/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── uploads/
│
├── app.js
├── package.json
└── README.md
```

## 🧰 Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Bootstrap
* Handlebars

### Backend

* Node.js
* Express.js
* Express Handlebars

### Database

* MongoDB
* Mongoose
* MongoDB Atlas

### Authentication & Security

* Express Session
* bcrypt
* OTP authentication
* Role-based authorization

### Payments

* Razorpay
* Cash on Delivery

### Other Technologies & Libraries

* Twilio — OTP services
* Multer — file uploads
* PDFKit — invoice generation
* Chart.js — sales analytics
* Moment.js — date handling
* shortid — unique identifiers

## 🗃️ Core Data Models

The application uses MongoDB collections/models for the main e-commerce entities:

```text
User
Product
Category
SubCategory
Brand
Cart
Wishlist
Order
Coupon
Wallet
Banner
Offer
```

These models work together to support the complete shopping and administration workflow.

## 🔄 Customer Flow

```text
Register / Login
       ↓
Browse Products
       ↓
Search / Filter
       ↓
View Product
       ↓
Add to Cart / Wishlist
       ↓
Apply Coupon
       ↓
Checkout
       ↓
Select Payment Method
       ↓
Place Order
       ↓
Track Order
       ↓
Return / Download Invoice
```

## 🔄 Admin Flow

```text
Admin Login
     ↓
Dashboard
     ↓
Manage Products
     ↓
Manage Categories / Brands
     ↓
Manage Users
     ↓
Manage Coupons
     ↓
Manage Orders
     ↓
Update Order Status
     ↓
View Sales Reports & Analytics
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Advi729/ECOM.git
cd ECOM
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and configure the required credentials.

Example:

```env
MONGODB_URL=your_mongodb_connection_string

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

ACCOUNT_SID=your_twilio_sid
AUTH_TOKEN=your_twilio_token
SERVICE_ID=your_twilio_service_id
```

### 4. Start the application

```bash
npm start
```

For development:

```bash
npm run dev
```

## 📱 Responsive Design

The application is designed to work across different screen sizes, including:

* Desktop
* Laptop
* Tablet
* Mobile

The user-facing shopping experience and important administrative pages are optimized for responsive layouts.

## 🎯 What This Project Demonstrates

This project demonstrates practical experience with:

* Full-stack web application development
* REST-style backend routing
* Node.js and Express.js
* MongoDB database design
* Mongoose
* Server-side rendering
* Authentication and authorization
* Session management
* Payment gateway integration
* OTP authentication
* Shopping cart architecture
* Wishlist functionality
* Coupon systems
* Order processing
* Inventory management
* PDF generation
* File uploads
* Admin dashboards
* Data visualization
* Responsive web development

## 🌐 Live Demo

**Heats Shoes:**
https://heats-shoes.onrender.com/

## 👨‍💻 Author

**Adal Adwaid Vikas**

GitHub: `Advi729`


## 📄 License

Distributed under the Apache-2.0 License. View the accompanying `LICENSE` file layout context for structural authorization parameters.

