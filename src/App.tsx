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
    <div className="min-h-screen bg-background text-foreground">
      {showShowcase ? (
        <ShowcasePage />
      ) : (
        <>
          <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                阿里云 OSS 在线预览工具
              </h1>
              <Button onClick={() => setShowShowcase(true)} variant="outline">
                View Showcase Page
              </Button>
            </div>
          </header>

          <main className="container mx-auto px-4 py-6">
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 mb-6">
              <ConfigManager onConfigChange={setCurrentConfig} />
            </div>

            <div className="bg-card rounded-xl border border-border shadow-sm p-6">
              <FileBrowser config={currentConfig} />
            </div>
          </main>

          <footer className="border-t border-border py-8 mt-8">
            <div className="container mx-auto px-4">
              <p className="text-center text-muted-foreground text-sm">
                © {new Date().getFullYear()} 阿里云 OSS 在线预览工具 - 优化版
              </p>
            </div>
          </footer>
        </>
      )}

      {showShowcase && (
        <div className="fixed bottom-4 right-4">
          <Button onClick={() => setShowShowcase(false)} variant="outline">
            Back to OSS Tool
          </Button>
        </div>
      )}
    </div>
  );
}

export default App;