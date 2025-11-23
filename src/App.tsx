import { useState } from 'react';
import ConfigManager from './components/ConfigManager';
import FileBrowser from './components/FileBrowser';
import ShowcasePage from './components/ShowcasePage';
import BeautifulButtons from './components/BeautifulButtons';
import ButtonShowcase from './components/ButtonShowcase';
import ButtonTest from './components/ButtonTest';
import SimpleButtonTest from './components/SimpleButtonTest';
import TailwindTest from './TailwindTest';
import TailwindDirectTest from './TailwindDirectTest';
import TestTailwind from './TestTailwind';
import { Button } from './components/ui/button';
import type { StorageConfig } from './types/storage';

function App() {
  const [currentConfig, setCurrentConfig] = useState<StorageConfig | null>(null);
  const [showShowcase, setShowShowcase] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [triggerAddNew, setTriggerAddNew] = useState(false); // 用于触发添加新配置
  const [showBeautifulButtons, setShowBeautifulButtons] = useState(false); // 用于显示美丽按钮页面
  const [showButtonShowcase, setShowButtonShowcase] = useState(false); // 用于显示按钮展示页面
  const [showButtonTest, setShowButtonTest] = useState(false); // 用于显示按钮测试页面
  const [showSimpleButtonTest, setShowSimpleButtonTest] = useState(false); // 用于显示简单按钮测试页面
  const [showTailwindTest, setShowTailwindTest] = useState(false); // 用于显示Tailwind测试页面
  const [showTailwindDirectTest, setShowTailwindDirectTest] = useState(false); // 用于显示直接样式测试页面
  const [showTestTailwind, setShowTestTailwind] = useState(false); // 用于显示Tailwind测试页面

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 text-neutral-800">
      {showShowcase ? (
        <ShowcasePage />
      ) : showBeautifulButtons ? (
        <BeautifulButtons />
      ) : showButtonShowcase ? (
        <ButtonShowcase />
      ) : showButtonTest ? (
        <ButtonTest />
      ) : showSimpleButtonTest ? (
        <SimpleButtonTest />
      ) : showTailwindTest ? (
        <TailwindTest />
      ) : showTailwindDirectTest ? (
        <TailwindDirectTest />
      ) : showTestTailwind ? (
        <TestTailwind />
      ) : (
        <>
          <header className="sticky top-0 z-10 bg-white border-b border-neutral-200 shadow-sm">
            <div className="container-main py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-primary">
                阿里云 OSS 在线预览工具
              </h1>
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    setShowConfig(true);
                    // 触发添加新配置
                    setTriggerAddNew(prev => !prev);
                  }}
                  variant="gradient"
                  className="flex items-center space-x-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>添加配置</span>
                </Button>
                <Button
                  onClick={() => setShowConfig(!showConfig)}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <span>配置</span>
                </Button>
                <Button
                  onClick={() => setShowShowcase(true)}
                  variant="outline"
                >
                  View Showcase Page
                </Button>
                <Button
                  onClick={() => setShowBeautifulButtons(true)}
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span>美丽按钮</span>
                </Button>
                <Button
                  onClick={() => setShowButtonShowcase(true)}
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span>按钮展示</span>
                </Button>
                <Button
                  onClick={() => setShowButtonTest(true)}
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span>按钮测试</span>
                </Button>
                <Button
                  onClick={() => setShowSimpleButtonTest(true)}
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span>简单测试</span>
                </Button>
                <Button
                  onClick={() => setShowTailwindTest(true)}
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span>Tailwind测试</span>
                </Button>
                <Button
                  onClick={() => setShowTailwindDirectTest(true)}
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span>直接样式测试</span>
                </Button>
                <Button
                  onClick={() => setShowTestTailwind(true)}
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span>新Tailwind测试</span>
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1">
            <div className="container-main py-6">
              {showConfig && (
                <div className="card p-6 mb-6">
                  <ConfigManager
                    onConfigChange={setCurrentConfig}
                    onAddNew={() => setTriggerAddNew(prev => !prev)}
                    showAddButton={false} // 隐藏原有按钮
                    triggerAddNew={triggerAddNew}
                  />
                </div>
              )}

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
            variant="secondary"
          >
            Back to OSS Tool
          </Button>
        </div>
      )}

      {showBeautifulButtons && (
        <div className="fixed bottom-4 right-4">
          <Button
            onClick={() => setShowBeautifulButtons(false)}
            variant="dark"
          >
            返回主页面
          </Button>
        </div>
      )}

      {showButtonShowcase && (
        <div className="fixed bottom-4 right-4">
          <Button
            onClick={() => setShowButtonShowcase(false)}
            variant="secondary"
          >
            返回主页面
          </Button>
        </div>
      )}

      {showButtonTest && (
        <div className="fixed bottom-4 right-4">
          <Button
            onClick={() => setShowButtonTest(false)}
            variant="secondary"
          >
            返回主页面
          </Button>
        </div>
      )}

      {showSimpleButtonTest && (
        <div className="fixed bottom-4 right-4">
          <Button
            onClick={() => setShowSimpleButtonTest(false)}
            variant="secondary"
          >
            返回主页面
          </Button>
        </div>
      )}

      {showTailwindTest && (
        <div className="fixed bottom-4 right-4">
          <Button
            onClick={() => setShowTailwindTest(false)}
            variant="secondary"
          >
            返回主页面
          </Button>
        </div>
      )}

      {showTailwindDirectTest && (
        <div className="fixed bottom-4 right-4">
          <Button
            onClick={() => setShowTailwindDirectTest(false)}
            variant="secondary"
          >
            返回主页面
          </Button>
        </div>
      )}

      {showTestTailwind && (
        <div className="fixed bottom-4 right-4">
          <Button
            onClick={() => setShowTestTailwind(false)}
            variant="secondary"
          >
            返回主页面
          </Button>
        </div>
      )}
    </div>
  );
}

export default App;