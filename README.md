# Just Tech Platform 🚀

An interactive, community-driven learning platform for modern technologies. Master React, Python, and Linux through hands-on exercises with real-time validation.

---

## 🛠️ Technology Stack
- **Framework:** Next.js 16 (App Router)
- **Database:** SQLite + Prisma
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS (Modern Glassmorphism)
- **Visuals:** tsparticles (Interactive Nodes)
- **Editors:** CodeMirror 6 + Babel Standalone (React Runner)

---

## 📖 Course Creation Guide

### 1. Creating via GUI (Community Mode)
Ideal for contributors who want to propose new lessons or courses.
1.  Navigate to `/create-course`.
2.  Fill in the **Course Identity**:
    - **Title:** The name of the course (e.g., "Advanced Hooks").
    - **Category:** The tech it belongs to (e.g., "React").
    - **Engine:** Select between React, Python, or Terminal.
3.  Use the **Lesson Builder** to add interactive exercises:
    - **Concept:** Markdown/HTML explanation.
    - **Example:** Working code snippet.
    - **Exercise:** Instructions for the student.
    - **Starter Code:** What the student sees first.
    - **Validation Test:** An async function that receives the `container` DOM node and returns `{ pass: boolean, message: string }`.

### 2. Creating via Code (Developer Mode)
Ideal for rapid development and syncing local content to the database.
1.  Define your lessons in `src/data/<tech>Lessons.ts` following the `LESSONS` array structure.
2.  Update `prisma/seed.ts` if you create a new file.
3.  Run the seed command:
    ```bash
    npx prisma db seed
    ```
    *This will upsert your code-based lessons into the database, grouping them by their title prefix (e.g., "useState: ...").*

---

## 🤖 AI Material Generation Prompt

Use the following prompt to generate high-quality course material for the platform. It ensures the output is perfectly formatted for our `LESSONS` array.

> [!IMPORTANT]
> **Prompt:**
> "Generate an interactive lesson for the 'Just Tech Platform' following this exact TypeScript structure:
> 
> ```typescript
> {
>   id: 'unique_id',
>   title: 'Topic: Lesson Name', // Use ':' to group by topic
>   concept: '<p>HTML explanation of the concept.</p>',
>   exampleCode: 'function Example() { ... }',
>   exerciseDescription: '<p>What the user needs to do.</p>',
>   starterCode: 'function Exercise() { ... }',
>   solution: 'function Exercise() { ... }',
>   test: async (container) => {
>     // Use container.textContent.includes() or container.querySelector()
>     // Return { pass: true, message: "Passed!" } or { pass: false, message: "Error" }
>   }
> }
> ```
> 
> Topic: [YOUR TOPIC HERE]
> Difficulty: [Beginner/Intermediate/Advanced]
> Focus on interactive validation and clear conceptual explanation."

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm/pnpm

### Installation
1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Set up the database: `npx prisma migrate dev`
4.  Run the development server: `npm run dev`

---

## 📄 License
Built with ❤ by the community for the community.
