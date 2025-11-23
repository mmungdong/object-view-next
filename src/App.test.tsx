import { useState } from 'react';

function App() {
  const [message, setMessage] = useState('Hello World');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            阿里云 OSS 在线预览工具
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">测试内容</h2>
          <p className="mb-4">{message}</p>
          <button
            onClick={() => setMessage('按钮已点击!')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            点击我
          </button>
        </div>
      </main>

      <footer className="bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} 阿里云 OSS 在线预览工具 - 初版
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;