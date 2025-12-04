# Muhafiz

Muhafiz is a full-stack web application designed for secure online test management and proctoring. It features user authentication, test creation, face verification, and comprehensive admin controls.

---

## Table of Contents
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Libraries Used](#libraries-used)
- [Setup Instructions](#setup-instructions)
- [Step-by-Step Breakdown](#step-by-step-breakdown)
- [Scripts](#scripts)

---

## Features
- User registration and login
- Admin dashboard for test and user management
- Test creation and invitation system
- Face verification for exam proctoring
- Real-time notifications (toasts)
- Protected routes for admin and exam access
- Error handling and 404 page

---

## Folder Structure
```
Muhafiz/
├── client/
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── App.js
│       ├── components/
│       ├── pages/
│       ├── routes/
│       └── utils/
├── server/
│   ├── package.json
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── utils/
├── images/
├── public/
└── Readme.md
```

---

## Libraries Used

### Client (React)
- **react**: UI library
- **react-router-dom**: Routing
- **react-toastify**: Toast notifications

### Server (Node.js/Express)
- **express**: Web server
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT authentication
- **nodemailer**: Email sending
- **bcryptjs**: Password hashing

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repo-url>
cd Muhafiz
```

### 2. Install dependencies
- For client:
  ```bash
  cd client
  npm install
  ```
- For server:
  ```bash
  cd server
  npm install
  ```

### 3. Configure environment variables
- Create a `.env` file in the `server` folder with your MongoDB URI, JWT secret, and email credentials.

### 4. Start the development servers
- In one terminal, run the client:
  ```bash
  cd client
  npm start
  ```
- In another terminal, run the server:
  ```bash
  cd server
  npm run dev
  ```

---

## Step-by-Step Breakdown

1. **User Registration & Login**
   - Users can register and log in from the client app.
   - Passwords are hashed and stored securely.
2. **Admin Dashboard**
   - Admins can create, manage, and delete tests.
   - Admins can manage users and view reports.
3. **Test Creation & Invitation**
   - Admins create tests and generate invite codes.
   - Users join tests using invite codes.
4. **Face Verification**
   - Before starting an exam, users must complete face verification.
5. **Exam & Proctoring**
   - Users take exams in a protected environment.
   - Admins can monitor and review reports.
6. **Notifications & Error Handling**
   - Toast notifications inform users of actions and errors.
   - 404 page for undefined routes.

---

## Scripts

### Client
- `npm start` — Start React development server
- `npm run build` — Build for production

### Server
- `npm run dev` — Start server with nodemon
- `npm start` — Start server

---

## License
MIT
