import { useState } from 'react';

function App() {
  const [message, setMessage] = useState('如果看到这个消息，说明React正常工作');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            调试页面
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">测试内容</h2>
          <p className="mb-4">{message}</p>
          <button
            onClick={() => setMessage('按钮已点击! React正常工作')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            点击测试
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;