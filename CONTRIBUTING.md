# Contributing to React Bolt

Thanks for considering a contribution. The project is small and intentionally simple to keep the contribution loop tight.

## Project philosophy

- **One file.** Everything lives in `index.html`. No build step, no bundler, no dependencies to install.
- **SQLBolt-style.** Each lesson is small, focused, and includes a working example plus a tiny exercise.
- **Beginner-first.** If a sentence assumes prior React knowledge that hasn't been taught yet in the lesson order, rewrite it.

## Adding or editing a lesson

Lessons are objects inside the `LESSONS` array in `index.html`. Each lesson has the following shape:

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

## Style notes

- Keep `concept` and `exerciseDescription` short. Aim for 3–5 sentences plus one code snippet in concept.
- The example should isolate the lesson's concept. Don't introduce features the lesson hasn't taught.
- The starter code should give just enough scaffolding so the learner isn't starting from a blank file, but not so much that the answer is obvious.
- Use double quotes inside JSX attributes and single quotes for JS strings, to match existing style.

## Testing your change

1. Open `index.html` in a browser (or via local server).
2. Click through to your new lesson in the sidebar.
3. Verify the example renders, the editor compiles your starter code without errors, and the solution renders too.
4. Try the `Reset` and `Show solution` buttons.

That's the whole test plan.

## Submitting

Open a PR with a short description. Screenshots help if you're changing visual styling.
