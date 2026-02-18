A full-stack real-time chat application built using the MERN stack, featuring authentication, profile management, image uploads, and live messaging with Socket.io.

🌐 Live Demo
Frontend: https://chat-app-v2-olive.vercel.app

Backend API: https://chatapp-v2-0r6l.onrender.com

🛠 Tech Stack
🔹 Frontend

React (Vite)

Axios

Socket.io Client

Tailwind CSS (if used)

🔹 Backend

Node.js

Express.js

MongoDB (Mongoose)

JWT Authentication (HTTP-only cookies)

Socket.io

Cloudinary (image storage)

Arcjet (security & protection)

Resend (email service)

🔹 Deployment

Frontend → Vercel

Backend → Render

Database → MongoDB Atlas

✨ Features

🔐 Secure JWT Authentication (HTTP-only cookies)

🧑 User Signup & Login

📩 Real-time messaging with Socket.io

🖼 Profile picture upload (Cloudinary)

📧 Welcome email on signup

🛡 Rate limiting & protection using Arcjet

🌍 Production-ready deployment

📂 Project Structure
chatApp-v2/
│
├── frontend/          # Vite + React frontend
│   ├── src/
│   └── ...
│
├── backend/           # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── lib/
│   │   └── server.js
│   └── ...
│
└── README.md

⚙️ Environment Variables (Backend)

Create a .env file inside the backend folder:

PORT=3000
MONGO_URI=your_mongodb_uri
NODE_ENV=development
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development

RESEND_API_KEY=your_resend_key
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=YourName


⚠️ Never commit .env to GitHub.

🚀 Local Development Setup
1️⃣ Clone Repository
git clone https://github.com/yourusername/chatApp-v2.git
cd chatApp-v2

2️⃣ Backend Setup
cd backend
npm install
npm run dev


Runs on:

http://localhost:3000

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Runs on:

http://localhost:5173

🌍 Production Deployment
Backend (Render)

Root directory: backend

Build command: npm install

Start command: npm start

Set environment variables in Render dashboard

Frontend (Vercel)

Root directory: frontend

Build command: npm run build

Output directory: dist

🔐 Authentication Flow

JWT token stored in HTTP-only cookie

Secure & SameSite=None in production

CORS configured for Vercel domain

app.set("trust proxy", 1) enabled for secure cookies
