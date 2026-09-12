# 🚀 Developer Portfolio - Ambati Lalitha Sagar

A modern, responsive, full-stack portfolio website showcasing the projects, skills, and experience of Ambati Lalitha Sagar, a B.Tech IT student at Aditya College of Engineering and Technology.

## ✨ Features

- **Express.js Backend** - Serves the site and handles potential API requests.
- **Firebase Integration** - Uses Firestore for dynamic data loading and Firebase Auth for secure admin access.
- **Light/Dark Theme** - Default light mode with seamless dark mode toggling, persisted via `localStorage`.
- **Multi-language Preloader** - Custom typing animation cycling through greetings in different languages.
- **Dynamic Content** - Fetches portfolio data dynamically from Firestore.
- **Progressive Web App (PWA)** - Ready to be installed on devices and capable of working offline.
- **Responsive Design** - Optimized for mobile, tablet, and desktop viewports using custom CSS.
- **Interactive UI** - Scroll-triggered animations, a custom cursor, and animated project cards.

## 📁 Project Structure

```text
portfolio/
├── server.js                        # Express backend server
├── index.html                       # Main portfolio landing page
├── admin-page.html                  # Admin dashboard for updating dynamic data
├── style.css                        # Global styles and responsive design
├── script.js                        # Frontend interactivity and Firebase logic
├── firebase-applet-config.json      # Client-side Firebase configuration
├── firestore.rules                  # Firestore security rules
└── package.json                     # Node.js dependencies and scripts
```

## 🛠 Tech Stack

| Layer        | Technology                                     |
| ------------ | ---------------------------------------------- |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+)         |
| **Backend**  | Node.js, Express.js                            |
| **Database** | Firebase Firestore                             |
| **Auth**     | Firebase Authentication                        |
| **Icons**    | Boxicons                                       |
| **Fonts**    | Google Fonts (Inter, JetBrains Mono)           |

## 📱 Featured Projects

- **FileShare Pro**: A fast file sharing web app with two modes: direct device-to-device transfer via WebRTC and cloud vault sharing with Firebase.
- **Attendance Tracker**: A web app to track student attendance with real-time push notifications using Playwright and Firebase.
- **DocuKeep**: A Flutter mobile app for organizing and storing important documents, backed by Firebase Auth & Cloudinary.

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set Up Firebase:**
   Ensure your Firebase project is configured and `firebase-applet-config.json` contains your credentials.

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```

4. **Access the Application:**
   Open your browser and navigate to `http://localhost:3000`.

## ⚙️ Administration

The portfolio includes a secure admin panel (`/admin-page.html`) for managing content dynamically. 
- Access requires a verified Google account email matching the administrator's email.
- The admin can update skills, projects, and other dynamic sections without modifying the source code.
