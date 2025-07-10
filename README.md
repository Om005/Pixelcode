# 🚀 Quick Access
[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://pixelcode-nine.vercel.app)
[![Portfolio](https://img.shields.io/badge/Visit-Portfolio-blue?style=for-the-badge)](https://www.om-chavda.me)

# 🧠 PIXELCODE – Online Collaborative Code IDE

**PIXELCODE** is a powerful, **collaborative online code IDE** built with **React.js** (frontend) and **Node.js with Express** (backend).  
It supports writing and running code in over 10 programming languages with 20+ customizable themes. Users can manage their own personal projects, each with a separate and persistent file system. For real-time collaboration, users can create or join coding **rooms** using a room ID or shared link. In a room, teammates or friends can code together live, with the **admin** (room creator) having control to block any participant — preventing them from rejoining. PIXELCODE also offers sharable code links with link update access limited to the link generator. Whether working solo or with a team, the experience is enhanced by a powerful virtual file system, streamlined project management, and **Nebula**, an AI assistant powered by **Gemini 1.5 Flash**.


## 🚀 Features

### 🧑‍💻 Guest Mode
- ✅ Run code in **10+ programming languages**
- 🎨 Choose from **20+ themes**
- 🔗 Generate **sharable code links**
- 🚫 Cannot save files or links
- 🚫 No access to **Nebula AI assistant**

### 🔐 Authenticated Mode
- 📁 Create and manage **multiple projects**, each with its **own isolated file system**
- 📂 Full access to **virtual file system**
  - Add, delete, rename, and modify files/folders
- 🧠 **Nebula AI assistant** for code help (Gemini-powered)
- 💾 Save your generated code links with **title & description**

### 👥 Real-Time Collaboration
- 🔗 Create a **coding room** or **join using room ID or link**
- 📝 Code together in real-time with friends
- 🚫 **Room admin** can **block participants** to control access
---

## 📦 Backend API Endpoints

### 👤 User
| Endpoint | Description |
|---------|-------------|
| `GET /data` | Get user data |
| `POST /sendemail` | Send email (internal) |

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

### 📂 Project Management
| Endpoint               | Description                                         |
|------------------------|-----------------------------------------------------|
| `POST /create`         | Create new project with a fresh file system         |
| `POST /delete`         | Delete a project                                    |
| `POST /get`            | Get list of all projects                            |
| `POST /rename`         | Rename an existing project                          |
| `POST /getproject`     | Get project details and structure                   |

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

### 🏠 Room Collaboration Endpoints
| Endpoint                  | Description                                   |
|---------------------------|-----------------------------------------------|
| `POST /room/makeroom`     | Create a new collaboration room               |
| `POST /room/findroom`     | Join or lookup existing room by ID or link    |
| `POST /room/blockuser`    | Block a user from joining the room            |
| `POST /room/makefolder`   | Create a folder inside the room filesystem    |
| `POST /room/makefile`     | Create a file inside the room filesystem      |
| `POST /room/delete`       | Delete file/folder inside the room            |
| `POST /room/rename`       | Rename file/folder inside the room            |
| `POST /room/roomfile`     | Get a specific file’s content in the room     |
| `POST /room/writefile`    | Write/update content of a room file           |
| `POST /room/getnode`      | Get file/folder tree for the room             |

### 💬 AI Assistant (Nebula)
| Endpoint | Description |
|---------|-------------|
| `POST /response` | Get AI response for code help |


---

## 🛠️ Tech Stack

**Frontend:**
- React.js + Tailwind CSS
- Onecompiler API for code execution
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
## 🔄 Real‑Time Collaboration
- **socket.io-client** (frontend)  
- **socket.io** (backend)  

## 🤖 Nebula – AI Coding Assistant
---

Nebula is available only to **authenticated users** and helps with:
- Debugging code
- Suggesting improvements
- Explaining code logic
- Generating snippets

Powered by Gemini 1.5 Flash via `@google/genai`.

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
git clone https://github.com/Om005/Pixelcode.git
cd pixelcode
```

### 1. 🖥️ Setup Backend

```bash
cd Backend
npm install
```

👉 Create a `.env` file inside the `Backend` directory with the required keys mentioned above.

```bash
npm start
```
The backend will run on: `http://localhost:4000`

---

### 2. 💻 Setup Frontend

```bash
cd ../Frontend
npm install
```

👉 Create a `.env` file inside the `Frontend` directory with required frontend keys.

```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

---



## 💬 Feedback / Contact

Have suggestions or want to contribute?  
Feel free to open an issue or email me at: `chavdaom05@gmail.com`
