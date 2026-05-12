# React Bolt

> Learn React by doing. A SQLBolt-style interactive tutorial for React fundamentals — written as a single self-contained HTML file.

![Module 1 - State & Inputs](https://img.shields.io/badge/Module%201-State%20%26%20Inputs-c14b2e)
![Lessons](https://img.shields.io/badge/Lessons-6-1a2332)
![Zero build step](https://img.shields.io/badge/Build-zero%20config-2d8659)

## What is this?

React Bolt is a guided, browser-based React tutorial inspired by [SQLBolt](https://sqlbolt.com/). Each lesson presents:

1. A short, focused **concept explanation** with a syntax pattern and common gotcha
2. A working **Example** component — code on the left, live render on the right
3. A small **"Your Turn"** exercise with starter code and a solution behind a toggle

The entire app is a single `index.html` file. It uses [CodeMirror](https://codemirror.net/) for syntax highlighting and [@babel/standalone](https://babeljs.io/docs/babel-standalone) to transpile your JSX in the browser, so there is no build step, no install, no server required. Open the file and learn.

## Live demo

Once you've deployed this repo with GitHub Pages (see below), your demo will live at:

```
https://<your-username>.github.io/<repo-name>/
```

## Module 1 — State & Inputs

| # | Lesson | Concept |
|---|---|---|
| 1.1 | useState | Storing a value that changes |
| 1.2 | Boolean state | Toggling true/false state |
| 1.3 | Conditional rendering | `&&`, ternary, and early return |
| 1.4 | Controlled inputs | Two-way binding for form fields |
| 1.5 | Multiple state variables | Independent vs grouped state |
| 1.6 | Updater function form | `setX(prev => ...)` and when you need it |

More modules coming: lists & keys, derived state, side effects (`useEffect`), and component communication.

## Running locally

Three options, easiest first.

### 1. Double-click

Just open `index.html` in any modern browser. That's it.

### 2. Local web server (recommended for some browsers)

Some Chromium-based browsers tighten CORS rules on `file://` origins. If anything misbehaves, serve the folder over HTTP:

```bash
# Python (any 3.x)
python -m http.server 8000

# Or Node.js
npx serve .
```

Then open <http://localhost:8000>.

### 3. VS Code Live Server

Install the **Live Server** extension, right-click `index.html`, and choose "Open with Live Server."

## Deploying to GitHub Pages

This repo is built so GitHub Pages can serve it as-is. No build, no actions, no configuration files needed.

### One-time setup

1. **Create the repo on GitHub.** From this folder:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

2. **Turn on GitHub Pages.** On the repo page, go to **Settings → Pages**. Under "Build and deployment", set:
   - **Source:** Deploy from a branch
   - **Branch:** `main`, folder `/ (root)`

3. **Save.** GitHub will build and publish within a minute or two. Your site will be at `https://<your-username>.github.io/<repo-name>/`.

### Updating later

Edit `index.html`, then:

```bash
git add index.html
git commit -m "Describe what changed"
git push
```

GitHub Pages picks up the change automatically.

## Project structure

```
react-bolt/
├── index.html       # The entire app — HTML, CSS, lesson data, and React code
├── README.md        # This file
├── LICENSE          # MIT
└── .gitignore       # Standard ignores
```

That's the whole project. No build, no `node_modules`, nothing to break in CI.

## How it works under the hood

- **React 18.3.1** and **ReactDOM 18.3.1** loaded as UMD bundles from cdnjs
- **@babel/standalone** transpiles every JSX snippet (lesson code and your exercise code) in the browser
- **CodeMirror 5** provides IDE-style JSX syntax highlighting, line numbers, bracket matching, and Tab handling
- **localStorage** persists your in-progress code and completed-lesson checkmarks between sessions

When you press **Run**, the user's code is wrapped, transpiled by Babel, evaluated with `new Function(...)`, and the returned component is mounted into a sandboxed `<div>` next to the editor. Errors are caught and displayed inline.

## Contributing

Have a clearer explanation, a better exercise prompt, or a bug fix? Open an issue or a PR. Each lesson is a self-contained object inside the `LESSONS` array in `index.html` — easy to add or tweak without touching anything else.

## License

[MIT](./LICENSE)
