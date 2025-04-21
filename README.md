# 🎬 QuickTickets - Full Stack Project

A comprehensive full-stack movie ticket booking platform with separate frontends for customers and administrators. Customers can browse movies, book tickets, and make secure payments, while admins manage movies, users, showtimes, and theaters with real-time analytics.

---

## 🚀 Features

### 🎫 Client (Frontend)
- 🧍‍♂️ **User Registration & Login**
- 🎞️ **Movie Browsing** with trailers (via YouTube)
- 🎟️ **Ticket Booking with Seat Selection**
- 💳 **Secure Payment Integration** using Stripe
- 🧾 **Booking History and E-tickets**
- 🌐 **Responsive UI** using Tailwind CSS & DaisyUI

### 🧑‍💼 Admin Panel
- 🎬 **Movie Management** — Add, edit, or remove movies
- 🏢 **Theater & Seating Management**
- 🕒 **Showtime Scheduling**
- 👥 **User Monitoring & Access Control**
- 📊 **Booking Dashboard with Charts (Recharts)**
- 🔔 **Real-time Toast Notifications**
- 🔒 **JWT-based Secure Admin Login**

### 🧠 Backend API
- RESTful API with Express.js
- MongoDB + Mongoose for data handling
- Authentication & Authorization using JWT
- Stripe & Razorpay integration for payments
- Email Support via Nodemailer
- Cloudinary for media storage

---

## ⚙️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, DaisyUI, React Router DOM, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT, Cookies
- **Payment**: Stripe, Razorpay
- **Others**: Cloudinary, Nodemailer, YouTube API (react-youtube), Toastify, Lucide React, Recharts

---

## 💻 Installation

1. **Clone the repository**

```bash
git clone https://github.com/avipatel2004/QuickTickets
```

2. **Install dependencies**

```bash
# Backend Setup
cd Backend
npm install

# Client Frontend Setup
cd ../frontend
npm install

# Admin Panel Setup
cd ../admin-frontend
npm install
```

3. **Run development servers**

```bash
# Start Backend
cd Backend
npm run dev

# Start Client Frontend
cd ../frontend
npm run dev

# Start Admin Frontend
cd ../admin-frontend
npm run dev
```

---

## 📁 Project Structure

```
QuickTickets/
├── Backend/               # Node.js + Express.js API
├── frontend/              # Client-facing React App
├── admin-frontend/        # Admin Dashboard Panel
```

---

Lights, camera, action! 🎥🎟️ Let the bookings roll in!

