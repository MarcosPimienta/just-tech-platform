const LESSONS = [
  {
    id: '1.1',
    title: 'useState: storing a value that changes',
    concept: `
      <p>React components <strong>re-run their function on every render</strong>. Plain variables get reset each time. <code>useState</code> gives you a value that <em>persists</em> across renders.</p>
      <pre><code>const [count, setCount] = useState(0);</code></pre>
      <p>You get back an array with two things:</p>
      <ul>
        <li><code>count</code> — the current value</li>
        <li><code>setCount</code> — a function to update it (calling it triggers a re-render)</li>
      </ul>
      <p><code>useState(0)</code> sets the initial value to <code>0</code>. That argument is only used on the very first render.</p>
      <p><strong>Rule:</strong> never assign to <code>count</code> directly. Always go through <code>setCount</code>.</p>
    `,
    exampleCode: `function Example() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}`,
    exerciseDescription: `
      <p>Build a likes counter:</p>
      <ul>
        <li>State <code>likes</code>, starts at <code>0</code></li>
        <li>A <code>❤</code> button that increases the count by 1</li>
        <li>A <code>💔</code> button that decreases by 1, <strong>but never below 0</strong></li>
        <li>Display the current likes</li>
      </ul>
    `,
    starterCode: `function Exercise() {
  // Hint: const [likes, setLikes] = useState(0);

  return (
    <div>
      <p>Likes: 0</p>
      <button>❤</button>{' '}
      <button>💔</button>
    </div>
  );
}`,
    solution: `function Exercise() {
  const [likes, setLikes] = useState(0);

  return (
    <div>
      <p>Likes: {likes}</p>
      <button onClick={() => setLikes(likes + 1)}>❤</button>{' '}
      <button onClick={() => setLikes(Math.max(0, likes - 1))}>💔</button>
    </div>
  );
}`,
    test: async (container) => {
      const text = container.textContent;
      if (!text.includes('Likes: 0')) return { pass: false, message: "Initial state should show 'Likes: 0'." };
      
      const buttons = container.querySelectorAll('button');
      if (buttons.length < 2) return { pass: false, message: "Should have two buttons: ❤ and 💔." };
      
      buttons[0].click(); // ❤
      await new Promise(r => setTimeout(r, 10));
      if (!container.textContent.includes('Likes: 1')) return { pass: false, message: "❤ button should increase likes to 1." };
      
      buttons[1].click(); // 💔
      await new Promise(r => setTimeout(r, 10));
      if (!container.textContent.includes('Likes: 0')) return { pass: false, message: "💔 button should decrease likes back to 0." };
      
      buttons[1].click(); // 💔
      await new Promise(r => setTimeout(r, 10));
      if (!container.textContent.includes('Likes: 0') || container.textContent.includes('Likes: -1')) return { pass: false, message: "Likes should never go below 0." };

      return { pass: true, message: "Passed!" };
    }
  },

  {
    id: '1.2',
    title: 'Boolean state & toggling',
    concept: `
      <p><code>useState</code> works with any type of value, including <strong>booleans</strong> (<code>true</code> / <code>false</code>). Booleans are how you remember on/off states: open/closed, visible/hidden, expanded/collapsed.</p>
      <pre><code>const [isOn, setIsOn] = useState(false);</code></pre>
      <p>To <strong>toggle</strong> a boolean, set it to the opposite of its current value:</p>
      <pre><code>setIsOn(!isOn);</code></pre>
      <p>(There's a safer "updater function" form for this you'll see in Lesson 1.6. For now this works.)</p>
    `,
    exampleCode: `function Example() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div>
      <p>The light is: {isOn ? 'ON 💡' : 'OFF'}</p>
      <button onClick={() => setIsOn(!isOn)}>Toggle</button>
    </div>
  );
}`,
    exerciseDescription: `
      <p>Build a subscribe toggle:</p>
      <ul>
        <li>State <code>isSubscribed</code>, starts <code>false</code></li>
        <li>Display: <code>"You are subscribed ✅"</code> when on, <code>"Not subscribed ❌"</code> when off</li>
        <li>One button whose label <em>changes</em>: <code>"Subscribe"</code> when off, <code>"Unsubscribe"</code> when on</li>
      </ul>
    `,
    starterCode: `function Exercise() {
  // TODO: add boolean state and a toggle button

  return (
    <div>
      {/* your code here */}
    </div>
  );
}`,
    solution: `function Exercise() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <div>
      <p>{isSubscribed ? 'You are subscribed ✅' : 'Not subscribed ❌'}</p>
      <button onClick={() => setIsSubscribed(!isSubscribed)}>
        {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
      </button>
    </div>
  );
}`,
    test: async (container) => {
      if (!container.textContent.includes('Not subscribed ❌')) return { pass: false, message: "Initial state should show 'Not subscribed ❌'." };
      
      const btn = container.querySelector('button');
      if (!btn || btn.textContent !== 'Subscribe') return { pass: false, message: "Button should initially say 'Subscribe'." };
      
      btn.click();
      await new Promise(r => setTimeout(r, 10));
      if (!container.textContent.includes('You are subscribed ✅')) return { pass: false, message: "After clicking, it should show 'You are subscribed ✅'." };
      if (btn.textContent !== 'Unsubscribe') return { pass: false, message: "After clicking, button should say 'Unsubscribe'." };
      
      return { pass: true, message: "Passed!" };
    }
  },

  {
    id: '1.3',
    title: 'Conditional rendering',
    concept: `
      <p>Inside JSX, anything in <code>{ }</code> is regular JavaScript. That means you can use JS to decide what to render. Three common patterns:</p>
      <p><strong>1. The <code>&amp;&amp;</code> pattern</strong> — show something only if a condition is true:</p>
      <pre><code>{isLoggedIn &amp;&amp; &lt;p&gt;Welcome back!&lt;/p&gt;}</code></pre>
      <p><strong>2. The ternary</strong> — show one thing or another:</p>
      <pre><code>{isLoggedIn ? &lt;p&gt;Welcome&lt;/p&gt; : &lt;p&gt;Please log in&lt;/p&gt;}</code></pre>
      <p><strong>3. Early return</strong> — branch the whole component:</p>
      <pre><code>if (loading) return &lt;p&gt;Loading...&lt;/p&gt;;
return &lt;ActualUI /&gt;;</code></pre>
      <p><strong>Gotcha:</strong> <code>&amp;&amp;</code> with a number renders the number on screen.</p>
      <pre><code>{items.length &amp;&amp; &lt;List/&gt;}      // renders "0" when length is 0
{items.length &gt; 0 &amp;&amp; &lt;List/&gt;}  // ✓ compare to make it a boolean</code></pre>
    `,
    exampleCode: `function Example() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      {isLoggedIn
        ? <p>Welcome back, Alex!</p>
        : <p>Please log in.</p>}
      {isLoggedIn && <p>You have 3 new messages.</p>}
      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? 'Log out' : 'Log in'}
      </button>
    </div>
  );
}`,
    exerciseDescription: `
      <p>Build a counter that shows different messages depending on the value:</p>
      <ul>
        <li>State <code>count</code>, starts at <code>0</code></li>
        <li>A <code>+1</code> button</li>
        <li>If <code>count === 0</code> → show <code>"Empty!"</code></li>
        <li>If <code>count &gt; 0</code> → show the count</li>
        <li>If <code>count &gt;= 10</code> → ALSO show <code>"🔥 You're on fire!"</code></li>
      </ul>
    `,
    starterCode: `function Exercise() {
  const [count, setCount] = useState(0);

  return (
    <div>
      {/* TODO: show the right message(s) based on count */}
      <button>+1</button>
    </div>
  );
}`,
    solution: `function Exercise() {
  const [count, setCount] = useState(0);

  return (
    <div>
      {count === 0 && <p>Empty!</p>}
      {count > 0 && <p>Count: {count}</p>}
      {count >= 10 && <p>🔥 You're on fire!</p>}
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}`,
    test: async (container) => {
      if (!container.textContent.includes('Empty!')) return { pass: false, message: "When count is 0, it should show 'Empty!'." };
      
      const btn = container.querySelector('button');
      if (!btn) return { pass: false, message: "Should have a +1 button." };
      
      btn.click();
      await new Promise(r => setTimeout(r, 10));
      if (container.textContent.includes('Empty!')) return { pass: false, message: "Should not show 'Empty!' when count > 0." };
      if (!container.textContent.includes('Count: 1')) return { pass: false, message: "Should show 'Count: 1'." };
      
      for(let i=0; i<9; i++) btn.click();
      await new Promise(r => setTimeout(r, 10));
      if (!container.textContent.includes("🔥 You're on fire!")) return { pass: false, message: "Should show '🔥 You're on fire!' when count >= 10." };
      
      return { pass: true, message: "Passed!" };
    }
  },

  {
    id: '1.4',
    title: 'Controlled text inputs',
    concept: `
      <p>In React, form inputs are usually <strong>controlled</strong>: their value comes from state, and state updates on every keystroke.</p>
      <pre><code>const [text, setText] = useState('');

&lt;input
  value={text}                                // state drives the input
  onChange={(e) =&gt; setText(e.target.value)}   // input updates state
/&gt;</code></pre>
      <p>Now <code>text</code> is always in sync with what's on screen, and you can use it anywhere — display it, validate it, submit it.</p>
      <p><code>e.target.value</code> is always a <strong>string</strong>, even from <code>&lt;input type="number"&gt;</code>. If you need a number, convert with <code>Number(...)</code> or <code>parseInt(...)</code>.</p>
    `,
    exampleCode: `function Example() {
  const [name, setName] = useState('');

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Type your name"
      />
      <p>Hello, {name || 'stranger'}!</p>
    </div>
  );
}`,
    exerciseDescription: `
      <p>Build a character counter:</p>
      <ul>
        <li>A text input (or <code>&lt;textarea&gt;</code>) the user can type into</li>
        <li>Below it, show <code>"X / 100 characters"</code></li>
        <li>When the length goes <em>over</em> 100, show the count in red</li>
      </ul>
    `,
    starterCode: `function Exercise() {
  // TODO: state for the text

  return (
    <div>
      <textarea rows={3} cols={32} />
      <p>0 / 100 characters</p>
    </div>
  );
}`,
    solution: `function Exercise() {
  const [text, setText] = useState('');
  const isOver = text.length > 100;

  return (
    <div>
      <textarea
        rows={3}
        cols={32}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <p style={{ color: isOver ? 'red' : 'inherit' }}>
        {text.length} / 100 characters
      </p>
    </div>
  );
}`,
    test: async (container) => {
      const textarea = container.querySelector('textarea');
      if (!textarea) return { pass: false, message: "Should have a textarea." };
      if (!container.textContent.includes('0 / 100 characters')) return { pass: false, message: "Should show '0 / 100 characters' initially." };
      
      // Simulate typing
      const longText = 'a'.repeat(101);
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
      nativeInputValueSetter.call(textarea, longText);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      
      await new Promise(r => setTimeout(r, 10));
      if (!container.textContent.includes('101 / 100 characters')) return { pass: false, message: "Should show '101 / 100 characters' after typing." };
      
      // Check red color
      const p = container.querySelector('p');
      if (!p || !p.style.color || p.style.color !== 'red') return { pass: false, message: "Count should be red when over 100." };
      
      return { pass: true, message: "Passed!" };
    }
  },

  {
    id: '1.5',
    title: 'Multiple state variables',
    concept: `
      <p>A component can call <code>useState</code> as many times as you want. Each piece of state is independent.</p>
      <pre><code>const [firstName, setFirstName] = useState('');
const [lastName,  setLastName]  = useState('');</code></pre>
      <p><strong>Rule of thumb:</strong> split state when the values change independently. Group them into one object only when they always change together.</p>
      <p>If you do group them, you must spread the old state — otherwise you'll erase the other fields:</p>
      <pre><code>// BUG — this erases 'last'!
setForm({ first: 'Alex' });

// CORRECT
setForm({ ...form, first: 'Alex' });</code></pre>
      <p>For now, prefer separate <code>useState</code> calls. It's simpler.</p>
    `,
    exampleCode: `function Example() {
  const [first, setFirst] = useState('');
  const [last, setLast]   = useState('');

  return (
    <div>
      <input
        value={first}
        onChange={(e) => setFirst(e.target.value)}
        placeholder="First name"
      />{' '}
      <input
        value={last}
        onChange={(e) => setLast(e.target.value)}
        placeholder="Last name"
      />
      <p>Full name: {first} {last}</p>
    </div>
  );
}`,
    exerciseDescription: `
      <p>Build a sign-up form preview:</p>
      <ul>
        <li>Three inputs: <code>email</code>, <code>password</code>, <code>confirmPassword</code></li>
        <li>Show <code>"✅ Passwords match"</code> or <code>"❌ Passwords don't match"</code> below the inputs</li>
        <li>That match message should only appear when <strong>both</strong> password fields have something in them</li>
        <li>Show the entered email as: <code>"You entered: &lt;email&gt;"</code></li>
      </ul>
    `,
    starterCode: `function Exercise() {
  // TODO: three pieces of state — email, password, confirm

  return (
    <div>
      <div><input placeholder="Email" /></div>
      <div><input placeholder="Password" type="password" /></div>
      <div><input placeholder="Confirm password" type="password" /></div>
      {/* TODO: match message + email echo */}
    </div>
  );
}`,
    solution: `function Exercise() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const bothFilled = password.length > 0 && confirm.length > 0;
  const match = password === confirm;

  return (
    <div>
      <div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      </div>
      <div style={{ marginTop: 6 }}>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
      </div>
      <div style={{ marginTop: 6 }}>
        <input
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm password"
          type="password"
        />
      </div>
      {bothFilled && (
        <p>{match ? '✅ Passwords match' : "❌ Passwords don't match"}</p>
      )}
      <p>You entered: {email}</p>
    </div>
  );
}`,
    test: async (container) => {
      const inputs = container.querySelectorAll('input');
      if (inputs.length < 3) return { pass: false, message: "Should have 3 inputs: email, password, confirm." };
      
      const [email, pass, confirm] = inputs;
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      
      setter.call(email, 'test@test.com');
      email.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(r => setTimeout(r, 10));
      if (!container.textContent.includes('You entered: test@test.com')) return { pass: false, message: "Should show 'You entered: test@test.com'." };
      
      setter.call(pass, 'abc');
      pass.dispatchEvent(new Event('input', { bubbles: true }));
      setter.call(confirm, 'def');
      confirm.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(r => setTimeout(r, 10));
      if (!container.textContent.includes("❌ Passwords don't match")) return { pass: false, message: "Should show '❌ Passwords don't match' when different." };
      
      setter.call(confirm, 'abc');
      confirm.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(r => setTimeout(r, 10));
      if (!container.textContent.includes("✅ Passwords match")) return { pass: false, message: "Should show '✅ Passwords match' when same." };
      
      return { pass: true, message: "Passed!" };
    }
  },

  {
    id: '1.6',
    title: 'The updater function form',
    concept: `
      <p>Setters can be called with a value OR with a function:</p>
      <pre><code>setCount(count + 1);          // value form
setCount((c) =&gt; c + 1);       // updater function form</code></pre>
      <p>Most of the time they're equivalent. But when you update the same state multiple times in a row, the value form silently breaks:</p>
      <pre><code>// BUG: clicking only adds 1, not 3
function handleClick() {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
}</code></pre>
      <p>Why? <code>count</code> was captured at the start of the render — it's the same value all three times.</p>
      <pre><code>// CORRECT: each updater receives the latest value
function handleClick() {
  setCount((c) =&gt; c + 1);
  setCount((c) =&gt; c + 1);
  setCount((c) =&gt; c + 1);
}</code></pre>
      <p><strong>Rule:</strong> when the new state depends on the previous state, use the updater form. This matters especially inside <code>setTimeout</code>, async functions, and any handler that fires after a delay.</p>
    `,
    exampleCode: `function Example() {
  const [count, setCount] = useState(0);

  function addThreeBuggy() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  function addThreeCorrect() {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={addThreeBuggy}>+3 (buggy)</button>{' '}
      <button onClick={addThreeCorrect}>+3 (correct)</button>{' '}
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}`,
    exerciseDescription: `
      <p>Build a delayed counter:</p>
      <ul>
        <li>State <code>count</code>, starts at <code>0</code></li>
        <li>A button labeled <code>"+1 in 1 second"</code></li>
        <li>When clicked, wait 1 second (<code>setTimeout</code>), then increment</li>
        <li>The user might click the button several times quickly — <strong>every click should add 1, none should be lost</strong></li>
      </ul>
      <p>Try the value form first and watch the bug. Then switch to the updater form.</p>
    `,
    starterCode: `function Exercise() {
  const [count, setCount] = useState(0);

  function delayedIncrement() {
    // TODO: setTimeout that increments count after 1000ms
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={delayedIncrement}>+1 in 1 second</button>
    </div>
  );
}`,
    solution: `function Exercise() {
  const [count, setCount] = useState(0);

  function delayedIncrement() {
    setTimeout(() => {
      // Updater form is essential here — by the time this runs,
      // the captured 'count' could be stale if there were other clicks.
      setCount((c) => c + 1);
    }, 1000);
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={delayedIncrement}>+1 in 1 second</button>
    </div>
  );
}`,
    test: async (container) => {
      const btn = container.querySelector('button');
      if (!btn) return { pass: false, message: "Should have a button." };
      
      btn.click();
      btn.click();
      btn.click();
      await new Promise(r => setTimeout(r, 1100)); // wait for setTimeouts
      
      if (!container.textContent.includes('Count: 3')) return { pass: false, message: "Every click should add 1, so 3 clicks = Count: 3. Did you use the updater form `setCount(c => c + 1)`?" };
      
      return { pass: true, message: "Passed!" };
    }
  }
];
