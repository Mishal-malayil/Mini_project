# 🎓 College Event Management System

![Angular](https://img.shields.io/badge/Angular-21-red?logo=angular)
![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel)
![MySQL](https://img.shields.io/badge/MySQL-Database-blue?logo=mysql)
![License](https://img.shields.io/badge/License-MIT-green)

A full-stack **College Event Management System** built with **Angular**, **Laravel**, and **MySQL**. This application helps colleges efficiently manage events, student registrations, coordinators, and event results through an intuitive web interface.

---

## 📖 Table of Contents

- Overview
- Features
- Technology Stack
- Project Structure
- Installation
- Configuration
- API
- Screenshots
- Future Enhancements
- Author
- License

---

# 📌 Overview

The College Event Management System provides a centralized platform where administrators can create and manage events while students can browse and register for events.

The system reduces paperwork and simplifies event management by automating registrations, coordinator management, and result publishing.

---

# ✨ Features

## 👨‍💼 Admin

- Secure Login
- Dashboard
- Manage Event Categories
- Create Events
- Edit Events
- Delete Events
- Manage Coordinators
- View Student Registrations
- Publish Results
- Search Events
- Dashboard Statistics

## 👨‍🎓 Student

- Register/Login
- Browse Events
- Register for Events
- View Registration History
- Check Event Results
- Update Profile

---

# 🛠 Technology Stack

## Frontend

- Angular
- Angular Material
- TypeScript
- HTML5
- CSS3
- Bootstrap

## Backend

- Laravel 12
- REST API
- Laravel Sanctum Authentication
- Eloquent ORM

## Database

- MySQL

---

# 📂 Project Structure

```
College-Event-Management/
│
├── frontend/
│   ├── src/
│   ├── app/
│   ├── assets/
│   └── angular.json
│
├── backend/
│   ├── app/
│   ├── database/
│   ├── routes/
│   ├── public/
│   └── artisan
│
└── README.md
```

---

# 🚀 Installation

## 1. Clone Repository

```bash
git clone https://github.com/yourusername/college-event-management.git
```

---

## 2. Backend Setup

Go to backend folder

```bash
cd backend
```

Install dependencies

```bash
composer install
```

Copy environment file

```bash
cp .env.example .env
```

Generate application key

```bash
php artisan key:generate
```

Configure your MySQL database inside `.env`

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=college_event_management
DB_USERNAME=root
DB_PASSWORD=
```

Run migrations

```bash
php artisan migrate
```

(Optional) Seed sample data

```bash
php artisan db:seed
```

Start Laravel server

```bash
php artisan serve
```

Backend runs on

```
http://127.0.0.1:8000
```

---

## 3. Frontend Setup

Open another terminal

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run Angular

```bash
ng serve
```

Frontend runs on

```
http://localhost:4200
```

---

# 🔗 API Base URL

```
http://127.0.0.1:8000/api
```

Example endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/events | Get all events |
| GET | /api/categories | Get categories |
| POST | /api/login | Login |
| POST | /api/register | Register |
| POST | /api/events | Create event |
| PUT | /api/events/{id} | Update event |
| DELETE | /api/events/{id} | Delete event |

---

# 📸 Screenshots

## Login

_Add screenshot here_

---

## Dashboard

_Add screenshot here_

---

## Events

_Add screenshot here_

---

## Event Registration

_Add screenshot here_

---

## Results

_Add screenshot here_

---

# 🎯 Future Enhancements

- Email Notifications
- QR Code Registration
- Attendance Tracking
- Certificate Generation
- Event Analytics
- Mobile Responsive Design
- Dark Mode
- Multi-role Authentication

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added new feature"
```

4. Push

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 👨‍💻 Author

**Mohammed Mishal M**

- MCA Student
- Full Stack Developer
- Angular | Laravel | MySQL

GitHub:

```
https://github.com/yourusername
```

---

# 📄 License

This project is licensed under the MIT License.

---

## ⭐ Support

If you found this project useful, please give it a ⭐ on GitHub.

Happy Coding! 🚀