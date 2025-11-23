export default function TailwindTest() {
  return (
    <div className="p-8 bg-blue-500 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Tailwind CSS 测试</h1>
      <p className="text-lg mb-4">如果这个文本是蓝色背景白色字，并且字体很大，说明Tailwind CSS正常工作。</p>

      <div className="mt-8 p-4 bg-red-500 rounded-lg">
        <p className="text-xl">这个应该有红色背景和圆角</p>
      </div>

      <div className="mt-4 p-4 bg-green-200 text-green-800 rounded-lg flex items-center">
        <div className="w-12 h-12 bg-yellow-400 rounded-full mr-4"></div>
        <p>这个应该有浅绿色背景，深绿色文字，黄色圆圈</p>
      </div>
    </div>
  );
}