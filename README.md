# Cart App Api 

A **modular and production-ready backend** built with **NodeJs**, MongoDB, and Redis.  
This project includes authentication, authorization, booking, comments, products management, image uploads, caching, and middleware for enhanced security and performance.

---

## Features

### Authentication & Authorization
- JWT-based authentication with secure cookie handling
- Signup and Signin functionality
- Role-based access control (Admin/User)
- Middleware for validating tokens and user roles
- Password fields removed from API responses for security

### Products Management
- CRUD operations for products
- Organized RESTful API routes
- Integration with Cloudinary for image storage

### Booking System
- Create, update, delete, and retrieve bookings
- User-booking relationship management
- Validation for booking operations

### Comments System
- CRUD operations for comments
- Rate limiting middleware to prevent spam
- Linked with users and products

### File Upload & Image Handling
- File uploads with **Multer**
- Cloudinary integration for storing and optimizing images
- Middleware to handle image saving and validation

###  Performance & Caching
- Redis caching for improving performance of important routes
- Middleware for caching logic
- Optimized request handling

### Architecture & Code Quality
- Factory handlers for reusable controller functions
- Modular project structure with controllers, routes, and services
- Utilities for token generation and email notifications
- MongoDB models for users, bookings, products, and comments

---

## Tech Stack

- **Backend Framework:** NodeJs / Express  
- **Database:** MongoDB (Mongoose)  
- **Caching:** Redis  
- **Authentication:** JWT, Cookies  
- **File Storage:** Cloudinary + Multer  
- **Email Service:** Nodemailer (for notifications and OTPs)  
