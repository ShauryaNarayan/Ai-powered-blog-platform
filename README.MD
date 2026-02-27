Inkwell: AI-Powered Blog Platform

A modern, full-stack blogging application that seamlessly integrates Artificial Intelligence to assist writers. Built with a React frontend and a Node.js/Express backend, this platform offers complete CRUD functionality for blog posts and leverages Google's state-of-the-art Gemini AI model to cure writer's block by generating topic ideas and introductory paragraphs on the fly.

Live Demo

Frontend (Vercel): [Insert your Vercel URL here]
Backend API (Render): https://ai-powered-blog-platform-1.onrender.com

(Note: The backend is hosted on a free Render tier. It may take 30-60 seconds to wake up on the initial load).

Features

Read & Write: Clean, minimalist UI to browse all published articles and read them in detailed views.
Full CRUD Operations: Users can Create, Read, Update, and Delete their blog posts securely.
AI Writing Assistant: Integrated with the gemini-2.0-flash model. Writers can input a draft title and content to instantly receive AI-generated related topics and introductory paragraphs.
Responsive Design: Optimized for both desktop and mobile viewing.
Relational Database: Robust local data storage using SQLite.

Tech Stack

Frontend: React.js (via Vite), React Router DOM (Navigation), Axios (API Requests), Lucide React (Icons), Custom CSS
Backend: Node.js & Express.js, SQLite3 (Database), @google/generative-ai (Gemini SDK), Cors & Dotenv

Local Setup & Installation

To run this project locally on your machine, follow these steps:

Clone the repository
git clone https://github.com/ShauryaNarayan/Ai-powered-blog-platform.git
cd Ai-powered-blog-platform

Backend Setup
Open a terminal and navigate to the backend folder:
cd backend
npm install

Create a .env file in the backend directory and add your Google Gemini API key:
PORT=5000
GEMINI_API_KEY=your_actual_api_key_here

Start the backend server:
node server.js
(The server will run on http://localhost:5000 and automatically initialize the SQLite database.)

Frontend Setup
Open a second terminal and navigate to the frontend folder:
cd frontend
npm install

Start the React development server:
npm run dev
(The frontend will run on http://localhost:5173. Ensure your Axios base URLs in the frontend code point to http://localhost:5000 for local testing).

API Endpoints

Blog Operations
GET /api/blogs - Fetch all blog posts.
GET /api/blogs/:id - Fetch a single blog post by ID.
POST /api/blogs - Create a new blog post.
PUT /api/blogs/:id - Update an existing blog post.
DELETE /api/blogs/:id - Delete a blog post.

AI Integration
POST /api/ai-suggestions - Send a draft (title and content) to receive an array of AI-generated suggestions formatted via Gemini 2.0 Flash.