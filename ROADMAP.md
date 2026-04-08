# Ride Hailing App Roadmap (NestJS + Redis + Expo)

---

## 1. Current State

Completed:

* JWT authentication (login)
* Profile fetch from database
* Vehicle information
* Vehicle KYC
* Profile KYC UI

Status:

* Driver onboarding foundation is complete
* Ready to build core ride system

---

## 2. Architecture Overview

### Backend (NestJS)

* Auth Module ✅
* User/Driver Module ✅
* Ride Module 🔜
* Dispatch/Matching Module 🔜
* Location Tracking 🔜
* Payments 🔜
* Notifications 🔜

### Infrastructure

* PostgreSQL → persistent data
* Redis → real-time + geo queries
* WebSockets → live communication

---

## 3. Development Phases

---

### Phase 1 — Real-Time Foundation

Goal: Enable live communication between driver and rider

Backend:

* Setup WebSocket Gateway (NestJS)
* Handle driver + rider connections
* Implement heartbeat system (5–10 seconds)
* Store active drivers in Redis

Redis structure:

```
driver:{id} → { lat, lng, status }
```

Frontend (Driver App):

* "Go Online / Offline" toggle
* Send location periodically

---

### Phase 2 — Ride Request System

Goal: Allow riders to create ride requests

Backend:

* Create Ride entity:

```
Ride {
  id
  riderId
  driverId
  pickup
  drop
  status
}
```

Ride Status:

* REQUESTED
* ACCEPTED
* STARTED
* COMPLETED
* CANCELLED

APIs:

* Create ride request
* Fetch nearby drivers (Redis GEO)

Redis GEO:

```
GEOADD drivers longitude latitude driverId
GEORADIUS drivers ...
```

Flow:

1. Rider creates request
2. Backend finds nearby drivers
3. Send request via WebSocket

---

### Phase 3 — Driver Matching

Goal: Assign rides efficiently

Logic:

* Radius search (2–5 km)
* Filter:

    * Online drivers
    * Vehicle type match
* Sort:

    * Distance
    * Rating (future)

Driver App:

* Incoming ride screen
* Accept / Reject

Backend:

* Timeout handling (e.g. 15 seconds)
* Reassign if rejected

---

### Phase 4 — Ride Lifecycle

States:

```
REQUESTED → ACCEPTED → ARRIVING → STARTED → COMPLETED
```

Backend:

* Strict state validation
* Emit WebSocket events:

    * Driver accepted
    * Driver arrived
    * Ride started
    * Ride completed

Frontend:

* Rider:

    * Track driver live
* Driver:

    * Start ride
    * End ride

---

### Phase 5 — Maps & Navigation

Frontend (Expo):

* react-native-maps
* Google Maps API

Features:

* Show driver location
* Pickup & drop markers
* Route polylines

---

### Phase 6 — Pricing & Fare

Backend:

```
fare = baseFare + (distance * perKm) + (time * perMin)
```

Enhancements:

* Surge pricing
* Night charges

---

### Phase 7 — Payments

Start simple:

* Cash payments

Later:

* UPI integration

Backend:

* Payment entity
* Link payment to ride

---

### Phase 8 — Notifications

Use:

* Firebase Cloud Messaging (FCM)

Events:

* New ride request
* Driver arrival
* Ride completion

---

### Phase 9 — Admin Panel (Optional)

* Approve driver KYC
* Monitor rides
* Manage users

---

### Phase 10 — Production Readiness

Must-have:

* Rate limiting (NestJS guards)
* Logging (Winston / Pino)
* Centralized error handling
* Redis-based queues / retries

Optional:

* Microservices split:

    * auth-service
    * ride-service
    * dispatch-service

---

## 4. Suggested Backend Structure

```
src/
 ├── modules/
 │   ├── auth/
 │   ├── user/
 │   ├── driver/
 │   ├── ride/
 │   ├── dispatch/
 │   ├── location/
 │   └── payment/
 ├── gateways/
 │   └── socket.gateway.ts
 ├── common/
 │   ├── guards/
 │   ├── interceptors/
 │   └── utils/
```

---

## 5. Immediate Next Steps (Priority)

1. Setup WebSocket gateway
2. Implement driver online/offline system
3. Add Redis GEO location tracking
4. Create ride request API
5. Implement driver matching logic

---

## 6. MVP Checklist

* Driver can go online
* Rider can request ride
* Driver receives request
* Driver accepts ride
* Ride completes successfully
* Fare is calculated

---

## 7. Common Pitfalls

* Avoid polling; use WebSockets
* Do not skip Redis GEO for location queries
* Enforce strict ride state transitions
* Always implement driver request timeout
* Avoid over-engineering early

---

## 8. Future Enhancements

* Smart dispatch (ML-based)
* Ride pooling
* Driver heatmaps
* Dynamic pricing models
* Subscription systems

---
