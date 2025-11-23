import { useState, useEffect } from 'react';

function DebugApp() {
  const [message, setMessage] = useState('Hello World');

  useEffect(() => {
    console.log('DebugApp mounted');
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
      <h1>Debug App</h1>
      <p>{message}</p>
      <button onClick={() => setMessage('Button clicked!')}>
        Click me
      </button>
    </div>
  );
}

export default DebugApp;