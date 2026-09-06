# 🚀 Hostel360 — Intelligent Hostel Operations & Student Welfare Platform

<p align="center">
  <b>A full-stack intelligent hostel management and student services platform designed to digitize, simplify, and modernize hostel operations.</b>
</p>

<p align="center">
  <a href="https://hostel360-frontend-znc9.onrender.com">
    <img src="https://img.shields.io/badge/🌐%20Live%20Website-Hostel360-success?style=for-the-badge" alt="Live Website">
  </a>
  <a href="https://github.com/Nandhinikrishnan119/hostel360">
    <img src="https://img.shields.io/badge/💻%20GitHub-Repository-black?style=for-the-badge&logo=github" alt="GitHub Repository">
  </a>
</p>

---

# 🌐 Live Deployment

### 🚀 Live Website

**https://hostel360-frontend-znc9.onrender.com**

### ⚙️ Backend Service

**https://hostel360-backend-h8v5.onrender.com**

### 💻 GitHub Repository

**https://github.com/Nandhinikrishnan119/hostel360**

---

# 📌 Project Overview

**Hostel360** is a full-stack, role-based hostel management and student welfare platform developed to transform traditional hostel administration into a centralized digital system.

The platform brings together students, wardens, maintenance staff, mess managers, security personnel, and administrators into a single integrated application.

It provides dedicated role-based portals for different hostel operations such as:

- Student management
- Room and occupancy management
- Complaint management
- Maintenance work orders
- Mess and food management
- Leave and gate-pass management
- Parcel management
- Student welfare
- Fee management
- Emergency/SOS support
- Notifications and hostel announcements

The application follows a **client-server architecture**, where the React frontend communicates with a Java Spring Boot backend through REST APIs.

---

# 🎯 Objectives

The primary objectives of Hostel360 are:

- 🏠 Digitize hostel management operations
- 👨‍🎓 Provide students with a centralized hostel service platform
- 👨‍💼 Simplify administrative and warden operations
- 📝 Reduce paperwork and manual record maintenance
- 🔧 Improve maintenance and complaint handling
- 🍽️ Digitize mess and food-related operations
- 🚪 Improve gate-pass and visitor management
- 📦 Simplify parcel tracking and verification
- 💰 Manage hostel fees and receipts efficiently
- 🚨 Provide emergency and SOS support
- 📊 Improve hostel operational visibility
- 🔐 Provide secure role-based access
- ⚡ Improve communication between students and hostel staff

---

# ✨ Key Features

## 👨‍🎓 Student Portal

Students can access a dedicated portal containing:

- 🔐 Secure login
- 👤 Student profile
- 🏠 Hostel and room information
- 🛏️ Roommate information
- 📝 Complaint registration
- 📊 Complaint status and SLA tracking
- 🍱 Keep-My-Food requests
- 🚪 Leave / out-pass requests
- ❤️ Health logs
- 💰 Hostel fees and receipts
- 📦 Parcel tracking
- 🔢 Parcel OTP verification
- 📢 Hostel notices
- 🔔 Notifications
- 🚨 Emergency/SOS support
- 💡 Student council suggestions

---

# 👩‍💼 Warden Portal

The warden can manage and monitor hostel operations through a dedicated dashboard.

### Features

- 👥 Student management
- 🏠 Hostel management
- 🛏️ Room occupancy visualization
- 📋 Complaint assignment
- ⏱️ Complaint SLA monitoring
- 🚪 Leave request approval
- 👨‍🎓 Student welfare follow-ups
- 💡 Student council suggestion review
- 📢 Hostel notices
- 🔔 Notifications
- 📊 Hostel operational monitoring

---

# 🔧 Maintenance Staff Portal

Maintenance personnel can manage hostel maintenance activities.

### Features

- 📝 View assigned work orders
- 🔧 Manage maintenance tasks
- ⏱️ SLA countdown tracking
- 📋 Work order status updates
- 📸 Resolution proof uploads
- ⚡ Track pending maintenance requests
- ✅ Update completed tasks

---

# 🍽️ Mess Manager Portal

The mess management module helps digitize hostel dining operations.

### Features

- 📅 7-day dining schedule management
- 🍛 Meal schedule updates
- 🍱 Keep-My-Food hot-box packing
- 📍 Shelf-slot assignment
- ⭐ Food quality ratings
- 📊 Dining-related management

---

# 🛡️ Security Desk Portal

The security module provides digital hostel gate and parcel management.

### Features

- 🎫 Gate-pass scanning
- 🚪 Student checkout/check-in
- ⏰ Late arrival logging
- 📦 Parcel inward management
- 🔢 6-digit parcel OTP verification
- 🚨 SOS emergency desk
- 📋 Security activity tracking

---

# 👑 Super Admin Portal

The Super Admin provides centralized control over the platform.

### Features

- 👥 User management
- 🏢 Hostel management
- 🛏️ Room management
- 🔐 Role management
- 📊 System-level monitoring
- ⚙️ Platform configuration
- 📋 Operational management

---

# 🔐 Authentication & Authorization

Hostel360 implements secure authentication and role-based access control.

### Authentication

- JWT-based authentication
- Secure login
- Protected routes
- Token-based API authorization
- Session management

### Role-Based Access

Different users receive access to features according to their roles.

```
                    ┌─────────────────┐
                    │      User       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ JWT Login/Auth  │
                    └────────┬────────┘
                             │
                 ┌───────────┼───────────┐
                 ▼           ▼           ▼
             Student       Warden      Staff
                 │           │           │
                 ▼           ▼           ▼
             Student      Warden      Staff
              Portal       Portal      Portal
```

---

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **JavaScript** - Programming language
- **HTML/CSS** - Markup and styling

### Backend
- **Java Spring Boot** - Backend framework
- **REST APIs** - API architecture
- **Database** - Data persistence

---

## 📚 Getting Started

### Prerequisites
- Node.js and npm (for frontend)
- Java and Maven (for backend)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Nandhinikrishnan119/hostel360.git
cd hostel360
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
npm start
```

3. Build and run backend:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👤 Author

**Nandhinikrishnan119**
- GitHub: [@Nandhinikrishnan119](https://github.com/Nandhinikrishnan119)
- Email: nandhinip173@gmail.com

---

## 🙌 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

**Thank you for using Hostel360!** 🎉
