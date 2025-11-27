'use client';

import { useState, useEffect } from 'react';
import ConfigModal from '../components/ConfigModal';
import FileBrowser from '../components/FileBrowser';
import { Button } from '../components/ui/button';
import type { StorageConfig } from '../types/storage';
import { renewConfigCookie } from '../utils/cookieUtils';

export default function Home() {
  const [currentConfig, setCurrentConfig] = useState<StorageConfig | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // 在页面加载时续期cookie
  useEffect(() => {
    renewConfigCookie();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 text-neutral-800">
      <header className="sticky top-0 z-10 bg-white border-b border-neutral-200 shadow-sm">
        <div className="container-main py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-primary text-center sm:text-left">
            阿里云 OSS 在线预览工具
          </h1>
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              onClick={() => setShowConfigModal(true)}
              variant="gradient"
              className="btn btn-gradient-primary flex items-center space-x-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <span>配置</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container-main py-6">
          {/* 原有的配置管理区域已移除，改为使用模态框 */}

          <div className="card p-6 transition-all duration-300 hover:shadow-lg hover-lift animate-fade-in">
            <FileBrowser config={currentConfig} />
          </div>
        </div>
      </main>

      {/* 配置模态框 */}
      <ConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onConfigChange={setCurrentConfig}
      />

      <footer className="border-t border-neutral-200 py-8 mt-8 bg-white">
        <div className="container-main">
          <p className="text-center text-neutral-600 text-sm">
            © {new Date().getFullYear()} 阿里云 OSS 在线预览工具 - 优化版
          </p>
        </div>
      </footer>
    </div>
  );
}