#Synthesia (Fullstack Music Player)

Synthesia is a comprehensive full-stack music player application built using the MERN stack (MongoDB, Express, React, Node.js). It is designed to provide a rich music playing experience, complete with intuitive playback controls, playlist management, user authentication, and profile personalization.

## 🌟 Key Features

### 🎧 Music Playback & Discovery
- **Comprehensive Player:** Full controls including Play, Pause, Stop, Previous, and Next.
- **Playback Modes:** Support for Replay and Shuffle functionalities.
- **Volume Management:** Easily adjust playback volume.
- **Tag-based Playlists:** Discover music filtered by mood or tags.

### 💖 User Engagement
- **Favorites Collection:** Users can like tracks to save them to their personalized Favorites section.

### 🔐 Authentication & Security
- **Secure Access:** Robust user registration and login endpoints.
- **Password Management:** Forgot password and secure reset token capabilities via email.
- **Profile Management:** Edit profile functionalities enabled for logged-in users.
- **JWT Authorized Sessions:** Stateless and secure API access using JSON Web Tokens.

## 🛠️ Tech Stack & Architecture

### Frontend Architecture
- **Framework:** React 19 using Vite for fast bundling.
- **State Management:** Redux Toolkit (structured with slices, e.g., authSlice).
- **Routing:** React Router DOM for seamless Single Page Application (SPA) navigation.
- **Styling:** Tailwind CSS + Autoprefixer for highly responsive, utility-first styling.
- **Data Fetching:** Axios.

### Backend Architecture
- **Runtime & Framework:** Node.js powered by Express.js API.
- **Database:** MongoDB configured with Mongoose for schema modeling.
- **Security:** `bcrypt` for password hashing and `jsonwebtoken` for protected routing middleware.
- **Third-Party Integrations:**
  - **Nodemailer:** Enabling transactional emails (e.g., password reset).
  - **ImageKit:** Handling image uploads efficiently.

## 📡 API Endpoints Overview

### Authentication Routes (`/api/auth`)
- `POST /signup` - Register a new user account.
- `POST /login` - Authenticate a user and return a JWT.
- `GET /me` - Retrieve current logged-in user profile (Protected route).
- `PATCH /profile` - Update user profile information (Protected route).
- `POST /forgot-password` - Send a reset-password email.
- `POST /reset-password/:token` - Set a new password using a valid token.

### Song Routes (`/api/songs`)
- `GET /` - Retrieve all available songs.
- `GET /playlistByTag/:tag` - Retrieve a categorized list of songs by their assigned tag.
- `POST /favourites` - Toggle (add/remove) a song from the user's favorites (Protected route).

## 🚀 Installation & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/en/) installed on your local machine.
- A valid [MongoDB](https://www.mongodb.com/) URI.
- API keys/secrets for ImageKit and an email SMTP configuration for Nodemailer.

### 1. Clone the repository
```bash
git clone <repository-url>
cd fullstack-music-player
```

### 2. Setup the Backend Environment
Open a terminal instance and navigate to the backend directory:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory and configure the fundamental environment variables:
```env
PORT=5000
MONGO_URI=your_mongodb_cluster_uri
JWT_SECRET=your_jwt_secret
# Nodemailer Configs (SMTP)
# ImageKit Configs
```

Run the backend development server:
```bash
npm run dev
```

### 3. Setup the Frontend Environment
Open a second terminal instance and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory if you need to point to a specific API URL context (e.g., `VITE_BASE_URL=http://localhost:5000`).

Start the frontend builder tool:
```bash
npm run dev
```

The application frontend should now be running and accessible at `http://localhost:5173`.
