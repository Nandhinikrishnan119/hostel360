# 🚀 Hostel360 — Intelligent Hostel Operations & Student Services Platform

A full-stack, enterprise-grade college hostel management and student welfare platform built with **Java Spring Boot**, **React 18 + Tailwind CSS**, **JWT Authentication**, and **MySQL / Persistent Database Storage**.

---

## 📂 Project Structure

```text
hostel360/
├── backend/                  # Java Spring Boot 3.3.4 Application
│   ├── src/main/java/        # 165+ Controller, Service, Entity, DTO, Repository classes
│   ├── src/main/resources/   # application.yml, database settings
│   ├── pom.xml               # Maven configuration
│   └── data/                 # Persistent database storage directory
├── frontend/                 # React 18 + Vite + Tailwind CSS Application
│   ├── src/
│   │   ├── components/       # Common UI elements (Navbar, Sidebar, StatCard, Modals)
│   │   ├── context/          # AuthContext & NotificationContext
│   │   ├── pages/            # 22+ dedicated role portals and management pages
│   │   ├── routes/           # Role-based protected routing
│   │   └── services/         # Axios API clients
│   ├── package.json          # Node dependencies
│   └── vite.config.js        # Vite build configuration
├── start-all.bat             # 1-Click Windows launcher for both servers
└── README.md                 # Complete platform documentation
```

---

## 💻 How to Open in Visual Studio Code

1. Open **VS Code**.
2. Click **File** $\rightarrow$ **Open Folder...** (or press `Ctrl + K`, `Ctrl + O`).
3. Select the cloned `hostel360` folder.
4. Or open from terminal/command prompt:
   ```bash
   code hostel360
   ```

---

## ⚡ Quick Start / Run Application

### Prerequisites

- Java 25 LTS (the backend Maven target and deployment runtime)
- Maven 3.9 or newer
- Node.js and npm for the frontend

### Option A: 1-Click Launch (Windows)
Double-click `start-all.bat` in the root folder.

### Option B: Terminal Launch
#### 1. Backend (Java Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
If Maven is not installed globally, install Maven 3.9+ or configure `MAVEN_HOME` to a Maven 3.9+ installation.
*Backend runs on:* `http://localhost:8080`

#### 2. Frontend (React Vite)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on:* `http://localhost:5173`

## Deploy On Render

### Backend

1. Create a **Web Service** from this repository.
2. Select **Docker** as the runtime.
3. Set the Dockerfile path to `backend/Dockerfile`.
4. Set the Docker context to `backend`.
5. Add `SPRING_PROFILES_ACTIVE=dev`.
6. Add `CORS_ALLOWED_ORIGINS` with the deployed frontend URL, for example `https://hostel360-frontend.onrender.com`.

The backend listens on port `8080` and exposes its health check at `/swagger-ui.html`.

### Frontend

1. Create a **Static Site** from the same repository.
2. Set the root directory to `frontend`.
3. Set the build command to `npm ci && npm run build`.
4. Set the publish directory to `frontend/dist`.
5. Add `VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com/api`.
6. Add `VITE_BASE_PATH=/` for a Render Static Site.

After deployment, update the backend `CORS_ALLOWED_ORIGINS` value with the final frontend URL.

---

## 🌐 Live Web & API Endpoints

- **Web Application**: [http://localhost:5173](http://localhost:5173)
- **Interactive Swagger 3.0 API Docs**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **Database Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console) (`JDBC URL: jdbc:h2:file:./data/hostel360_db`, User: `sa`, Password: *[blank]*)

---

## 🔑 Demo Role Credentials

| Role | Username | Password | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **Student Resident** | `student1` | `student123` | **Ananya Sundar** (Room B-204, Kaveri Girls Hostel) — Roommates, SLA complaints, Keep-My-Food box, Leave out-pass, Health logs, Fees & receipts, Parcel OTPs |
| **Student Resident 2** | `student2` | `student123` | **Pooja Chawla** (Room B-204, Kaveri Girls Hostel) — Roommate to Ananya |
| **Girls Hostel Warden** | `warden1` | `warden123` | **Dr. Anandita Kumar** — Room occupancy visualizer, complaint assignments, leave approvals, student welfare follow-ups, student council suggestions review, notices |
| **Maintenance Staff** | `maint1` | `maint123` | **Ramesh Patel (Electrician)** — Work order tasks, SLA countdowns, resolution proof uploads |
| **Mess Manager** | `mess1` | `mess123` | **Chef Vikram Singh** — 7-day dining schedule editor, Keep-My-Food hot box packing & shelf slot assignment, food quality ratings |
| **Security Desk** | `security1` | `security123` | **Priya Sharma** — Active Gate pass scanner (checkout/checkin), late arrival logger, parcel inward & 6-digit OTP verification, SOS emergency desk |
| **Super Admin** | `admin` | `admin123` | **Dr. Rajesh Sharma** — Executive dashboard, **Hostel Fee & Payment Management**, 100-pt Hostel Health Score, Predictive maintenance recurring defect alerts, Student roster |
