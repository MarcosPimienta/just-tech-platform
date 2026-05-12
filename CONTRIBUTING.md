# Contributing to Just Tech Platform

Thanks for considering a contribution! The project is designed as a Hub for interactive learning, where different technologies live in their own modules.

## Project Philosophy

- **Modular Hub.** Each technology has its own folder under `tech/` (e.g., `tech/react/`, `tech/javascript/`).
- **SQLBolt-style.** Each lesson is small, focused, and includes a working example plus a tiny exercise.
- **Beginner-first.** If a sentence assumes prior knowledge that hasn't been taught yet, rewrite it.

## Architecture

- `index.html` — The main Hub landing page.
- `tech/<topic>/` — Directory containing everything for a specific topic.
  - `tech/<topic>/index.html` — The application shell (UI, Editor, Preview, Compiler).
  - `tech/<topic>/lessons.js` — The actual content (lessons, examples, starter code).

## Adding or Editing a Lesson

If you want to add a lesson to an existing module (like React), you don't need to touch the complex application shell! 

Simply open `tech/<topic>/lessons.js` and add an object to the `LESSONS` array:

```js
{
  id: '1.7',
  title: 'Short, descriptive title',

  // HTML — short prose, code blocks, and a "gotcha" or "rule" callout.
  concept: `
    <p>One or two paragraphs of explanation.</p>
    <pre><code>const [x, setX] = useState(0);</code></pre>
    <p><strong>Rule:</strong> ...</p>
  `,

  // The working example component (named "Example").
  exampleCode: `function Example() {
    // ...
    return <div>...</div>;
  }`,

  // HTML — what the exercise asks the learner to build.
  exerciseDescription: `
    <p>Build X that does Y.</p>
    <ul>
      <li>Requirement one</li>
      <li>Requirement two</li>
    </ul>
  `,

  // The starter code (named "Exercise") — what shows in the editor on first load.
  starterCode: `function Exercise() {
    // TODO
    return <div></div>;
  }`,

  // The reference solution (also named "Exercise").
  solution: `function Exercise() {
    // ...
  }`,
}
```

## Creating a New Module (e.g., Vanilla JS, Angular)

1. **Duplicate an existing module:** Copy `tech/react/` to `tech/javascript/`.
2. **Modify the Shell:** Open `tech/javascript/index.html`. You will need to remove Babel and the React imports if they aren't needed. Update the `compileComponent` function to use a simple `eval()` or standard DOM creation instead of React rendering.
3. **Write Lessons:** Clear out the `LESSONS` array in `tech/javascript/lessons.js` and start adding your new content.
4. **Link it in the Hub:** Open the root `index.html` and update the link for your new module in the grid so users can navigate to it.

## Testing Your Change

Since we split the lessons into a separate `.js` file, modern browsers may block loading it via the `file://` protocol due to CORS restrictions.

1. **Run a local server** in the root directory:
   - Run `npx serve -p 3000`
2. Open `http://localhost:3000` (or the port your server provided) in your browser.
3. Navigate to your module and verify the lessons load properly.
4. Try the `Reset` and `Show solution` buttons.

## Submitting

Open a PR with a short description. Screenshots help if you're changing visual styling!
