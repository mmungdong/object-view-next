import { Button } from "@/components/ui/button";

export default function SimpleButtonTest() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">简单按钮测试</h1>

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">测试按钮样式</h2>

        <div className="space-y-4">
          <div>
            <p className="mb-2">默认按钮:</p>
            <Button variant="default">Default Button</Button>
          </div>

          <div>
            <p className="mb-2">渐变按钮:</p>
            <Button variant="gradient">Gradient Button</Button>
          </div>

          <div>
            <p className="mb-2">成功按钮:</p>
            <Button variant="success">Success Button</Button>
          </div>

          <div>
            <p className="mb-2">警告按钮:</p>
            <Button variant="warning">Warning Button</Button>
          </div>

          <div>
            <p className="mb-2">信息按钮:</p>
            <Button variant="info">Info Button</Button>
          </div>

          <div>
            <p className="mb-2">pulse按钮:</p>
            <Button variant="pulse">Pulse Button</Button>
          </div>
        </div>
      </div>
    </div>
  );
}