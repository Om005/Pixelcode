# 🚀 Quick Access
[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://pixelcode-nine.vercel.app)
[![Portfolio](https://img.shields.io/badge/Visit-Portfolio-blue?style=for-the-badge)](https://www.om-chavda.me)

# 🧠 PIXELCODE – Online Code IDE
[🔗 Live Demo](https://pixelcode-nine.vercel.app) &nbsp;
**PIXELCODE** is a powerful, feature-rich **online code IDE** built using **React.js** (frontend) and **Node.js with Express** (backend). It allows users to write, run, and manage code across multiple languages with support for theme customization, file systems, and an AI assistant named **Nebula**, powered by **Gemini 1.5 Flash**.

---

## 🚀 Features

### 🧑‍💻 Guest Mode
- ✅ Run code in **10+ programming languages**
- 🎨 Choose from **20+ themes**
- 🔗 Generate **sharable code links**
- 🚫 Cannot save files or links
- 🚫 No access to **Nebula AI assistant**

### 🔐 Authenticated Mode
- 📂 Full access to **virtual file system**
  - Add, delete, rename, and modify files/folders
- 🧠 **Nebula AI assistant** for code help (Gemini-powered)
- 💾 Save your generated code links with **title & description**

---

## 📦 Backend API Endpoints

### 🔐 Authentication
| Endpoint | Description |
|---------|-------------|
| `POST /register` | Register a new user |
| `POST /login` | Log in a user |
| `POST /logout` | Log out user |
| `POST /send-verify-otp` | Send OTP for email verification |
| `POST /verify-account` | Verify user's email |
| `GET /is-auth` | Check if user is authenticated |
| `POST /send-reset-otp` | Send OTP for password reset |
| `POST /verify-reset-otp` | Verify password reset OTP |
| `POST /reset-password` | Reset user's password |

### 💬 AI Assistant (Nebula)
| Endpoint | Description |
|---------|-------------|
| `POST /response` | Get AI response for code help |

### 📁 File System & Link Management
| Endpoint | Description |
|---------|-------------|
| `POST /generate-link` | Generate shareable code link |
| `POST /get-links` | Retrieve saved code links |
| `POST /update-links` | Update link metadata |
| `POST /delete-links` | Delete saved link |
| `GET /get-file` | Get file content |
| `POST /update-link` | Update file content |
| `POST /makefolder` | Create folder |
| `POST /makefile` | Create file |
| `POST /delete` | Delete file/folder |
| `POST /rename` | Rename file/folder |
| `POST /idefile` | Get file for IDE view |
| `POST /writefile` | Write to a file |
| `POST /getnode` | Get file structure node |

### 👤 User
| Endpoint | Description |
|---------|-------------|
| `GET /data` | Get user data |
| `POST /sendemail` | Send email (internal) |

---

## 🛠️ Tech Stack

**Frontend:**
- React.js + Tailwind CSS
- RapidAPI for code execution
- Redux toolkit for state management
- Gemini 1.5 Flash (AI)
- Axios

**Backend:**
- Node.js with Express
- MongoDB (Mongoose)
- JWT for Auth
- Nodemailer / SendGrid for email
- Gemini AI SDK
- UUID for file/link IDs

---

## 🌐 Environment Variables

### 🧩 Frontend (`.env`)
```
VITE_RAPID_KEY=your_rapidapi_key
VITE_RAPID_HOST=your_rapidapi_host
VITE_BACKEND_URL=http://localhost:5000
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 🛡️ Backend (`.env`)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
SMTP_USER=your_email_user
SMTP_PASSWORD=your_email_password
SENDER_EMAIL=your_verified_sender_email
GEMINI_API_KEY=your_gemini_api_key
WEB_API_KEY=your_web_api_key
```

---

## 🧪 Local Setup Guide

### 📁 Clone the repository
```bash
git clone https://github.com/your-username/pixelcode.git
cd pixelcode
```

### 1. 🖥️ Setup Backend

```bash
cd server
npm install
```

👉 Create a `.env` file inside the `server` directory with the required keys mentioned above.

```bash
npm start
```
The backend will run on: `http://localhost:5000`

---

### 2. 💻 Setup Frontend

```bash
cd ../client
npm install
```

👉 Create a `.env` file inside the `client` directory with required frontend keys.

```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 🤖 Nebula – AI Coding Assistant

Nebula is available only to **authenticated users** and helps with:
- Debugging code
- Suggesting improvements
- Explaining code logic
- Generating snippets

Powered by Gemini 1.5 Flash via `@google/genai`.

---


## 💬 Feedback / Contact

Have suggestions or want to contribute?  
Feel free to open an issue or email me at: `chavdaom05@gmail.com`
