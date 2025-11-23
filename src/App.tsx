import { useState } from 'react';
import ConfigManager from './components/ConfigManager';
import FileBrowser from './components/FileBrowser';
import type { StorageConfig } from './types/storage';

function App() {
  const [currentConfig, setCurrentConfig] = useState<StorageConfig | null>(null);

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
        <ConfigManager onConfigChange={setCurrentConfig} />

        <div className="bg-white rounded-lg shadow p-6">
          <FileBrowser config={currentConfig} />
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