# 🚖 ApnaGetRide Captain App

A production-ready **driver (captain) application** built using Expo React Native, designed for real-time ride management, driver onboarding, and trip execution.

This app complements a user-side ride-hailing system and focuses on **driver workflow, performance, and scalability**.

---

## 📌 Overview

The Captain App enables drivers to:

- Accept / reject ride requests
- Manage ride lifecycle (start → complete)
- Track earnings and trip history
- Handle KYC and vehicle verification
- Stay in sync with backend in real-time

Built with scalability and real-world usage in mind.

---

## ⚙️ Tech Stack

- **Frontend:** Expo React Native
- **State Management:** Zustand / MMKV
- **Backend Integration:** REST APIs (Node.js)
- **Authentication:** JWT-based
- **Storage:** MMKV (secure local storage)
- **Architecture:** Modular + scalable folder structure

---

## 🚀 Features

### 🔹 Authentication & Captain Onboarding
- Secure JWT login
- Captain profile setup
- Vehicle information submission
- KYC flow integration

### 🔹 Ride Management System
- Incoming ride requests
- Accept / reject logic
- Ride lifecycle handling:
  - Accepted
  - Arrived
  - Started
  - Completed

### 🔹 Real-Time Updates
- Sync with backend for ride status
- Live updates for trip flow

### 🔹 Earnings & History
- Trip history tracking
- Earnings overview (extensible)

### 🔹 Performance Optimizations
- Efficient state handling using Zustand
- Persistent storage using MMKV
- Reduced unnecessary re-renders

---

## 📂 Project Structure
```
src/
│
├── components/ # Reusable UI components
├── screens/ # App screens (Auth, Ride, Profile)
├── hooks/ # Custom hooks
├── store/ # Zustand state management
├── services/ # API services
├── utils/ # Helper functions
├── constants/ # App constants
└── assets/ # Images, icons
```

---

## 🔄 Ride Flow (Core Logic)

1. Captain receives ride request
2. Accepts / rejects request
3. Navigates to pickup location
4. Marks arrival
5. Starts ride
6. Completes trip

This flow is designed to be **extensible for real-time sockets and scaling**.

---

## 🧠 Architecture Highlights

- Clean separation of concerns (UI / logic / API)
- Scalable state management using Zustand
- Optimized local persistence with MMKV
- Backend-ready structure (plug-and-play APIs)
- Designed for real-world ride-hailing systems

---

## 📸 Demo (Add This)

> Add a short demo video or screenshots here:
- Accepting a ride
- Ride in progress
- Trip completion

---

## 🛠️ Setup & Installation

```bash
# Clone the repo
git clone https://github.com/ejazahmedsiddiqui/apna-getride-captain

# Install dependencies
npm install

# Start the app
npx expo start
```
