import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ButtonShowcase() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">按钮样式展示</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">基础变体</h2>
            <div className="space-y-3">
              <Button variant="default" className="w-full">Default</Button>
              <Button variant="secondary" className="w-full">Secondary</Button>
              <Button variant="outline" className="w-full">Outline</Button>
              <Button variant="destructive" className="w-full">Destructive</Button>
              <Button variant="ghost" className="w-full">Ghost</Button>
              <Button variant="link" className="w-full">Link</Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">增强变体</h2>
            <div className="space-y-3">
              <Button variant="gradient" className="w-full">Gradient</Button>
              <Button variant="success" className="w-full">Success</Button>
              <Button variant="warning" className="w-full">Warning</Button>
              <Button variant="info" className="w-full">Info</Button>
              <Button variant="dark" className="w-full">Dark</Button>
              <Button variant="pulse" className="w-full">Pulse</Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">尺寸变体</h2>
            <div className="space-y-3">
              <Button size="sm" className="w-full">Small</Button>
              <Button size="default" className="w-full">Default</Button>
              <Button size="lg" className="w-full">Large</Button>
              <Button size="circle">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>

            <h3 className="text-lg font-medium mt-6 mb-4 text-gray-700">交互测试</h3>
            <div className="space-y-3">
              <Button onClick={() => setCount(count + 1)} className="w-full">
                点击计数: {count}
              </Button>
              <Button disabled className="w-full">禁用状态</Button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">按钮组合</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="gradient">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              带图标按钮
            </Button>
            <Button variant="success">成功操作</Button>
            <Button variant="warning">警告操作</Button>
            <Button variant="destructive">危险操作</Button>
          </div>
        </div>
      </div>
    </div>
  );
}