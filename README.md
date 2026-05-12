# Just Tech Platform 🚀

An interactive learning platform for modern developers. Learn React, Linux, Python, and more through hands-on, in-browser exercises.

## 🌟 Features

### 1. Interactive Learning Environment
- **Multi-Engine Support**: Choose between React Preview, Python Interpreter (WASM), and Linux Terminal (xterm.js).
- **Real-time Validation**: Instant feedback on your code with custom test suites for every lesson.
- **Pluggable Runners**: Secure, browser-based execution using Babel, Pyodide, and WebContainers.

### 2. Course Creation Module
- **Intuitive Builder**: Create topics and lessons with a powerful drag-and-drop-style curriculum builder.
- **Lesson Builder**: Full-featured editor with CodeMirror integration for writing concepts, starter code, and validation logic.
- **Smart Templates**: Automatically provides appropriate boilerplate based on the course engine.

### 3. Community & Review System
- **Suggest Edits**: Students can propose improvements to any lesson content or code.
- **Admin Review Dashboard**: Centralized hub for admins to diff, approve, or reject community contributions.
- **One-Click Deployment**: Approved changes are instantly applied to live courses.

### 4. Robust Security
- **Authentication**: Secure login/registration via NextAuth.
- **Route Protection**: Role-based access control (RBAC) ensuring only admins can access sensitive builder and review tools.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (Turbopack)
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Vanilla CSS / Tailwind CSS
- **Editors**: CodeMirror
- **Transpilation**: @babel/standalone

## 🚀 Getting Started

1.  **Clone & Install**:
    ```bash
    git clone [repo-url]
    npm install
    ```

2.  **Environment Setup**:
    Create a `.env` file with:
    ```env
    DATABASE_URL="file:./dev.db"
    NEXTAUTH_SECRET="your-secret"
    NEXTAUTH_URL="http://localhost:3000"
    ```

3.  **Database Migration**:
    ```bash
    npx prisma migrate dev
    ```

4.  **Run Development**:
    ```bash
    npm run dev
    ```

## 📖 Roadmap

- [x] Course Creation API & UI
- [x] Multi-Engine Foundation (React, Python, Terminal)
- [x] Suggest Edits & Admin Dashboard
- [ ] Implement Full Python WASM (Pyodide) Integration
- [ ] Implement Full Linux Terminal (WebContainer) Integration
- [ ] User Progress Analytics & Certificates
