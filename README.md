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
```
Frontend 
cabfrontend/
|
+-- client/
|   +-- App.tsx                  (Root app with routing & protected routes)
|   +-- global.css               (Global styles)
|   |
|   +-- components/
|   |   +-- Header.tsx           (Top navigation header)
|   |   +-- Sidebar.tsx          (Side navigation bar)
|   |   +-- ui/                  (Reusable Radix UI / Shadcn components)
|   |
|   +-- pages/
|   |   +-- Login.tsx            (Login page, shared for admin & user)
|   |   +-- NotFound.tsx         (404 page)
|   |   |
|   |   +-- admin/               (Admin-only pages)
|   |   |   +-- Dashboard.tsx
|   |   |   +-- Bookings.tsx
|   |   |   +-- Drivers.tsx
|   |   |   +-- Vehicles.tsx
|   |   |   +-- Customers.tsx
|   |   |   +-- LiveTracking.tsx
|   |   |   +-- Reports.tsx
|   |   |   +-- Settings.tsx
|   |   |
|   |   +-- user/                (User-only pages)
|   |       +-- Dashboard.tsx
|   |       +-- BookRide.tsx
|   |       +-- Bookings.tsx
|   |       +-- LiveTracking.tsx
|   |       +-- RideHistory.tsx
|   |       +-- Settings.tsx
|   |
|   +-- services/
|   |   +-- api.ts               (Axios API service layer)
|   |
|   +-- hooks/                   (Custom React hooks)
|   +-- lib/                     (Utility functions)
|
+-- public/                      (Static assets)
+-- index.html                   (App entry point)
+-- vite.config.ts
+-- tailwind.config.ts
+-- tsconfig.json
+-- package.json
+-- .env

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
- Role-based login (Admin / User)
- Protected routes using localStorage role session
- Auto-redirect based on user role


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
```json
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
```json
{
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
```json
{
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

## Frontend-
- Navigate to the frontend directory: cd cabfrontend
- Install dependencies: pnpm install (or npm install)
- Configure environment — create/edit .env with VITE_API_BASE_URL=http://localhost:8080
- Start the development server: pnpm dev (or npm run dev)
- Frontend starts at http://localhost:5173
- Build for production: pnpm build



---

# 🏗️ Architecture

```
Backend
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
```
Frontend
Login Page
    |
    v
Role Check (localStorage)
    |
    +------------------+------------------+
    |   Admin Panel    |    User Panel    |
    |  - Dashboard     |  - Dashboard     |
    |  - Bookings      |  - Book a Ride   |
    |  - Drivers       |  - My Bookings   |
    |  - Vehicles      |  - Live Tracking |
    |  - Customers     |  - Ride History  |
    |  - Tracking      |  - Settings      |
    |  - Reports       |                  |
    |  - Settings      |                  |
    +------------------+------------------+
              |
              v
      Axios API Layer (api.ts)
              |
              v
   Spring Boot Backend (port 8080)


The project follows Layered Architecture for better maintainability and separation of concerns.

---
```

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
