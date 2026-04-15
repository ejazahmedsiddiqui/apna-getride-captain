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
- Demo Video of Prject so far: [youtube](https://youtube.com/shorts/0UeTYNC3uyo?feature=share)
- Login Page
* <img width="210" height="455" alt="Login Page" src="https://github.com/user-attachments/assets/3bb59e3f-d957-493b-a1e1-66fd7e360c2b" />
- Profile loading page
* <img width="210" height="455" alt="Profile - Loading state" src="https://github.com/user-attachments/assets/ffebde99-f4f4-4d19-8fb9-239e50f5421c" />
- Profile Page 1:
* <img width="210" height="455" alt="Profile Loaded" src="https://github.com/user-attachments/assets/7a176ec1-7e71-440f-8c2d-ba993dad3eae" />
- Profile Page 2:
* <img width="210" height="455" alt="Profile 2" src="https://github.com/user-attachments/assets/4b882bd1-da19-42d5-a2a0-3158f345dd19" />
- KYC page 1:
* <img width="210" height="455" alt="KYC page 1" src="https://github.com/user-attachments/assets/3cb6d2e0-d692-4725-ba27-e5b10d5a6b1c" />
- KYC page 2:
* <img width="210" height="455" alt="KYC page 2" src="https://github.com/user-attachments/assets/c58ab8ea-5e50-4810-b572-d4d0a718fd27" />
- Vehicle KYC:
* <img width="210" height="455" alt="Vehicle KYC" src="https://github.com/user-attachments/assets/4e357310-d855-48ba-8605-569f6e6b7279" />
- Vehicle KYC 2:
* <img width="210" height="455" alt="Vehicle KYC 2" src="https://github.com/user-attachments/assets/c09ca7c0-8aba-4b84-ac95-e799136d5ad8" />
- KYC error state:
* <img width="210" height="455" alt="KYC error" src="https://github.com/user-attachments/assets/04a62f18-b1e7-4488-842d-6355b865949f" />

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
