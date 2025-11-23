import { useState } from 'react';

function App() {
  const [message, setMessage] = useState('Hello World');

  return (
    <div>
      <h1>Minimal Test</h1>
      <p>{message}</p>
      <button onClick={() => setMessage('Button clicked!')}>
        Click me
      </button>
    </div>
  );
}

export default App;