# YelpCamp

A full-stack web application for discovering, creating, and reviewing campgrounds. This project provides a platform where users can share camping experiences, explore new locations, and connect with other outdoor enthusiasts.

---

## Features

### User Authentication & Authorization
- Secure user registration and login
- Session management to maintain user state
- Protected routes for authenticated actions (create, edit, delete)
- Authorization middleware to ensure users can only modify their own campgrounds and reviews

### Campground Management (CRUD)
- Browse all available campgrounds
- Create campgrounds with title, location, image URL, price, and description
- View detailed campground pages
- Edit and delete campgrounds (author-only)

### Review System
- Add ratings and text reviews (authenticated users only)
- Display all reviews on campground detail pages
- Delete reviews (author-only; `isReviewAuthor` to be implemented)

### Flash Messaging
- Real-time success/error notifications via flash messages

### Responsive Design
- Built with Tailwind CSS for viewing on mobile, tablet, and desktop

### Robust Error Handling
- Centralized asynchronous error handling (`catchAsync` utility)
- Custom 404 page for undefined routes

---

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js (with passport-local & passport-local-mongoose)
- express-session
- connect-flash
- method-override
- ejs-mate

### Frontend
- EJS (templating engine)
- Tailwind CSS
- Vanilla JavaScript

### Development Utilities
- `morgan` (commented out)
- `catchAsync` utility
- Seeding script for dummy data

---

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Make sure the following are installed on your machine:

- Node.js (LTS version recommended)
- MongoDB (Community Server)

### Installation

**1. Clone the repository:**
```bash
git clone <this-repo-url>
cd yelpcamp
```
**2. Install backend dependencies:**
```bash
npm install
```
**3. Start mongoDB:**
Make sure your MongoDB server is running. If it's not set up as a background service, start it manually:
```bash
mongod
```
**4. Seed the Database:(optinal but recommended)**
This script will delete existing campgrounds and populate the database with dummy data.
Ensure the author ID in seeds/index.js corresponds to an existing user in the users collection, or update it accordingly.
```bash
node index.js
```
**5. Start the development server**
```bash
node app.js
```
**6. visit website on :**
```bash
http://localhost:3000
```

