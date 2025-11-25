import { Button } from "@/components/ui/button";

export default function ButtonTest() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">按钮样式测试</h1>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">基础变体</h2>
          <div className="space-y-3">
            <Button variant="default" className="w-full">Default</Button>
            <Button variant="secondary" className="w-full">Secondary</Button>
            <Button variant="outline" className="w-full">Outline</Button>
            <Button variant="destructive" className="w-full">Destructive</Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">增强变体</h2>
          <div className="space-y-3">
            <Button variant="gradient" className="w-full">Gradient</Button>
            <Button variant="success" className="w-full">Success</Button>
            <Button variant="warning" className="w-full">Warning</Button>
            <Button variant="info" className="w-full">Info</Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">特殊变体</h2>
          <div className="space-y-3">
            <Button variant="dark" className="w-full">Dark</Button>
            <Button variant="pulse" className="w-full">Pulse</Button>
            <Button variant="ghost" className="w-full">Ghost</Button>
            <Button variant="link" className="w-full">Link</Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">尺寸变体</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}