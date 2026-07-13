# 🚖 Cab Booking Management System

A Spring Boot REST API application for managing a Cab Booking System. This project demonstrates customer registration, authentication, cab management, and secure REST API development using Spring Boot, MySQL, JPA, and Spring Security.

---

## 📌 Project Overview

The Cab Booking Management System allows administrators and customers to perform various operations such as:

- Customer Registration
- Customer Profile Management
- User Login & Logout
- Cab Management (Add / Update / Delete / View Available Cabs)
- Driver Management (Add / Update / Assign Driver to Cab)
- Cab Booking
- Secure Password Storage
- API Documentation using Swagger

This project follows a layered architecture and industry-standard Spring Boot development practices.

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

# ✨ Features

## Customer Module

- Register Customer
- View Customer Profile

## Authentication

- User Login
- User Logout
- BCrypt Password Encryption
- HTTP Session Management

## Cab Module

- Add Cab
- Update Cab
- Delete Cab
- View Available Cabs

## Driver Module
- Add Driver
- Update Driver
- Assign Driver to Cab

## Booking Module
- Book Cab

## Security

- Password Encryption using BCrypt
- Request Validation
- Global Exception Handling

## API Documentation

- Swagger UI Integration

---

# 🗄️ Database Tables

- users
- customer
- cab
- drivers
- trip_booking

Hibernate automatically creates the database tables.

---

# 🔐 Authentication

Passwords are securely stored using BCrypt hashing.

Example stored password:

```
$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

# 📡 REST APIs

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /auth/login |
| POST | /auth/logout |

---

## Customer APIs

| Method | Endpoint |
|---------|----------|
| POST | /customers/register |
| GET | /customers/{id} |

---

## Cab APIs

| Method | Endpoint |
|---------|----------|
| POST | /cabs |
| GET | /cabs |


## Driver APIs

| Method | Endpoint |
|---------|----------|
| POST | /drivers |
| GET | /drivers |
| PUT | /drivers{driverId} |
| PUt | /drivers/{driverId}/assign/{cabId} |

## Booking APIs

| Method | Endpoint |
|---------|----------|
| POST | /bookings |

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

## Add Driver
---
```
{
  "driverName": "Ramesh Kumar",
  "licenceNo": "DL123456",
  "mobileNumber": "9999999999",
  "email": "ramesh@test.com"
}
```
---

---

## Book Cab
```
json{
  "customerId": 1,
  "cabId": 1,
  "fromLocation": "Airport",
  "toLocation": "Downtown"
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

---
Booking Response
```
json{
  "tripBookingId": 1,
  "customerId": 1,
  "cabId": 1,
  "cabNumber": "UK07AB1234",
  "driverId": 1,
  "driverName": "Ramesh Kumar",
  "fromLocation": "Airport",
  "toLocation": "Downtown",
  "fromDateTime": "2026-07-13T10:15:00",
  "toDateTime": null,
  "status": true,
  "distanceInKm": 0,
  "bill": 0
}
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

- Driver Management
- Cab Booking
- Booking History
- Booking Cancellation
- Admin Dashboard
- JWT Authentication
- Role-Based Authorization


---

# 📄 License

This project is developed for educational and learning purposes.
