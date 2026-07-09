# 🚖 Cab Booking Management System

A Spring Boot REST API application for managing a Cab Booking System. This project demonstrates customer registration, authentication, cab management, and secure REST API development using Spring Boot, MySQL, JPA, and Spring Security.

---

## 📌 Project Overview

The Cab Booking Management System allows administrators and customers to perform various operations such as:

- Customer Registration
- Customer Profile Management
- User Login & Logout
- Cab Management
- Secure Password Storage
- API Documentation using Swagger

This project follows a layered architecture and industry-standard Spring Boot development practices.

---

# ✨ Features

## 👤 Customer Module

- Register Customer
- View Customer Profile
- View All Customers (Admin)
- Delete Customer

---

## 🚖 Cab Module

- Add Cab
- Update Cab Details
- Delete Cab
- View All Cabs
- View Available Cabs

---

## 👨‍✈️ Driver Module

- Add Driver
- Update Driver Details
- Assign Driver to Cab
- View All Drivers

---

## 📅 Booking Module

- Book a Cab
- Cancel Booking
- View Booking History
- View Booking Status
- View All Bookings (Admin)

---

## 📊 Dashboard Module

Displays overall system statistics including:

- Total Customers
- Total Drivers
- Total Cabs
- Available Cabs
- Total Bookings

---

## 🔐 Authentication Module

- User Login
- User Logout
- Password Encryption using BCrypt
- Session-based Authentication
- Spring Security Integration

---



## 🛠️ Tech Stack

| Technology | Version |
|------------|----------|
| Java | 21 |
| Spring Boot | 3.x |
| Spring Data JPA | Latest |
| Spring Security | Latest |
| Hibernate | Latest |
| MySQL | 8.x |
| Maven | Latest |
| Lombok | Latest |
| Swagger OpenAPI | Latest |
| Validation API | Jakarta Validation |

---

## 📂 Project Structure

```
CabBookingApplication
│
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com.example.demo
│   │   │
│   │   ├── controller
│   │   ├── service
│   │   ├── serviceimpl
│   │   ├── repository
│   │   ├── entity
│   │   ├── dto
│   │   ├── exception
│   │   ├── config
│   │   └── DemoApplication.java
│   │
│   └── resources
│       ├── application.properties
│       └── static
│
├── pom.xml
└── README.md
```

---

# 📡 REST APIs

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/login` | Login User |
| POST | `/auth/logout` | Logout User |

---

## Customer APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/customers/register` | Register Customer |
| GET | `/customers` | View All Customers |
| GET | `/customers/{id}` | View Customer Profile |
| DELETE | `/customers/{id}` | Delete Customer |

---
## Driver APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/drivers` | Add Driver |
| GET | `/drivers` | View All Drivers |
| PUT | `/drivers/{driverId}` | Update Driver |
| PUT | `/drivers/{driverId}/assign/{cabId}` | Assign Driver to Cab |

---

## Cab APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/cabs` | Add Cab |
| GET | `/cabs` | View All Cabs |
| GET | `/cabs/available` | View Available Cabs |
| PUT | `/cabs/{cabId}` | Update Cab |
| DELETE | `/cabs/{cabId}` | Delete Cab |

---

# 📥 Sample Request

## Customer Registration

```json
{
  "name": "Urvi Jain",
  "email": "urvi@gmail.com",
  "phone": "9876543210",
  "address": "Dehradun",
  "username": "urvi",
  "password": "password123"
}
```

---

## Add Cab

```json
{
  "cabNumber": "UK07AB1234",
  "carModel": "Swift Dzire",
  "cabType": "Sedan",
  "capacity": 4,
  "available": true
}
```

---

# 📤 Sample Response

```json
{
  "customerId": 1,
  "name": "Urvi Jain",
  "email": "urvi@gmail.com",
  "phone": "9876543210",
  "address": "Dehradun"
}
```
---

# 🚀 Implemented User Stories

| User Story | Description | Status |
|------------|-------------|--------|
| US-001 | Customer Registration | ✅ |
| US-002 | Customer Profile | ✅ |
| US-003 | Login | ✅ |
| US-004 | Logout | ✅ |
| US-005 | Add Driver | ✅ |
| US-006 | Update Driver | ✅ |
| US-007 | Assign Driver to Cab | ✅ |
| US-008 | View Available Cabs | ✅ |
| US-009 | Add Cab | ✅ |
| US-010 | Update Cab | ✅ |
| US-011 | Delete Cab | ✅ |
| US-012 | Book Cab | ✅ |
| US-013 | Cancel Booking | ✅ |
| US-014 | Booking History | ✅ |
| US-015 | Booking Status | ✅ |
| US-016 | Manage Customers | ✅ |
| US-017 | Manage Bookings | ✅ |
| US-018 | Admin Dashboard | ✅ |

---

# 🔄 Request Flow

```
HTTP Request
      │
      ▼
Controller
      │
      ▼
Service
      │
      ▼
Repository
      │
      ▼
MySQL
      │
      ▼
Repository
      │
      ▼
Service
      │
      ▼
Controller
      │
      ▼
JSON Response
```
---

# ⚙️ How to Run

### Clone the repository

```bash
git clone <repository-url>
```

### Open the project

Open the project in VS Code or IntelliJ IDEA.

### Configure MySQL

Create a database named:

```
cab_booking_db
```

Update `application.properties` with your MySQL username and password.

### Run the application

Using Maven:

```bash
mvn spring-boot:run
```

or

```bash
./mvnw spring-boot:run
```

Application starts at:

```
http://localhost:8080
```

---

# 📖 Swagger Documentation

Open:

```
http://localhost:8080/swagger-ui/index.html
```

Swagger provides interactive API documentation where APIs can be tested directly from the browser.


---

# 🏗️ Architecture

```
Client

↓

Controller

↓

Service

↓

Repository

↓

MySQL Database
```

The project follows Layered Architecture for better maintainability and separation of concerns.

---

# 🚀 Future Enhancements

- React Frontend
- JWT Authentication
- Role-Based Authorization
- Online Payment Gateway
- Google Maps Integration
- Fare Estimation
- Ride Tracking
- Email Notifications
- Driver Rating System
- Customer Reviews
- Ride Scheduling
- Docker Deployment
- CI/CD Pipeline


---

# 📄 License

This project is developed for educational and learning purposes.
