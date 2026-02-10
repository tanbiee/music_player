# Music Player Project - Run Instructions

Follow these steps to run the complete project (Frontend + Backend) on your local machine.

## 1. Prerequisites
- **Node.js**: Installed on your system.
- **MongoDB**: Must be installed and running locally for Login/Signup to work.
    - If you don't have MongoDB, the music player will still work, but you cannot Log In or Sign Up.

## 2. One-Time Setup (Install Dependencies)
Open a terminal in the main project folder (`music_player_fresh`) and run:

### Setup Backend
```bash
cd backend
npm install
cd ..
```

### Setup Frontend
```bash
cd Frontend
npm install
cd ..
```

---

## 3. How to Run (Development Mode)
You need to open **TWO separate terminals** to run both servers simultaneously.

### Terminal 1: Start Backend (API)
```bash
cd backend
npm run dev
```
*   You should see: `Server running on port 5000` and `MongoDB connected` (if DB is running).

### Terminal 2: Start Frontend (UI)
```bash
cd Frontend
npm run dev
```
*   You will see a Local URL, typically: `http://localhost:5173/`
*   **Ctrl + Click** that link to open the app in your browser.

---

## 4. Troubleshooting

### "MongoDB Connection Error"
- If you see `connect ECONNREFUSED 127.0.0.1:27017` in the backend terminal:
    - It means your local MongoDB service is not running.
    - **Fix:** Search for "MongoDB Compass" or "mongod" on your computer and start the service.
    - **Note:** The Music Player UI will still open and play music without the database. Only Login/Signup will fail.

### "Module not found"
- If you see errors about missing modules (e.g., `axios`, `react`):
    - You might have skipped step 2.
    - Run `npm install` inside the folder where the error occurred (`backend` or `Frontend`).
