import React from 'react';

const BeautifulButtons = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Beautiful Tailwind CSS Buttons</h1>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. 渐变按钮 */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">渐变按钮</h2>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl">
            渐变按钮
          </button>
        </div>

        {/* 2. 霓虹灯效果按钮 */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-white">霓虹灯效果</h2>
          <button className="px-6 py-3 bg-transparent border-2 border-cyan-500 text-cyan-400 font-medium rounded-lg hover:bg-cyan-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50 transition-all duration-300 animate-pulse">
            霓虹灯按钮
          </button>
        </div>

        {/* 3. 3D按钮 */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">3D按钮</h2>
          <button className="px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transform hover:-translate-y-1 transition-all duration-200 shadow-[0_6px_0_0_rgba(220,38,38,1)] hover:shadow-[0_4px_0_0_rgba(220,38,38,1)] active:shadow-[0_2px_0_0_rgba(220,38,38,1)] active:translate-y-1">
            3D按钮
          </button>
        </div>

        {/* 4. 柔和阴影按钮 */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">柔和阴影</h2>
          <button className="px-6 py-3 bg-indigo-100 text-indigo-700 font-medium rounded-lg hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50 transition-all duration-200 shadow-sm hover:shadow-md">
            柔和阴影
          </button>
        </div>

        {/* 5. 边框动画按钮 */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">边框动画</h2>
          <button className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50 transition-all duration-300 relative group">
            <span className="relative z-10">边框动画</span>
            <div className="absolute inset-0 rounded-lg border-2 border-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            <div className="absolute inset-0 rounded-lg border-2 border-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right delay-150"></div>
            <div className="absolute inset-0 rounded-lg border-2 border-indigo-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top delay-300"></div>
            <div className="absolute inset-0 rounded-lg border-2 border-indigo-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom delay-300"></div>
          </button>
        </div>

        {/* 6. 填充动画按钮 */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">填充动画</h2>
          <button className="px-6 py-3 bg-white text-green-600 font-medium rounded-lg hover:text-white focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50 transition-all duration-300 relative group overflow-hidden border-2 border-green-500">
            <span className="relative z-10">填充动画</span>
            <div className="absolute inset-0 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>

        {/* 7. 图标按钮 */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">图标按钮</h2>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>图标按钮</span>
          </button>
        </div>

        {/* 8. 毛玻璃效果按钮 */}
        <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-white">毛玻璃效果</h2>
          <button className="px-6 py-3 backdrop-blur-sm bg-white/30 text-white font-medium rounded-lg hover:bg-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-200 shadow-lg border border-white/20">
            毛玻璃效果
          </button>
        </div>

        {/* 9. 极简按钮 */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">极简按钮</h2>
          <button className="px-6 py-3 bg-black text-white font-medium rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200">
            极简按钮
          </button>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="max-w-4xl mx-auto mt-12 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">使用说明</h2>
        <div className="space-y-4 text-gray-600">
          <p>这些按钮样式可以直接复制到你的项目中使用。每个按钮都使用了Tailwind CSS类来实现不同的视觉效果。</p>
          <p>你可以根据需要调整颜色、大小、圆角等属性。以下是一些常用的自定义选项：</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>颜色</strong>: 将<code className="bg-gray-100 px-1 rounded">blue</code>替换为你喜欢的颜色</li>
            <li><strong>大小</strong>: 调整<code className="bg-gray-100 px-1 rounded">px-6 py-3</code>来改变按钮尺寸</li>
            <li><strong>圆角</strong>: 使用<code className="bg-gray-100 px-1 rounded">rounded-lg</code>或<code className="bg-gray-100 px-1 rounded">rounded-full</code>来调整圆角</li>
            <li><strong>阴影</strong>: 使用<code className="bg-gray-100 px-1 rounded">shadow-md</code>到<code className="bg-gray-100 px-1 rounded">shadow-2xl</code>来调整阴影</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BeautifulButtons;