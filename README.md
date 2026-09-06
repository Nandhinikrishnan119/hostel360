# 🏨 Hostel360 — Intelligent Hostel Management System

<p align="center">
  <b>A full-stack hostel management platform for students, wardens, maintenance staff, mess managers, security staff, and administrators.</b>
</p>

<p align="center">
  <a href="https://hostel360-frontend-znc9.onrender.com/">🌐 Live Demo</a> •
  <a href="https://github.com/Nandhinikrishnan119/hostel360">📂 GitHub Repository</a>
</p>

---

## 📌 Overview

**Hostel360** is a full-stack web application designed to digitize and simplify hostel operations through a centralized platform.

The system provides role-based access for different hostel users and manages important operations such as:

* Student and room management
* Complaint registration and tracking
* Maintenance management
* Mess menu and feedback
* Leave and out-pass management
* Security and late-entry tracking
* Parcel management
* Hostel announcements
* Emergency/SOS requests
* Suggestions and feedback
* Dashboard and analytics

The application follows a layered backend architecture using **Java Spring Boot, Spring Security, JPA/Hibernate, and MySQL**, with a responsive **React.js** frontend.

---

## 🎯 Objectives

* Digitize traditional hostel management processes
* Provide a centralized platform for hostel operations
* Reduce manual paperwork and communication delays
* Improve complaint resolution and maintenance tracking
* Provide role-based access to different hostel departments
* Improve transparency between students and hostel administration
* Provide useful analytics for hostel management

---

# 👥 User Roles

Hostel360 supports multiple user roles with role-based access control.

| Role                     | Responsibilities                                                              |
| ------------------------ | ----------------------------------------------------------------------------- |
| 👨‍🎓 **Student**        | Profile, complaints, leave requests, mess feedback, parcels, suggestions, SOS |
| 👨‍💼 **Warden**         | Student management, complaints, approvals, announcements, monitoring          |
| 🔧 **Maintenance Staff** | View and resolve assigned maintenance complaints                              |
| 🍽️ **Mess Manager**     | Manage menus, food feedback, and mess-related information                     |
| 🛡️ **Security Staff**   | Late entry, visitor/security monitoring, emergency handling                   |
| 👑 **Super Admin**       | Complete hostel administration, users, analytics, and system monitoring       |

---

# 🚀 Key Features

## 👨‍🎓 Student Portal

Students can:

* Manage their profile
* View hostel and room information
* View roommates
* Submit complaints
* Track complaint status
* Submit leave/out-pass requests
* View announcements
* Track parcels
* Provide mess feedback
* Submit suggestions
* Request emergency assistance
* View relevant hostel information

---

## 🏢 Warden Portal

Wardens can:

* Monitor students
* Manage complaints
* Approve/reject leave requests
* Monitor room occupancy
* Publish announcements
* Track hostel activities
* Monitor maintenance progress
* View hostel statistics

---

## 🔧 Maintenance Management

Maintenance staff can:

* View assigned complaints
* Check complaint priority
* Update complaint status
* Track pending work
* Mark complaints as resolved

### Complaint Lifecycle

```text
Student
   ↓
Submit Complaint
   ↓
Complaint Created
   ↓
Assigned to Staff
   ↓
Work in Progress
   ↓
Resolved
   ↓
Student Confirmation
   ↓
Closed
```

---

## ⏱️ SLA Monitoring & Escalation

The system can monitor complaint resolution time based on priority.

```text
Complaint Created
        ↓
SLA Timer Starts
        ↓
Staff Assigned
        ↓
Resolution Monitoring
        ↓
SLA Nearing Deadline
        ↓
Escalation
        ↓
Warden/Admin Notification
```

Scheduled backend tasks can be used to monitor unresolved complaints and trigger escalation when required.

---

## 🍽️ Mess Management

Mess managers can:

* Manage daily/weekly menus
* Update meal information
* Receive food feedback
* Monitor ratings
* Track student suggestions

Students can view menus and submit feedback.

---

## 🛂 Leave & Out-Pass Management

Students can submit leave/out-pass requests.

Wardens can:

* Review requests
* Approve or reject requests
* Track request status

```text
Student
   ↓
Leave Request
   ↓
Warden Review
   ↓
Approve / Reject
   ↓
Student Notification
```

---

## 🛡️ Security Management

Security staff can manage hostel security-related activities including:

* Late entry tracking
* Student entry monitoring
* Visitor-related information
* Emergency situations

---

## 📦 Parcel Management

Hostel360 provides parcel tracking functionality.

Features include:

* Parcel registration
* Student notification
* Parcel status tracking
* OTP-based parcel verification
* Collection status

---

## 🚨 Emergency / SOS

Students can raise emergency requests through the platform.

Emergency requests can be monitored by authorized hostel staff for faster response.

---

## 📢 Announcements

Authorized staff can publish hostel announcements.

Students can view important information such as:

* Hostel notices
* Events
* Maintenance updates
* Mess announcements
* General instructions

---

# 🔐 Authentication & Authorization

Hostel360 implements secure authentication and role-based authorization.

### Security Features

* JWT-based authentication
* Spring Security
* Role-Based Access Control (RBAC)
* Password hashing
* Backend authorization
* Request validation
* Secure API endpoints
* Centralized exception handling
* CORS configuration

```text
User Login
    ↓
Authentication
    ↓
JWT Token
    ↓
API Request
    ↓
JWT Validation
    ↓
Role Verification
    ↓
Authorized Resource
```

---

# 🏗️ System Architecture

Hostel360 follows a layered architecture.

```text
┌───────────────────────────────┐
│        React Frontend         │
│   React + Vite + Tailwind     │
└───────────────┬───────────────┘
                │
                │ REST API / JSON
                ▼
┌───────────────────────────────┐
│      Spring Boot Backend      │
├───────────────────────────────┤
│ Controllers                   │
│       ↓                       │
│ Services                      │
│       ↓                       │
│ Repositories                  │
│       ↓                       │
│ JPA / Hibernate               │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│          MySQL Database       │
└───────────────────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

* **React.js**
* **Vite**
* **JavaScript (ES6+)**
* **Tailwind CSS**
* **React Router**
* **Axios**
* **React Icons**
* **Recharts**

## Backend

* **Java 25**
* **Spring Boot**
* **Spring Web**
* **Spring Security**
* **JWT**
* **Spring Data JPA**
* **Hibernate**
* **Maven**

## Database

* **MySQL**

## Architecture & Development

* RESTful APIs
* Layered Architecture
* DTO-based API design
* Role-Based Access Control
* MVC principles
* Exception Handling
* Input Validation

## Tools

* Git
* GitHub
* VS Code
* IntelliJ IDEA
* Postman
* Maven

## Deployment

* Render
* GitHub

---

# 📂 Project Structure

```text
hostel360/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── context/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── .../
│   │   │   │       ├── controller/
│   │   │   │       ├── service/
│   │   │   │       ├── repository/
│   │   │   │       ├── entity/
│   │   │   │       ├── dto/
│   │   │   │       ├── security/
│   │   │   │       └── exception/
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   └── pom.xml
│
└── README.md
```

---

# 🗄️ Database

The application uses **MySQL** for persistent data storage.

Major entities include:

* Users
* Students
* Rooms
* Complaints
* Complaint Assignments
* Leave Requests
* Announcements
* Mess Menus
* Mess Feedback
* Parcels
* Suggestions
* Emergency Requests
* Notifications
* Audit Logs

Relationships between entities are managed using **JPA/Hibernate**.

---

# 🔌 REST API

The backend exposes RESTful APIs for frontend communication.

Example API structure:

```text
/api/auth
/api/users
/api/students
/api/rooms
/api/complaints
/api/maintenance
/api/leave
/api/announcements
/api/mess
/api/parcels
/api/security
/api/emergency
/api/notifications
/api/admin
```

APIs are protected using **JWT authentication and role-based authorization** where required.

---

# 📊 Dashboard & Analytics

The system provides dashboards for authorized users.

Examples of tracked information:

* Total students
* Room occupancy
* Pending complaints
* Resolved complaints
* Complaint priority
* Maintenance workload
* Leave requests
* Mess feedback
* Hostel activity

Charts and visualizations can be implemented using **Recharts**.

---

# 🧠 Intelligent Features

Hostel360 is designed with several intelligent hostel-management capabilities.

### Duplicate Complaint Detection

Helps identify potentially repeated complaints related to the same issue.

### Complaint Trend Analysis

Identifies frequently occurring complaint categories and patterns.

### Recurring Problem Detection

Helps administrators identify rooms or facilities with repeated maintenance problems.

### Predictive Maintenance

Historical maintenance data can be analyzed to identify infrastructure that may require attention.

### Hostel Health Score

A dashboard-level score can combine operational indicators such as:

* Complaint resolution
* Maintenance workload
* Occupancy
* Mess feedback
* Student feedback

The score is intended to provide an explainable overview of hostel operational health.

---


### Live Application

**Frontend:**
https://hostel360-frontend-znc9.onrender.com/

**Backend:**
https://hostel360-backend-h8v5.onrender.com/

---

# 🧪 Testing

The project can be tested at multiple levels:

* Backend unit testing
* Service-layer testing
* REST API testing
* Authentication testing
* Role authorization testing
* Frontend component testing
* End-to-end workflow testing

**Postman** can be used to test REST APIs during development.

---

# 📈 Future Enhancements

Potential future improvements include:

* Mobile application
* Email/SMS notifications
* Advanced ML-based complaint classification
* AI-powered hostel assistant
* Face recognition for authorized entry
* Advanced predictive maintenance models
* Online hostel fee payments
* Cloud database integration
* Advanced audit and security monitoring

---

# 💡 Why Hostel360?

Hostel360 demonstrates practical experience in:

* Full-stack web development
* Java backend development
* Spring Boot
* Spring Security
* JWT authentication
* REST API development
* Database design
* Role-based authorization
* React.js
* Responsive UI development
* Deployment
* Software architecture
* CRUD operations
* Business workflow implementation

The project is designed to represent a **real-world enterprise application rather than a basic CRUD project**.

---

# 📚 Learning Outcomes

Through this project, the following concepts are demonstrated:

* Building full-stack applications
* Designing RESTful APIs
* Implementing authentication and authorization
* Working with Spring Boot
* Connecting Java applications with MySQL
* Using JPA/Hibernate for database persistence
* Designing layered architectures
* Managing frontend-backend communication
* Implementing role-based workflows
* Deploying applications to the cloud
* Working with Git and GitHub

---


# 👩‍💻 Author

**Nandhini Krishnan**

Computer Science & Engineering Student

GitHub:
https://github.com/Nandhinikrishnan119

---

<p align="center">
  ⭐ If you found Hostel360 useful, consider giving the repository a star!
</p>

<p align="center">
  <b>Hostel360 — Digitizing Hostel Operations Through Technology</b>
</p>
