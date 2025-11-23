import { useState } from 'react';
import ConfigManager from './components/ConfigManager';
import FileBrowser from './components/FileBrowser';
import ShowcasePage from './components/ShowcasePage';
import { Button } from './components/ui/button';
import type { StorageConfig } from './types/storage';

function App() {
  const [currentConfig, setCurrentConfig] = useState<StorageConfig | null>(null);
  const [showShowcase, setShowShowcase] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 text-neutral-800">
      {showShowcase ? (
        <ShowcasePage />
      ) : (
        <>
          <header className="sticky top-0 z-10 bg-white border-b border-neutral-200 shadow-sm">
            <div className="container-main py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-primary">
                阿里云 OSS 在线预览工具
              </h1>
              <Button
                onClick={() => setShowShowcase(true)}
                className="btn-secondary"
              >
                View Showcase Page
              </Button>
            </div>
          </header>

          <main className="flex-1">
            <div className="container-main py-6">
              <div className="card p-6 mb-6">
                <ConfigManager onConfigChange={setCurrentConfig} />
              </div>

              <div className="card p-6">
                <FileBrowser config={currentConfig} />
              </div>
            </div>
          </main>

          <footer className="border-t border-neutral-200 py-8 mt-8">
            <div className="container-main">
              <p className="text-center text-neutral-600 text-sm">
                © {new Date().getFullYear()} 阿里云 OSS 在线预览工具 - 优化版
              </p>
            </div>
          </footer>
        </>
      )}

      {showShowcase && (
        <div className="fixed bottom-4 right-4">
          <Button
            onClick={() => setShowShowcase(false)}
            className="btn-neutral"
          >
            Back to OSS Tool
          </Button>
        </div>
      )}
    </div>
  );
}

export default App;